// WLED network discovery: mDNS (_wled._tcp) + /24 subnet sweep, merged and confirmed via /json/info.
// Zero dependencies: mDNS is a minimal hand-rolled DNS query/parse over node:dgram.
const dgram = require('node:dgram');
const os = require('node:os');

const MDNS_ADDR = '224.0.0.251';
const MDNS_PORT = 5353;
const WLED_SERVICE = '_wled._tcp.local';

function encodeDnsName(name) {
  const parts = name.split('.').filter(Boolean);
  const bufs = parts.map(p => Buffer.concat([Buffer.from([p.length]), Buffer.from(p, 'utf8')]));
  return Buffer.concat([...bufs, Buffer.from([0])]);
}

function buildPtrQuery(serviceName) {
  const header = Buffer.alloc(12); // id=0, flags=0, qdcount=1
  header.writeUInt16BE(1, 4);
  const qtail = Buffer.alloc(4);
  qtail.writeUInt16BE(12, 0);      // PTR
  qtail.writeUInt16BE(0x8001, 2);  // IN, unicast-response requested
  return Buffer.concat([header, encodeDnsName(serviceName), qtail]);
}

// Reads a (possibly compressed) DNS name; returns { name, next }
function readDnsName(buf, offset) {
  const labels = [];
  let pos = offset;
  let next = -1;
  for (let hops = 0; hops < 64 && pos < buf.length; hops++) {
    const len = buf[pos];
    if (len === 0) { pos += 1; break; }
    if ((len & 0xc0) === 0xc0) {
      if (pos + 1 >= buf.length) break;
      if (next < 0) next = pos + 2;
      pos = ((len & 0x3f) << 8) | buf[pos + 1];
      continue;
    }
    labels.push(buf.toString('utf8', pos + 1, pos + 1 + len));
    pos += 1 + len;
  }
  return { name: labels.join('.'), next: next >= 0 ? next : pos };
}

// Parses a DNS response into resource records: [{ name, type, data, rdataName }]
function parseDnsRecords(buf) {
  if (buf.length < 12) return [];
  const qd = buf.readUInt16BE(4);
  const total = buf.readUInt16BE(6) + buf.readUInt16BE(8) + buf.readUInt16BE(10);
  let pos = 12;
  for (let i = 0; i < qd && pos < buf.length; i++) {
    pos = readDnsName(buf, pos).next + 4;
  }
  const records = [];
  for (let i = 0; i < total && pos + 10 <= buf.length; i++) {
    const { name, next } = readDnsName(buf, pos);
    pos = next;
    if (pos + 10 > buf.length) break;
    const type = buf.readUInt16BE(pos);
    const rdlen = buf.readUInt16BE(pos + 8);
    const rdStart = pos + 10;
    const rec = { name: name.toLowerCase(), type };
    if (type === 1 && rdlen === 4) rec.data = Array.from(buf.subarray(rdStart, rdStart + 4)).join('.');
    if (type === 12 || type === 33) {
      rec.rdataName = readDnsName(buf, type === 33 ? rdStart + 6 : rdStart).name.toLowerCase();
    }
    records.push(rec);
    pos = rdStart + rdlen;
  }
  return records;
}

// Sends an mDNS PTR query for WLED and collects responder IPs for `timeoutMs`.
// The query goes out from an ephemeral port so responders answer us directly (RFC 6762 legacy unicast);
// on 5353 those direct replies would be swallowed by the OS mDNS daemon (mDNSResponder/Bonjour) sharing the port.
// A second socket joined to the multicast group catches responders that answer via multicast instead.
function mdnsDiscover({ timeoutMs = 2500 } = {}) {
  return new Promise((resolve) => {
    const found = new Set();
    const sockets = [];
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      sockets.forEach(s => { try { s.close(); } catch (_) {} });
      resolve(Array.from(found));
    };

    const onMessage = (msg, rinfo) => {
      if (msg.length < 12 || !(msg.readUInt16BE(2) & 0x8000)) return; // responses only
      let records;
      try { records = parseDnsRecords(msg); } catch (_) { return; }
      const isWled = records.some(r => r.name.includes('_wled._tcp') || (r.rdataName && r.rdataName.includes('_wled._tcp')));
      if (!isWled) return;
      const aRecords = records.filter(r => r.type === 1 && r.data);
      if (aRecords.length > 0) aRecords.forEach(r => found.add(r.data));
      else if (rinfo && rinfo.address) found.add(rinfo.address);
    };

    const query = buildPtrQuery(WLED_SERVICE);

    // Sender: ephemeral port, receives direct (unicast) answers
    const sender = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    sockets.push(sender);
    sender.on('message', onMessage);
    sender.on('error', () => {});
    sender.bind(0, () => {
      try { sender.setMulticastTTL(255); } catch (_) {}
      const send = () => { if (!finished) sender.send(query, MDNS_PORT, MDNS_ADDR, () => {}); };
      send();
      // Repeat: ESP-based responders occasionally miss the first multicast
      setTimeout(send, 700);
    });

    // Listener: shared 5353 + group membership, receives multicast answers (best effort)
    const listener = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    sockets.push(listener);
    listener.on('message', onMessage);
    listener.on('error', () => {});
    listener.bind(MDNS_PORT, () => {
      try { listener.addMembership(MDNS_ADDR); } catch (_) {}
    });

    setTimeout(finish, timeoutMs);
  });
}

