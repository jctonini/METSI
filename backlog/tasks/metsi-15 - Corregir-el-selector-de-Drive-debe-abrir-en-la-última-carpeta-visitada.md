---
id: METSI-15
title: 'Corregir: el selector de Drive debe abrir en la última carpeta visitada'
status: In Progress
assignee:
  - '@claude'
created_date: '2026-11-18T23:15:00Z'
updated_date: '2026-11-18T23:22:00Z'
labels:
  - drive
  - corregir
dependencies: []
ordinal: 15000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Al elegir fotos desde Drive en Corregir hojas, el selector siempre vuelve al inicio de Google Drive y no a la última carpeta visitada.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 El selector abre en la última carpeta usada (o en la carpeta del examen)
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implementado: pickImages recibe la carpeta inicial y recuerda la carpeta (parentId) de las fotos elegidas en la configuración local (pickFolder). Probado con prueba unitaria de folderOf. SIN PROBAR con el Google Picker real (necesita login y claves): dudas abiertas, por ejemplo si abre bien cuando la carpeta es de Mi unidad o compartida. Criterio sin marcar hasta probarlo.
<!-- SECTION:NOTES:END -->
