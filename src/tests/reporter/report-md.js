/**
 * DO NOT TOUCH
 * 
 * For Prime Instructional Staff use only.
 */
module.exports = (ctx) => {
  let baseResults = ctx.results.filter(res => !res.isStretch && !res.isGeneral);
  let stretchResults = ctx.results.filter(res => res.isStretch);
  let generalResults = ctx.results.filter(res => res.isGeneral);

  return `
| Functional Requirements | Complete? |
| --- | :---: |
${baseResults.map(res =>
`| ${name(res.fullName)} | ${res.isPassing ? 'yes' : 'no'} |`
).join('\n')}
${stretchResults.map(res =>
`| ${name(res.fullName)} | ${res.isPassing ? 'yes' : 'no'} |`
).join('\n')}

---

### Notes:

---

| General Items | Complete? |
| --- | :---: |
${generalResults.map(res =>
`| ${name(res.fullName)} | ${res.isPassing ? 'yes' : 'no'} |`
).join('\n')}
---

### Notes:
  `;
}

function name(fullName) {
  return fullName
    .replace('[STRETCH]', '**STRETCH:**')
    .replace('[GENERAL]', '')
    .trim();
}