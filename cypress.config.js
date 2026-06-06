const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.demoblaze.com',
    specPattern: ['cypress/e2e/**/*.js'],
    supportFile: 'cypress/support/e2e.js',
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 20000,
    responseTimeout: 30000,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    env: {
      apiBaseUrl: 'https://api.demoblaze.com',
    },
  },

  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    reportPageTitle: 'Demoblaze Automation Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false
  },
  viewportWidth: 1440,
  viewportHeight: 900,
});
