## Exporting the exam for the METSI app (answer key, points, penalty)

The METSI corrector app (solapa Examen → «Importar examen») reads a `.json` with the number of questions, options,
correct answers, points per question and the penalty, so none of that is typed by hand. Format: `docs/formato-examen.md`
of the METSI repository (`metsi-examen`, version 1). Once the exam is final, build that file **from
`<output>.final_questions.json`** (options in their final, shuffled order — never from the original questions.json, or the
letters of the key would not match the printed exam):

```bash
python3 scripts/export_metsi_exam.py output.final_questions.json examen-metsi.json \
    --titulo "2do Parcial" --puntos 5 --penalizacion 0.33
```

- **Ask the user** for the points per question and the penalty (descuento por cada opción incorrecta marcada de más, 0 to 1);
  don't assume them. A question may carry its own `"points"` field in questions.json to override `--puntos`.
- A question with no correct option is annulled by the app (everyone gets full points): the script warns about it.
- Deliver `examen-metsi.json` together with the exam .docx and the feedback guide, and tell the user to import it in the app.
