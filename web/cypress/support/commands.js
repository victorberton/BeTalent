import 'cypress-real-events'
import { dispositivos } from '../support/responsive'

Cypress.Commands.add('start', () => {
  cy.visit('https://www.saucedemo.com/')
})

// Comando separado para responsividade
Cypress.Commands.add('testarResponsividade', (callback) => {
  dispositivos.forEach(({ nome, largura, altura }) => {
    cy.viewport(largura, altura)
    cy.log(`Testando em ${nome} - ${largura}x${altura}`)
    callback(nome)
  })
})

Cypress.Commands.add('login', (email, password) => {
    cy.start()
    cy.get('[data-test="username"]').type(email)
    cy.get('[data-test="password"]').type(password)

    cy.get('[data-test="login-button"]').click()
})

Cypress.Commands.add('takeStepScreenshot', (folder, fileName) => {

  const executionFolder = Cypress.env('executionFolder')

  cy.screenshot(
    `${executionFolder}/${folder}/${fileName}`,
    {
      capture: 'fullPage'
    }
  )
})