// /24 networks of every non-internal IPv4 interface (skips link-local)
function getLocalSubnets() {
  const subnets = new Set();
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const a of addrs || []) {
      if (a.family !== 'IPv4' || a.internal || a.address.startsWith('169.254.')) continue;
      subnets.add(a.address.split('.').slice(0, 3).join('.'));
    }
  }
  return Array.from(subnets).slice(0, 4);
}

function looksLikeWled(info) {
  if (!info || typeof info !== 'object') return false;
  if (String(info.brand || '').toUpperCase() === 'WLED') return true;
  return Boolean(info.leds && typeof info.ver === 'string');
}

async function probeWled(host, { port = 80, timeoutMs = 1200 } = {}) {
  const hostPort = port === 80 ? host : `${host}:${port}`;
  try {
    const res = await fetch(`http://${hostPort}/json/info`, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return null;
    const info = await res.json();
    if (!looksLikeWled(info)) return null;
    return {
      host: hostPort,
      name: String(info.name || hostPort).slice(0, 40),
      ver: info.ver || null,
      ledCount: info.leds && typeof info.leds.count === 'number' ? info.leds.count : null,
      mac: info.mac || null
    };
  } catch (_) {
    return null;
  }
}

async function runPool(items, limit, worker) {
  const results = [];
  let i = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const item = items[i++];
      results.push(await worker(item));
    }
  });
  await Promise.all(runners);
  return results;
}

async function sweepSubnets(subnets, { port = 80, timeoutMs = 900, concurrency = 64 } = {}) {
  const hosts = [];
  for (const prefix of subnets) {
    for (let n = 1; n <= 254; n++) hosts.push(`${prefix}.${n}`);
  }
  const results = await runPool(hosts, concurrency, h => probeWled(h, { port, timeoutMs }));
  return results.filter(Boolean);
}

let inflightScan = null;

// Runs mDNS + subnet sweep in parallel; concurrent callers share the in-flight scan
function discoverWledDevices(options = {}) {
  if (inflightScan) return inflightScan;
  inflightScan = (async () => {
    const started = Date.now();
    const subnets = options.subnets || getLocalSubnets();
    const port = options.port || 80;
    const [mdnsIps, swept] = await Promise.all([
      options.skipMdns ? Promise.resolve([]) : mdnsDiscover({ timeoutMs: options.mdnsTimeoutMs || 2500 }),
      sweepSubnets(subnets, { port })
    ]);

    const byHost = new Map();
    for (const d of swept) byHost.set(d.host, { ...d, sources: ['sweep'] });

    // Confirm mDNS hits (covers devices outside the swept /24s)
    const mdnsOnly = mdnsIps.filter(ip => !byHost.has(port === 80 ? ip : `${ip}:${port}`));
    const confirmed = await Promise.all(mdnsOnly.map(ip => probeWled(ip, { port })));
    confirmed.filter(Boolean).forEach(d => byHost.set(d.host, { ...d, sources: ['mdns'] }));
    for (const ip of mdnsIps) {
      const key = port === 80 ? ip : `${ip}:${port}`;
      const entry = byHost.get(key);
      if (entry && !entry.sources.includes('mdns')) entry.sources.push('mdns');
    }

    const devices = Array.from(byHost.values()).sort((a, b) => a.name.localeCompare(b.name));
    return { devices, subnets, durationMs: Date.now() - started };
  })().finally(() => { inflightScan = null; });
  return inflightScan;
}

module.exports = {
  discoverWledDevices,
  mdnsDiscover,
  sweepSubnets,
  probeWled,
  getLocalSubnets,
  buildPtrQuery,
  parseDnsRecords
};
