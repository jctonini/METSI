---
id: METSI-9
title: Cargar fotos desde Google Drive con el selector de Google (Picker)
status: In Progress
assignee: []
created_date: '2026-11-08T19:15:00Z'
updated_date: '2026-11-08T19:19:00Z'
labels: []
dependencies: []
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Las fotos se sacan con el celular y se suben a una carpeta de Drive; hoy la app (permiso drive.file) no puede verlas. Con el selector de Google Picker, el docente abre la carpeta, marca las fotos y la app recibe permiso solo sobre ellas, sin pedir acceso a todo Drive. Nota: elegir una carpeta en Picker no da acceso a su contenido; hay que entrar a la carpeta y seleccionar las fotos (Ctrl+A).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Botón Elegir fotos desde Drive en la pestaña Corregir abre el selector de Google con multiselección de imágenes
- [ ] #2 Las fotos elegidas se descargan de a una con reintentos, con progreso visible, y pasan por el mismo procesamiento que las fotos locales (repetidos, lectura, etc.)
- [ ] #3 El permiso de Google sigue siendo drive.file|Si faltan la API key o el App ID en js/config.js, el botón explica qué configurar en vez de fallar|README documenta la configuración de Google Cloud (Picker API, API key, App ID)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. js/picker.js: carga api.js de Google, abre Picker (vista de imágenes con carpetas, multiselección, OAuth token + API key + App ID), devuelve [{id,name,mimeType}] filtrando imágenes. Lógica de filtrado/armado testeable.
2. js/config.js: METSI_GOOGLE_API_KEY y METSI_GOOGLE_APP_ID (vacíos hasta que el docente los cree).
3. app-scan: separar processFiles(files) del listener; botón "Elegir fotos desde Drive" que pide token, abre Picker, descarga cada foto con drive.downloadBlob (con reintentos) como File y llama a processFile con progreso.
4. README: configuración de Picker API, API key, App ID; aclarar que hay que entrar a la carpeta y seleccionar las fotos.
5. Pruebas del filtrado y del flujo de descarga con mock de Drive.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implementado: js/picker.js, botón en Corregir, processFiles con carga diferida (baja cada foto al procesarla), claves en js/config.js, README. NO verificado con Google real (faltan API key y App ID): ningún criterio se marca hasta probarlo. Verificado en Chromium local: botón visible y aviso de configuración faltante. Nota: la descripción de AC #3 quedó con 3 criterios fusionados por un error de carga.
<!-- SECTION:NOTES:END -->
