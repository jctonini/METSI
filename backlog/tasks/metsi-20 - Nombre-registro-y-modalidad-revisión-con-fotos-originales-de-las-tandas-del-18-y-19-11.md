---
id: METSI-20
title: >-
  Nombre, registro y modalidad: revisión con fotos originales de las tandas del
  18 y 19/11
status: In Progress
assignee:
  - '@claude'
created_date: '2026-11-19T13:17:00Z'
updated_date: '2026-11-19T13:17:00Z'
labels:
  - lectura
dependencies: []
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Tras corregir 17 hojas más: se inventaban respuestas E en 11-20, el nombre salía recortado, el registro fallaba y la modalidad casi no se reconocía. Se revisó con las fotos originales y los datos.json (lo que sugirió la app y lo que confirmó el docente).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 El umbral deja de depender de la sensibilidad guardada
- [x] #2 El nombre se recorta entero y derecho
- [x] #3 La modalidad se reconoce salvo marcas con tilde o cruz
- [x] #4 El aviso de hoja repetida no salta entre alumnos distintos
- [ ] #5 El registro mejora con hojas no vistas
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Medido sobre 28 hojas con foto (preguntas con verdad = corrección del docente; las no corregidas se asumen bien leídas, aproximación): umbral fijo 0,12 (el que tenía guardado el docente) 155 preguntas mal; adaptativo 9-10 con cualquier piso de 0,12 a 0,20 (piso elegido mirando esas mismas hojas, sin hojas reservadas). Nombre: recorte relativo a la línea impresa, enderezado; verificado a ojo en 10 hojas y en la app (Chromium). Modalidad: 25/28 con el código actual; las 3 que fallan son marcas con ⊗ o aro garabateado, avisadas como problema. Aviso de hoja repetida: pares de hojas distintas con parecido >= 0,55 pasan de 77/152 a 1/152; la misma hoja da 0,95 (antes 0,70); umbral nuevo 0,75 para firmas v2. Registro: la ubicación de casilleros es correcta; el límite es el lector de dígitos. Con la versión desplegada, 7 de 15 hojas de hoy coincidían con lo confirmado y 14 de 15 errores estaban marcados como dudosos. Modelo reentrenado con 108 dígitos de 18 hojas (reps 25): validación cruzada por hoja 90,7% de dígitos y 11/17 registros completos (n chico). AC 5 sin marcar: no se pudo medir mejora contra el modelo anterior con hojas no vistas distintas de estas. Sin probar en celular ni Vercel.
<!-- SECTION:NOTES:END -->
