/**
 * DO NOT TOUCH
 * 
 * For Prime Instructional Staff use only.
 */

/**
 * Prepare an message to print as an Annotation with Github Actions.
 * Github Actions will render any message starting with
 * ::warning:: or ::error:: as an annotation.
 */
module.exports = (ctx) => {
  // If the tests fail to run, should the execution error
  if (ctx.execError) {
    let output = `
⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ 
⚠ ERROR: Tests failed to run! ⚠
⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠

Error Details:
-------------
${ctx.execError}
    `.trim();
    return toAnnotation('error', output);
  }

  const output = `
${ctx.passingCount} / ${ctx.totalCount} Tests Passing
-----------------------
${ctx.results.map(res => `
${res.isPassing ? '✔' : '✗'} ${res.fullName}
${res.hints.map(hint => 
`    ⚠ HINT: ${hint}`
).join('\n')}
`.trim()).join('\n')}
`.trim();

  return toAnnotation('warning', output);
}

function toAnnotation(level, msg) {
  // Note that Github annotations will not render line-breaks as-is.
  // You need to url encode them. See:
  //  https://github.com/actions/toolkit/issues/319#issuecomment-620871229
  //  https://github.com/actions/toolkit/issues/193#issuecomment-605394935
  return `::${level}::${msg.replace(/\n/g, '%0A')}`;
}