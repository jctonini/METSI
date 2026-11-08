---
id: METSI-7
title: Acelerar el redibujado de la pestaña Corregir con muchas hojas
status: Done
assignee: []
created_date: '2026-11-08T19:15:00Z'
updated_date: '2026-11-08T19:17:00Z'
labels: []
dependencies: []
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Con ~80 hojas, cada toque en la pestaña Corregir redibuja todas las tarjetas y recalcula los repetidos (Identity.softFor llama a analyze por cada hoja, O(n^3)); en Node tarda ~560 ms por redibujo y en un celular sería 2-3 s por toque. Se necesita para el primer uso real del corrector (~80 alumnos).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Un redibujo con 80 hojas calcula los repetidos una sola vez (no una vez por hoja)
- [x] #2 Medido en Node, el cálculo de repetidos para 80 hojas baja de ~560 ms a menos de 50 ms
- [x] #3 Los resultados de conflictsFor/softFor/analyze no cambian (pruebas existentes pasan)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Identity.analyze: normalizar nombre y registro una sola vez por hoja (no en cada par).
2. conflictsFor/softFor aceptan un análisis ya calculado (opcional) para no recalcularlo.
3. renderCards pasa el análisis único a softFor.
4. Prueba de equivalencia y de tiempo con 80 hojas.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verificado en Node (no en navegador): softFor x80 pasó de ~561 ms a ~17 ms; suite 102 ok. Único fallo: tests/access.js (falta el módulo de Supabase, ya fallaba antes).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Identity.analyze normaliza nombre/registro una vez por hoja y conflictsFor/softFor aceptan un análisis ya calculado; renderCards lo reutiliza. Resultados idénticos (prueba de equivalencia), 80 hojas: ~561 ms -> ~17 ms por redibujo. Falta medir en un celular real.
<!-- SECTION:FINAL_SUMMARY:END -->
