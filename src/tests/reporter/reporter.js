/**
 * DO NOT TOUCH
 * 
 * For Prime Instructional Staff use only.
 */
const fs = require('fs');
const reportHtml = require('./report-html');
const reportMd = require('./report-md');
const reportGithubActions = require('./report-github-actions');

/**
 * Custom Jest Reporter, for student-facing test reports.
 * 
 * Generates an HTML report at ./test-report.html.
 * 
 * Test include "hints" for students, instead of full error stacks
 * We're using jest-expect-message to include custom messages
 * with our expect() calls. We pull out these custom messages,
 * and display them in the student-facing report. This is a 
 * better experience for them vs. seeing error call stacks.
 * And it lets us control how big of a "hint" we want to give them.
 * 
 * Within tests, you'll make a hint like so:
 * 
 *    expect(
 *      foo,
 *      'Try making your foo more bar',   // <-- "hint"
 *    ).toBe("bar");
 */
class Reporter {

  onRunComplete(contexts, results) {
    // Show a special message, if tests fail to load
    // (eg. `import` failing from a missing dependency)
    for (let res of results.testResults) {
      if (res.testExecError) {
        this.report({
          execError: res.testExecError.message,
          results: [],
          passingCount: 0,
          failingCount: 0,
          totalCount: 0,
        })
        return;
      }
    }
    
    // Grab child-est test results (ignore files, describes, etc);
    let testResults = (function getTestResults(results) {
      let testResults = [];
      results.forEach(res => {
        if (res.testResults) {
          testResults.push(...getTestResults(res.testResults));
        }
        else {
          testResults.push(res);
        }
      });
      return testResults;
    })(results.testResults);

    // Look through test results, and grab any data we want 
    // to include in our report
    let resultsSummary = testResults.map(res => ({
        status: res.status,
        isPassing: res.status === 'passed',
        fullName: res.fullName, 
        isStretch: /STRETCH/.test(res.fullName),
        isGeneral: /GENERAL/.test(res.fullName),
        // "hints" aka failure messages
        hints: res.failureMessages
          .map(msg => this.getHint(msg))
          .filter(Boolean)
    }));

    // Prepare a "context" for report templating
    let passingCount = resultsSummary.filter(i => i.status === 'passed').length;
    let ctx = {
      results: resultsSummary,
      passingCount,
      failingCount: resultsSummary.length - passingCount,
      totalCount: resultsSummary.length,
    };
    
    // Generate a report
    this.report(ctx);
  }

  /**
   * Convert test failure messages to "hints"
   * Assumes we're using jest-expect-message for custom
   * test failure messages.
   */
  getHint(msg) {
    // jest-expect-message just prepends these custom messages
    // on top of the regular error stack. So RegEx to the ResCue!
    let matches = msg.match(/Custom message:\n\s+(.*)\n\nexpect\(/s);
    return matches && matches[1];
  }

  /**
   * Generate a report
   */
  report(ctx) {
    // Assuming our CI environment is Github Actions
    if (process.env.CI) {
      // Generate a Github Action annotation message
      // and log it to stdout
      let msg = reportGithubActions(ctx);
      process.stdout.write(msg);

      // Write the test result JSON to a file
      // to save as an artifact. We can load this into
      // the portal, and use it as needed
      fs.writeFileSync('testResults.json', JSON.stringify(ctx));
    }
    
    // Generate an HTML report
    // and write it to a file
    let html = reportHtml(ctx);
    fs.writeFileSync('testResults.html', html, 'utf8');

    // Generate a Markdown report
    // and write it to a file
    let md = reportMd(ctx);
    fs.writeFileSync('testResults.md', md, 'utf8');
  }
}

module.exports = Reporter;