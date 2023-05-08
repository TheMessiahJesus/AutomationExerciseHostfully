const { defineConfig } = require("cypress");
const cucumber = require('cypress-cucumber-preprocessor').default

module.exports = defineConfig({
  //project id used to identify the project to reflect the results in the cypress dashboard: https://cloud.cypress.io/projects/e1u7o8/runs/2/test-results?actions=%5B%5D&browsers=%5B%5D&groups=%5B%5D&isFlaky=%5B%5D&modificationDateRange=%7B%22startDate%22%3A%221970-01-01%22%2C%22endDate%22%3A%222038-01-19%22%7D&orderBy=EXECUTION_ORDER&oses=%5B%5D&specs=%5B%5D&statuses=%5B%5D&testingTypesEnum=%5B%5D
  projectId: "e1u7o8",
  //mochaawesome reports configurations used to generate reports, they are located in cypress->results->(for visual experience open in a web browser)mochaawesome.html
  reporter: "mochawesome",
   reporterOptions: {
      charts: true,
      html: true,
      json: true,
      reportDir: "cypress/results",
      reportFileName: "report",
      overwrite: true
   },
  env :{
    // This variable holds the main url exercise link
    urlE2E:"https://computer-database.gatling.io/computers",
  },
  e2e: {
    setupNodeEvents(on, config) {
      // this node event listener takes care of combining the esbuild plugin with the cucumber plugin so they play nicely together.
      on('file:preprocessor', cucumber())
    },
    //change the extention of the tests that will be executed, from js to feature for CUCUMBER gherkin files
    specPattern: 'cypress/integration/BDD/*.feature'
  },
});
