# Skill «ISM-Parcial builder»: exportar el examen para la app

La skill que arma los exámenes tiene que entregar, junto con el .docx y la guía de feedback, el archivo `.json` que importa la app (formato en [`../formato-examen.md`](../formato-examen.md)).

Esta carpeta trae lo que hay que sumarle a la skill:

1. `export_metsi_exam.py`: copiarlo a la carpeta `scripts/` de la skill. Convierte `<salida>.final_questions.json` en el archivo de la app.
2. `SKILL-seccion.md`: pegar su contenido en el `SKILL.md` de la skill, antes de «Cross-checking an exam against its guide».

La copia de la skill que está sincronizada en el entorno de trabajo ya lo tiene, pero esa copia se baja desde claude.ai: para que quede de forma permanente hay que actualizar la skill original.
