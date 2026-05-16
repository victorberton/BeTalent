const { defineConfig } = require('cypress')

const now = new Date()

const executionFolder =
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`

module.exports = defineConfig({

  env: {
    executionFolder
  },

  e2e: {
    setupNodeEvents(on, config) {

      return config
    }
  }
})