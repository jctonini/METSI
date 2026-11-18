#!/usr/bin/env python3
"""Entrena el lector de dígitos manuscritos que usa la app (js/digit-model.js).

Es una red chica (784 -> 128 -> 64 -> 10) entrenada con MNIST más variaciones que se ven en una foto de
una hoja real: trazos finos o gruesos, escritura rotada o corrida, restos del borde del casillero, el
7 con barrita y el 1 con base (que MNIST casi no trae). Los pesos se guardan cuantizados a 8 bits para
que el archivo pese poco y la app no necesite ninguna librería.

Uso (necesita numpy y scipy; MNIST se descarga a mano o con `curl`):

    python3 tools/train-digits.py --mnist <carpeta con los 4 archivos idx> [--epochs 18]

La carpeta tiene que traer train-images-idx3-ubyte, train-labels-idx1-ubyte, t10k-images-idx3-ubyte y
t10k-labels-idx1-ubyte (sin comprimir). Escribe js/digit-model.js y tests/fixtures/digits-sample.json.
El entrenamiento usa semillas fijas: con los mismos datos da el mismo modelo.

Opcional: `--real <archivo.json>` suma dígitos reales de hojas fotografiadas (lista de objetos con `sheet`, `label` y
`vec`: 784 valores 0-255 en base64, como los deja el lector de la app). Con `--cv N` no escribe nada: entrena N veces
dejando hojas afuera y mide la precisión sobre las hojas que quedaron afuera (así se ve si ayuda de verdad o si solo
memoriza).
"""
import argparse
import base64
import json
import os
import struct
import sys

import numpy as np
from scipy import ndimage

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')


def read_idx(path):
    with open(path, 'rb') as f:
        data = f.read()
    magic, = struct.unpack('>I', data[:4])
    dims = magic & 0xFF
    shape = struct.unpack('>' + 'I' * dims, data[4:4 + 4 * dims])
    return np.frombuffer(data, dtype=np.uint8, offset=4 + 4 * dims).reshape(shape)


# ---------- variaciones ----------
def add_local_habits(img, label, rng):
    """7 con barrita, 1 con base: formas comunes acá que MNIST casi no tiene. img en [0,1], 28x28."""
    img = img.copy()
    if label == 7 and rng.random() < 0.35:
        r = int(rng.integers(12, 16)); c0 = int(rng.integers(8, 11)); c1 = int(rng.integers(17, 20))
        img[r:r + 2, c0:c1] = 1.0
    if label == 1 and rng.random() < 0.25:
        r = int(rng.integers(22, 25)); c0 = int(rng.integers(8, 11)); c1 = int(rng.integers(17, 20))
        img[r:r + 2, c0:c1] = 1.0
    return img


def transform(img, rng, strong=True):
    a = np.deg2rad(rng.uniform(-14, 14) if strong else rng.uniform(-6, 6))
    sx = rng.uniform(0.82, 1.12) if strong else rng.uniform(0.95, 1.05)
    sy = rng.uniform(0.82, 1.12) if strong else rng.uniform(0.95, 1.05)
    sh = rng.uniform(-0.2, 0.2) if strong else 0.0
    m = np.array([[np.cos(a), -np.sin(a) + sh], [np.sin(a), np.cos(a)]]) @ np.diag([1 / sy, 1 / sx])
    c = np.array([13.5, 13.5])
    off = c - m @ c + rng.uniform(-2.2, 2.2, 2) * (1 if strong else 0.4)
    out = ndimage.affine_transform(img, m, offset=off, order=1, mode='constant')
    return np.clip(out, 0, 1)


def thickness(img, rng):
    """Trazos más gruesos (birome gruesa, foto borrosa) o más finos (birome fina)."""
    r = rng.random()
    if r < 0.30:
        img = ndimage.maximum_filter(img, size=2)
        if rng.random() < 0.4:
            img = ndimage.gaussian_filter(img, 0.5)
            img = np.clip(img * 1.6, 0, 1)
    elif r < 0.55:
        img = np.clip(img, 0, 1) ** rng.uniform(1.6, 2.6)
    elif r < 0.70:
        img = ndimage.gaussian_filter(img, rng.uniform(0.5, 0.9))
        img = np.clip(img * rng.uniform(1.2, 1.8), 0, 1)
    return img


def artifacts(img, rng):
    """Ruido de papel y restos del borde impreso del casillero."""
    if rng.random() < 0.5:
        img = img + rng.normal(0, rng.uniform(0.01, 0.06), img.shape)
    if rng.random() < 0.10:  # resto del borde pegado a un costado
        side = int(rng.integers(0, 4)); k = int(rng.integers(0, 2)); v = rng.uniform(0.5, 1.0)
        if side == 0: img[:, k] = np.maximum(img[:, k], v)
        elif side == 1: img[:, 27 - k] = np.maximum(img[:, 27 - k], v)
        elif side == 2: img[k, :] = np.maximum(img[k, :], v)
        else: img[27 - k, :] = np.maximum(img[27 - k, :], v)
    if rng.random() < 0.08:  # manchita suelta
        r, c = int(rng.integers(0, 26)), int(rng.integers(0, 26))
        img[r:r + 2, c:c + 2] = np.maximum(img[r:r + 2, c:c + 2], 0.7)
    return np.clip(img, 0, 1)


