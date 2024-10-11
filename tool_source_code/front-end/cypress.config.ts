import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173'
  },
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'results/junit.xml',
    toConsole: true
  }
})
