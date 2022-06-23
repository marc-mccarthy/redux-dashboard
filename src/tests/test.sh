#!/usr/bin/env bash
##############################################
# DO NOT TOUCH                               #
#                                            #
# For Prime Instructional Staff use only.    #
##############################################

# Failing tests should make this script fail,
# in a CI environment.
if [[ -n "$CI" ]]; then
  set -e
fi

# Run the tests
react-scripts test \
  --env=jsdom \
  ${testNamePatternFlag} \
  --reporters=./src/tests/reporter/reporter.js \
  --no-color \
  --watchAll=false

# If we're running from Github Actions, show a "All tested passed!"
# message in the workflow annotations
if [[ -n "$CI" ]]; then
  echo "::warning::All tests passed! Great work!"
# If we're running locally, open the HTML report
# Uses our custom reporter
else
  echo "Testing complete!"
  open ./testResults.html
fi