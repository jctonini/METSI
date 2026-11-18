#!/usr/bin/env python3
"""Convierte el examen armado por la skill en el archivo de examen que importa la app METSI (solapa Examen).

Formato: docs/formato-examen.md del repositorio METSI (metsi-examen, version 1).

Uso:
    python3 scripts/export_metsi_exam.py output.final_questions.json examen-metsi.json \
        --titulo "2do Parcial" --puntos 5 --penalizacion 0.33

Entrada: SIEMPRE `<salida>.final_questions.json` (las opciones en el orden final del examen, ya mezcladas), nunca el
questions.json original: si no, las letras de la clave no coincidirían con el examen impreso.
  - `puntos` por pregunta: si la pregunta trae el campo "points" se usa ese; si no, --puntos (por defecto 1).
  - Una pregunta sin opciones correctas queda anulada (la app da el puntaje completo a todos); se avisa.
"""
import argparse
import json
import sys

LETRAS = 'ABCDEF'


def exportar(preguntas, titulo, puntos, penalizacion):
    if not preguntas:
        raise SystemExit('El archivo no trae preguntas.')
    n_opc = {len(q['options']) for q in preguntas}
    if len(n_opc) != 1:
        raise SystemExit(f'Todas las preguntas tienen que tener la misma cantidad de opciones (hay: {sorted(n_opc)}).')
    opciones = n_opc.pop()
    if not 2 <= opciones <= len(LETRAS):
        raise SystemExit(f'La app admite de 2 a {len(LETRAS)} opciones por pregunta (hay {opciones}).')
    clave, anuladas = [], []
    for i, q in enumerate(preguntas, 1):
        correctas = [LETRAS[j] for j, o in enumerate(q['options']) if o.get('correct')]
        if not correctas:
            anuladas.append(i)
        pts = q.get('points', puntos)
        clave.append({'correctas': correctas, 'puntos': pts})
    if anuladas:
        print(f'AVISO: las preguntas {anuladas} no tienen opción correcta: la app las anula.', file=sys.stderr)
    return {
        'formato': 'metsi-examen', 'version': 1, 'titulo': titulo,
        'preguntas': len(preguntas), 'opciones': opciones, 'penalizacion': penalizacion, 'clave': clave,
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('final_questions', help='<salida>.final_questions.json que deja build_exam.py')
    ap.add_argument('salida', help='archivo .json para importar en la app')
    ap.add_argument('--titulo', default='')
    ap.add_argument('--puntos', type=float, default=1.0, help='puntos de cada pregunta (por defecto 1)')
    ap.add_argument('--penalizacion', type=float, default=0.33, help='descuento por opción incorrecta de más, de 0 a 1 (por defecto 0,33)')
    a = ap.parse_args()
    if not 0 <= a.penalizacion <= 1:
        raise SystemExit('La penalización tiene que estar entre 0 y 1.')
    with open(a.final_questions, encoding='utf-8') as f:
        data = json.load(f)
    out = exportar(data['questions'], a.titulo, a.puntos, a.penalizacion)
    with open(a.salida, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"Escrito {a.salida}: {out['preguntas']} preguntas, {out['opciones']} opciones, descuento {out['penalizacion']}.")


if __name__ == '__main__':
    main()
