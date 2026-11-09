# Guía práctica para Windows: METSI y Backlog.md

> **Origen:** la generó Claude Code el 2026-11-01, en la sesión «Backlog.md repository overview», a pedido del autor («Armame un documento de texto con todas las instrucciones como actualizar los repos, como ver los backlogs, y demas cosas que sean utiles»; registro de IA, N.º 46). Originalmente se entregó como archivo suelto y se guardó acá. **Esta copia está recortada a METSI**: se quitaron las partes de otro proyecto (EjeZ3D) y la tabla de estado de las tareas, que quedó vieja; para ver el estado actual usá `backlog task list --plain`.

Esta guía junta lo necesario para ver el tablero de tareas, mantener el repositorio actualizado y trabajar con Claude. Los comandos van en **PowerShell** y se copian tal cual.

---

## 1. Preparación (una sola vez)

### 1.1 Instalar Node.js
Descargá la versión «LTS» desde https://nodejs.org o ejecutá:

```powershell
winget install OpenJS.NodeJS.LTS
```

### 1.2 Instalar Git
```powershell
winget install Git.Git
```

**Cerrá PowerShell y abrilo de nuevo** después de instalar. Comprobá que todo quedó bien (cada comando tiene que mostrar un número de versión):

```powershell
node -v
```
```powershell
npm -v
```
```powershell
git --version
```

### 1.3 Instalar Backlog.md
```powershell
npm i -g backlog.md
```

Comprobación:
```powershell
backlog --version
```

### 1.4 Abrir PowerShell de forma normal
Abrilo desde el menú Inicio con un clic normal, **sin «Ejecutar como administrador»**. Si lo abrís como administrador queda ubicado en `C:\WINDOWS\system32` y ahí no conviene guardar nada.

Si PowerShell dice que la ejecución de scripts está deshabilitada, ejecutá una sola vez:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

---

## 2. Dónde guardar el proyecto

Se recomienda una carpeta propia, por ejemplo `Documents\proyectos`:

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\Documents\proyectos"
```

```powershell
cd "$env:USERPROFILE\Documents\proyectos"
```

### Clonar el repositorio (solo si todavía no lo tenés)
```powershell
git clone https://github.com/jctonini/METSI.git
```

La primera vez que hagas `git push`, Git puede abrir una ventana para iniciar sesión en GitHub. Iniciá sesión con tu cuenta.

### Si quedó dentro de `C:\WINDOWS\system32`
Primero salí de esa carpeta (Windows no deja mover una carpeta en uso):

```powershell
cd "$env:USERPROFILE"
```
```powershell
Move-Item C:\WINDOWS\system32\METSI "$env:USERPROFILE\Documents\proyectos\"
```

Si dice «en uso», cerrá otras ventanas de PowerShell, del Explorador o de editores que tengan abierta esa carpeta, y repetí.

---

## 3. Mantener el repositorio actualizado

Hacelo **cada vez que Claude haya trabajado en el repositorio** o antes de empezar a trabajar. Trae los cambios de GitHub a tu computadora.

```powershell
cd "$env:USERPROFILE\Documents\proyectos\METSI"
```
```powershell
git pull
```

Si dice `Already up to date`, ya estaba todo al día.

Para ver en qué estado está tu carpeta:
```powershell
git status
```

**Si `git pull` se queja de cambios locales** (por ejemplo, porque moviste tarjetas en el tablero y no las guardaste), mirá la sección 6 para guardarlos, o pedile ayuda a Claude con el mensaje de error.

---

## 4. Ver los backlogs y el tablero Kanban

Entrá a la carpeta del repositorio y elegí una opción.

### 4.1 Tablero en el navegador (con arrastrar y soltar)
```powershell
backlog browser
```
Abre una página en tu propia computadora, normalmente `http://127.0.0.1:6420`. No es una página en internet: solo vos la ves. Para cerrarla, volvé a PowerShell y presioná **Ctrl + C**.

### 4.2 Tablero en la terminal
```powershell
backlog board
```

### 4.3 Lista de tareas
```powershell
backlog task list --plain
```

Solo las pendientes:
```powershell
backlog task list --status "To Do" --plain
```

### 4.4 Ver una tarea completa (plan, notas, resumen)
```powershell
backlog task view METSI-3 --plain
```

### 4.5 Buscar
```powershell
backlog search "Drive" --plain
```

---

## 5. Trabajar con tareas

Los estados son **To Do**, **In Progress** y **Done**.

Cambiar el estado de una tarea:
```powershell
backlog task edit METSI-1 -s "In Progress"
```

Crear una tarea nueva (con descripción y criterios de aceptación):
```powershell
backlog task create "Título de la tarea" -d "Por qué hace falta" --ac "Primer criterio" --ac "Segundo criterio"
```

