/**
 * DO NOT TOUCH
 * 
 * For Prime Instructional Staff use only.
 */
module.exports = (ctx) => {
  const resultColor = (result) => {
    if (result.status === 'passed') {
      return 'success';
    }
    else if (result.isStretch || result.isGeneral) {
      return 'secondary'
    }
    return 'danger';
  } 

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Results</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js" integrity="sha384-LtrjvnR4Twt/qOuYxE721u19sVFLVSA4hf/rRt6PrZTmiPltdZcI7q7PXQBYTKyf" crossorigin="anonymous"></script>
    <style>
    h1 {
      padding: 60px 0 20px 0;
    }
    .alert {
      margin-bottom: 30px;
    }
    .hintsTitle {
      font-style: italic;
      margin-top: 5px;
    }
    .card-body {
      font-style: italic;
      padding: 10px;
    }
    .collapse {
      background: #ffffffc2;
      padding: 5px 20px;
      margin-top: 20px;
    }
    pre, code {
      background: rgb(140 140 140 / 30%);
      padding: 2px 5px;
      color: inherit;
      white-space: pre-wrap;
    }
    li.has-hints {
      cursor: pointer;
    }
    </style>
  </head>
  <body>
    <div class="container">
      
      <h1>Test Results</h1>

      ${ctx.execError ?
        `
        <div class="alert alert-danger">
          <h4 class="alert-heading">Tests failed to run!</h4>
          <p>
            This means there's probably an error in your app. 
            Carefully read the <em>Error Details</em> below, and see if you can work it out!
          </p>
          <hr>
          <p class="mb-0">
            <em>Error Details:</em>
          </p>
          <pre>${ctx.execError}</pre>
        </div>
        `
        : ''
      }
      
      <div class="alert ${{
        0: 'alert-danger',
        [ctx.totalCount]: 'alert-success',
      }[ctx.passingCount] || 'alert-warning'}">
        ${ctx.passingCount} / ${ctx.totalCount} Test passing
      </div>
      
      <ul id="accordion" class="list-group">
        ${ctx.results.map((res, i) => `
          <li class="list-group-item list-group-item-${resultColor(res)} ${res.hints.length ? 'has-hints' : ''}">
            <div class="alert-link" data-toggle="collapse" data-target="#collapse-${i}" aria-expanded="true" aria-controls="collapse-${i}">
              ${escapeHTML(res.fullName)}
            </div>
            
            ${res.status === 'failed' && res.hints.length ?
             `
              <div id="collapse-${i}" class="collapse ${res.isStretch || res.isGeneral ? '' : 'show'}">
                <div class="hintsTitle">Hint:</div>
                ${res.hints.map(hint => `
                  <div class="card-body">
                    ${escapeHTML(hint)}
                  </div>
                `).join('\n<hr />\n')}
              </div>
             ` : ''
            }
            



          </li>


        `).join('\n')}
        
      </ul>
    </div>
  </body>
  </html>
`;
}

// https://stackoverflow.com/a/20403618/830030
function escapeHTML(s) {
  return s.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Replace `some code` with <code>some code</code>
    .replace(/`(.*?)`/g, (_, match) => `<code>${match}</code>`)
    // Replace newlines with <br />
    .replace(/\n/g, '<br />');
}