def augment_batch(x, y, rng, clean_frac=0.25):
    out = np.empty_like(x, dtype=np.float32)
    for i in range(len(x)):
        img = x[i].reshape(28, 28).astype(np.float32)
        if rng.random() < clean_frac:
            out[i] = img.reshape(-1)
            continue
        img = add_local_habits(img, int(y[i]), rng)
        img = transform(img, rng)
        img = thickness(img, rng)
        img = artifacts(img, rng)
        out[i] = img.reshape(-1)
    return out


# ---------- red ----------
def init_net(sizes, rng):
    ws, bs = [], []
    for a, b in zip(sizes[:-1], sizes[1:]):
        ws.append((rng.normal(0, np.sqrt(2 / a), (a, b))).astype(np.float32))
        bs.append(np.zeros(b, np.float32))
    return ws, bs


def forward(ws, bs, x, keep=False):
    acts = [x]
    for i, (w, b) in enumerate(zip(ws, bs)):
        z = acts[-1] @ w + b
        acts.append(np.maximum(z, 0) if i < len(ws) - 1 else z)
    return acts if keep else acts[-1]


def softmax(z):
    z = z - z.max(1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(1, keepdims=True)


def train(x, y, xt, yt, xa, ya, epochs, rng, log, real=None):
    ws, bs = init_net([784, 128, 64, 10], rng)
    mw = [np.zeros_like(w) for w in ws]; vw = [np.zeros_like(w) for w in ws]
    mb = [np.zeros_like(b) for b in bs]; vb = [np.zeros_like(b) for b in bs]
    t = 0; bsz = 256
    for ep in range(epochs):
        lr = 1.5e-3 * (0.5 * (1 + np.cos(np.pi * ep / epochs))) + 5e-5
        xe = augment_batch(x, y, rng)
        ye = y
        if real is not None and len(real[0]):
            # los dígitos reales entran muchas veces por época, cada vez con otra deformación leve
            xr = np.repeat(real[0], real[2], axis=0); yr = np.repeat(real[1], real[2])
            xe = np.concatenate([xe, augment_batch(xr, yr, rng, clean_frac=0.2)]); ye = np.concatenate([y, yr])
        idx = rng.permutation(len(xe))
        for s in range(0, len(idx), bsz):
            bi = idx[s:s + bsz]
            xb, yb = xe[bi], ye[bi]
            acts = forward(ws, bs, xb, keep=True)
            g = softmax(acts[-1]); g[np.arange(len(bi)), yb] -= 1; g /= len(bi)
            t += 1
            for l in range(len(ws) - 1, -1, -1):
                gw = acts[l].T @ g + 1e-5 * ws[l]; gb = g.sum(0)
                if l > 0:
                    g = (g @ ws[l].T) * (acts[l] > 0)
                for p, gr, m, v in ((ws, gw, mw, vw), (bs, gb, mb, vb)):
                    m[l] = 0.9 * m[l] + 0.1 * gr
                    v[l] = 0.999 * v[l] + 0.001 * gr * gr
                    p[l] -= lr * (m[l] / (1 - 0.9 ** t)) / (np.sqrt(v[l] / (1 - 0.999 ** t)) + 1e-8)
        log(f'época {ep + 1}/{epochs}: limpio {acc(ws, bs, xt, yt):.4f}  con variaciones {acc(ws, bs, xa, ya):.4f}')
    return ws, bs


def acc(ws, bs, x, y):
    return float((forward(ws, bs, x).argmax(1) == y).mean())


# ---------- exportar ----------
def quantize(ws, bs):
    layers = []
    for w, b in zip(ws, bs):
        wt = w.T  # [salida][entrada]
        scale = np.maximum(np.abs(wt).max(1), 1e-8) / 127.0
        q = np.clip(np.round(wt / scale[:, None]), -127, 127).astype(np.int8)
        layers.append({
            'in': int(wt.shape[1]), 'out': int(wt.shape[0]),
            'w': base64.b64encode(q.tobytes()).decode(),
            's': [float(f'{v:.6g}') for v in scale],
            'b': [float(f'{v:.5g}') for v in b],
        })
    return layers


def dequant(layers):
    ws, bs = [], []
    for L in layers:
        q = np.frombuffer(base64.b64decode(L['w']), dtype=np.int8).reshape(L['out'], L['in']).astype(np.float32)
        ws.append((q * np.array(L['s'], np.float32)[:, None]).T)
        bs.append(np.array(L['b'], np.float32))
    return ws, bs


def write_model_js(path, model):
    """Escribe js/digit-model.js con el mismo patrón que el resto de los módulos (navegador y Node)."""
    with open(path, 'w') as f:
        f.write('// Pesos del lector de dígitos manuscritos. Lo genera tools/train-digits.py: no editar a mano.\n')
        f.write("(function (root, factory) {\n  if (typeof module === 'object' && module.exports) module.exports = factory();\n  else root.MetsiDigitModel = factory();\n})(typeof self !== 'undefined' ? self : this, function () {\n  return ")
        f.write(json.dumps(model, separators=(',', ':')))
        f.write(';\n});\n')


def load_real(path):
    with open(path) as f:
        rows = json.load(f)
    xs, ys, gs = [], [], []
    for r in rows:
        if r.get('label') is None or r.get('vec') is None:
            continue
        xs.append(np.frombuffer(base64.b64decode(r['vec']), dtype=np.uint8).astype(np.float32) / 255)
        ys.append(int(r['label'])); gs.append(r['sheet'])
    return np.array(xs, np.float32), np.array(ys, np.int64), np.array(gs)


def cross_validate(x, y, xt, yt, xa, real, folds, epochs, reps, log):
    """Entrena `folds` veces dejando afuera hojas enteras y mide sobre lo que quedó afuera (con y sin dígitos reales)."""
    xr, yr, gr = real
    sheets = sorted(set(gr))
    # una misma persona puede haber escrito dos hojas: las que comparten registro se agrupan en main() con el mismo nombre
    res = {'con reales': [0, 0], 'solo MNIST': [0, 0]}
    for f in range(folds):
        out = {s for i, s in enumerate(sheets) if i % folds == f}
        te = np.isin(gr, list(out))
        for name, use in (('con reales', True), ('solo MNIST', False)):
            rng = np.random.default_rng(1000 + f)
            ws, bs = train(x, y, xt, yt, xa, yt, epochs, rng, lambda _s: None, real=(xr[~te], yr[~te], reps) if use else None)
            hit = int((forward(ws, bs, xr[te]).argmax(1) == yr[te]).sum())
            res[name][0] += hit; res[name][1] += int(te.sum())
            log(f'bloque {f + 1}/{folds} {name}: {hit}/{int(te.sum())}')
    for name, (h, n) in res.items():
        log(f'TOTAL {name}: {h}/{n} = {h / n:.3f}')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--mnist', required=True)
    ap.add_argument('--epochs', type=int, default=18)
    ap.add_argument('--real', help='JSON con dígitos reales (ver arriba)')
    ap.add_argument('--reps', type=int, default=120, help='veces que entra cada dígito real por época')
    ap.add_argument('--cv', type=int, default=0, help='validación cruzada por hoja con N bloques (no escribe archivos)')
    ap.add_argument('--out', default=os.path.join(ROOT, 'js', 'digit-model.js'))
    ap.add_argument('--fixture', default=os.path.join(ROOT, 'tests', 'fixtures', 'digits-sample.json'))
    a = ap.parse_args()
    log = lambda s: print(s, flush=True)

    d = a.mnist
    x = read_idx(os.path.join(d, 'train-images-idx3-ubyte')).reshape(-1, 784).astype(np.float32) / 255
    y = read_idx(os.path.join(d, 'train-labels-idx1-ubyte')).astype(np.int64)
    xt = read_idx(os.path.join(d, 't10k-images-idx3-ubyte')).reshape(-1, 784).astype(np.float32) / 255
    yt = read_idx(os.path.join(d, 't10k-labels-idx1-ubyte')).astype(np.int64)

    rng = np.random.default_rng(20261108)
    # Prueba "con variaciones": el test de MNIST pasado por las mismas deformaciones (semilla distinta).
    xa = augment_batch(xt, yt, np.random.default_rng(777), clean_frac=0.0)
    real = load_real(a.real) if a.real else None
    if a.cv:
        cross_validate(x, y, xt, yt, xa, real, a.cv, a.epochs, a.reps, log)
        return 0
    ws, bs = train(x, y, xt, yt, xa, yt, a.epochs, rng, log, real=(real[0], real[1], a.reps) if real else None)

    layers = quantize(ws, bs)
    qws, qbs = dequant(layers)
    log(f'cuantizado a 8 bits: limpio {acc(qws, qbs, xt, yt):.4f}  con variaciones {acc(qws, qbs, xa, yt):.4f}')

    model = {'v': 1, 'size': 28, 'layers': layers}
    write_model_js(a.out, model)
    log(f'escrito {a.out} ({os.path.getsize(a.out) / 1024:.0f} KB)')

    # Muestra de dígitos del test de MNIST (no usados para entrenar) para las pruebas del repositorio.
    pick = []
    for dgt in range(10):
        pick += list(np.where(yt == dgt)[0][:6])
    sample = {'size': 28, 'labels': [int(yt[i]) for i in pick],
              'images': [base64.b64encode((xt[i] * 255).astype(np.uint8).tobytes()).decode() for i in pick]}
    with open(a.fixture, 'w') as f:
        json.dump(sample, f, separators=(',', ':'))
    log(f'escrito {a.fixture} ({len(pick)} dígitos)')


if __name__ == '__main__':
    sys.exit(main())