Ayuda de cualquier comando:
```powershell
backlog task edit --help
```

**Importante:** no edites a mano los archivos de la carpeta `backlog\`. Usá siempre los comandos `backlog`, o pedile a Claude que los use.

---

## 6. Guardar en GitHub los cambios que hagas en tu computadora

Si movés tarjetas en el tablero o editás tareas, el cambio queda solo en tu carpeta. Para que Claude (y vos desde otros lugares) lo vean:

```powershell
git status
```
```powershell
git add -A
```
```powershell
git commit -m "Actualizo tareas del backlog"
```
```powershell
git push
```

Si `git push` dice que hay cambios nuevos en GitHub, hacé primero `git pull` y repetí el `git push`.

---

## 7. Trabajar con Claude

- **Backlog.md ya está instalado en cada sesión nueva** (está en el *setup script* del entorno). No hace falta pedirle que lo instale.
- Flujo recomendado: **una tarea por sesión y un PR por tarea**. Decile, por ejemplo: «avanzá en METSI-1». Claude lee la tarea, escribe un plan, implementa, verifica y marca la tarea como Done.
- Para tareas grandes, pedile que **primero escriba el plan en la tarea** y esperá a aprobarlo antes de que escriba código.
- Para tareas nuevas, pedile que las cargue con descripción y criterios de aceptación, o usá el comando de la sección 5.
- Si trabajás en la compu y Claude en la nube sobre lo mismo, hacé siempre `git pull` antes de empezar y `git push` al terminar, para no pisarse.

---

## 8. Cómo cerrar METSI-1 (calibrar con casos reales)

1. En la app, pestaña **Resultados → Casos a revisar**, tocá **Descargar casos (JSON)**. El archivo no trae nombres ni registros.
2. Antes de descargarlo, **corregí a mano las respuestas que la app leyó mal**: esa corrección es la respuesta correcta que se usa para calibrar. Las preguntas con 🚩 que no corregiste se omiten.
3. Copiá el archivo a `METSI\tests\fixtures\real\`. Se pueden sumar varios.
4. Ejecutá:
```powershell
node tools/calibrar.js
```
Muestra cuántas preguntas lee mal hoy la app y cuántas leería mal con cada umbral de sensibilidad.
5. Pasale el resultado a Claude para decidir si se cambia el umbral por defecto.

---

## 9. Comandos útiles de desarrollo

Dentro de la carpeta `METSI`:

Instalar las dependencias de las funciones de Vercel (una vez):
```powershell
npm install
```

Correr las pruebas:
```powershell
node tests/run.js
```

**Después de cambiar código o estilos**, actualizar el número de versión (una prueba falla si se olvida):
```powershell
node tools/version.js
```

Notas:
- Para que el inicio de sesión de Google funcione, la app tiene que estar publicada en una dirección **https**. Abriendo `index.html` desde el disco, el resto de la app anda, pero Drive no.
- Las fotos de hojas y el CSV de resultados contienen datos de alumnos: no los subas a lugares públicos.

---

## 10. Problemas frecuentes

| Qué ves | Qué hacer |
|---|---|
| `npm` o `node` «no se reconoce» | Falta instalar Node.js (sección 1.1) o hay que cerrar y reabrir PowerShell. |
| `git` «no se reconoce» | Instalar Git (sección 1.2) y reabrir PowerShell. |
| `backlog` «no se reconoce» | Reabrir PowerShell; si sigue, repetir `npm i -g backlog.md`. |
| El repositorio quedó en `system32` | Sección 2: moverlo y abrir PowerShell sin administrador. |
| `Move-Item` dice «en uso» | Salir de la carpeta con `cd "$env:USERPROFILE"` y cerrar ventanas que la usen. |
| Error de ejecución de scripts | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `fatal: not a git repository` | No estás dentro de la carpeta del repositorio; hacé `cd` a `METSI`. |
| `backlog browser` dice que el puerto está ocupado | Usar otro: `backlog browser --port 6421`. |
| El tablero aparece vacío | Verificar que estás dentro de la carpeta del repositorio y hacer `git pull`. |
| Git pide usuario y contraseña | Iniciar sesión con tu cuenta de GitHub en la ventana que se abre. |
| `git pull` o `git push` se queja de conflictos | No fuerces nada: copiá el mensaje completo y pasáselo a Claude. |

---

## 11. Resumen rápido

```powershell
cd "$env:USERPROFILE\Documents\proyectos\METSI"
git pull
backlog browser
```

1. `git pull` trae lo último.
2. `backlog browser` abre el tablero.
3. Ctrl + C cierra el tablero.
