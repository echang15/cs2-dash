"""Render original top-down radar SVGs from CS2 nav meshes (awpy-data releases) + write public/radar-calibration.js.

Usage: python3 tools/gen_radars.py <navs dir> <map_data.json> public/radar public/radar-calibration.js
Inputs come from https://github.com/pnxenopoulos/awpy-data/releases (navs.zip, map_data.json)."""
import struct, json, os, sys, math

NAV_DIR, MAP_DATA, OUT_DIR, OUT_JS = sys.argv[1:5]
calib = json.load(open(MAP_DATA))
ALIASES = {'de_ancient_night': 'de_ancient', 'ar_shoots_night': 'ar_shoots'}
# Overview level splits that don't match the current nav mesh (Train's -50 cut would mark ~90% of the map as lower)
IGNORE_LEVEL_SPLIT = {'de_train'}

def parse_polys(path):
    b = open(path, 'rb').read()
    magic, ver = struct.unpack_from('<II', b, 0)
    assert magic == 0xFEEDFACE, 'bad magic'
    # Corner array position varies with header extras; find it by plausibility
    for off in range(12, 600):
        n = struct.unpack_from('<I', b, off)[0]
        if not (50 < n < 400000) or off + 4 + n * 12 + 4 > len(b): continue
        ok = True
        for i in range(min(n, 64)):
            v = struct.unpack_from('<fff', b, off + 4 + i * 12)
            if not all(math.isfinite(c) and abs(c) < 60000 for c in v): ok = False; break
        if not ok: continue
        corners = [struct.unpack_from('<fff', b, off + 4 + i * 12) for i in range(n)]
        p = off + 4 + n * 12
        pc = struct.unpack_from('<I', b, p)[0]; p += 4
        polys = []
        try:
            for _ in range(pc):
                k = b[p]; p += 1
                if not (3 <= k <= 64): raise ValueError('k')
                idx = struct.unpack_from('<%dI' % k, b, p); p += 4 * k
                if ver >= 35: p += 4
                if max(idx) >= n: raise ValueError('idx')
                polys.append([corners[i] for i in idx])
        except (ValueError, struct.error, IndexError):
            continue
        return ver, polys
    raise RuntimeError('corner array not found')

def fit_calibration(polys):
    xs = [c[0] for p in polys for c in p]; ys = [c[1] for p in polys for c in p]
    w, h = max(xs) - min(xs), max(ys) - min(ys)
    scale = round(max(w, h) * 1.08 / 1024, 4)
    cx, cy = (max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2
    return {'pos_x': round(cx - 512 * scale), 'pos_y': round(cy + 512 * scale), 'scale': scale}

def lower_max(meta):
    vs = meta.get('verticalsections') or {}
    lo = vs.get('lower')
    return float(lo['AltitudeMax']) if lo else None

# Palette: dark slate floors, lighter = higher; outline in muted steel blue
UPPER = ['#16202d', '#1b2736', '#202e3f', '#263649', '#2c3e53', '#33475e', '#3a5069']
LOWER = ['#10161f', '#131a25', '#161f2b', '#1a2431']
OUT_UP, OUT_LO = '#6f8fb0', '#3d5068'

def bucketize(zs, n):
    s = sorted(zs)
    lo, hi = s[int(len(s) * 0.04)], s[int(len(s) * 0.96) - 1]
    span = max(hi - lo, 1)
    return lambda z: max(0, min(n - 1, int((z - lo) / span * n)))

def path_d(polys, cal):
    out = []
    for poly in polys:
        pts = [((x - cal['pos_x']) / cal['scale'], (cal['pos_y'] - y) / cal['scale']) for x, y, _ in poly]
        out.append('M' + 'L'.join('%.1f %.1f' % pt for pt in pts) + 'Z')
    return ''.join(out)

def layer_svg(polys, cal, palette, outline, tag, outline_w):
    if not polys: return '', ''
    zavg = [sum(c[2] for c in p) / len(p) for p in polys]
    bk = bucketize(zavg, len(palette))
    groups = {}
    for poly, z in zip(polys, zavg): groups.setdefault(bk(z), []).append(poly)
    defs = ''.join('<path id="%s%d" d="%s"/>' % (tag, i, path_d(g, cal)) for i, g in sorted(groups.items()))
    uses = ''.join('<use href="#%s%d"/>' % (tag, i) for i in sorted(groups))
    body = ('<g fill="%s" stroke="%s" stroke-width="%s" stroke-linejoin="round">%s</g>' % (outline, outline, outline_w, uses) +
            ''.join('<use href="#%s%d" fill="%s" stroke="%s" stroke-width="1.6" stroke-linejoin="round"/>' % (tag, i, palette[i], palette[i]) for i in sorted(groups)))
    return defs, body

os.makedirs(OUT_DIR, exist_ok=True)
registry = {}
for fn in sorted(os.listdir(NAV_DIR)):
    if not fn.endswith('.nav'): continue
    name = fn[:-4]
    if name in ALIASES: continue
    ver, polys = parse_polys(os.path.join(NAV_DIR, fn))
    meta = calib.get(name)
    if meta:
        cal = {'pos_x': meta['pos_x'], 'pos_y': meta['pos_y'], 'scale': meta['scale']}; source = 'valve-overview'
    else:
        cal = fit_calibration(polys); source = 'fitted-to-navmesh'
    lmax = lower_max(meta) if meta and name not in IGNORE_LEVEL_SPLIT else None
    upper = [p for p in polys if lmax is None or sum(c[2] for c in p) / len(p) >= lmax]
    lower = [p for p in polys if lmax is not None and sum(c[2] for c in p) / len(p) < lmax]
    # Sanity: how much of the map lands inside the 1024 frame
    pts = [((x - cal['pos_x']) / cal['scale'], (cal['pos_y'] - y) / cal['scale']) for p in polys for x, y, _ in p]
    inside = sum(1 for u, v in pts if 0 <= u <= 1024 and 0 <= v <= 1024) / len(pts)
    d_lo, b_lo = layer_svg(lower, cal, LOWER, OUT_LO, 'l', 5)
    d_up, b_up = layer_svg(upper, cal, UPPER, OUT_UP, 'u', 5)
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">'
           '<!-- Generated from the CS2 nav mesh; original artwork for cs2-dash -->'
           '<defs>%s%s</defs>%s%s</svg>') % (d_lo, d_up, b_lo, b_up)
    open(os.path.join(OUT_DIR, name + '.svg'), 'w').write(svg)
    registry[name] = {**cal, 'lowerMaxZ': lmax, 'calibration': source}
    print('%-18s v%d polys=%5d lower=%4d inside=%5.1f%% %6.0fKB %s' % (name, ver, len(polys), len(lower), inside * 100, len(svg) / 1024, source))

aliases_js = json.dumps(ALIASES)
open(OUT_JS, 'w').write(
    '/* Generated by gen_radars.py from awpy-data nav meshes + overview calibration. Do not edit by hand. */\n'
    'window.CS2_RADAR_CALIBRATION = %s;\nwindow.CS2_RADAR_ALIASES = %s;\n' % (json.dumps(registry, indent=1), aliases_js))
