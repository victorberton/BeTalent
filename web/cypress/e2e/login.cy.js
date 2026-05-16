import { dispositivos } from '../support/responsive'

describe('Login', () => {

  dispositivos.forEach(({ nome, largura, altura }) => {
    describe(`Em ${nome}`, () => {

      it(`Login válido - standard_user em ${nome}`, () => {
        cy.viewport(largura, altura)
        cy.start()
        cy.login('standard_user', 'secret_sauce')

        cy.get('[data-test="title"]')
          .should('be.visible')
          .and('have.text', 'Products')

        cy.takeStepScreenshot('login', 'login-valido')
      })

      it(`Login com usuário bloqueado em ${nome}`, () => {
        cy.viewport(largura, altura)
        cy.start()
        cy.login('locked_out_user', 'secret_sauce')

        cy.contains('Epic sadface: Sorry, this user has been locked out.')
          .should('be.visible')

        cy.takeStepScreenshot('login', 'login-bloqueado')
      })

      it(`Login - Problem User em ${nome}`, () => {
        cy.viewport(largura, altura)
        cy.start()
        cy.login('problem_user', 'secret_sauce')

        cy.get('[data-test="title"]')
          .should('be.visible')
          .and('have.text', 'Products')

        cy.takeStepScreenshot('login', 'problem-user')
      })

      it(`Login - Performance Glitch User em ${nome}`, () => {
        cy.viewport(largura, altura)
        cy.start()
        cy.login('performance_glitch_user', 'secret_sauce')

        cy.get('[data-test="title"]')
          .should('be.visible')
          .and('have.text', 'Products')

        cy.takeStepScreenshot('login','performance-glitch-user')
      })

      it(`Login - Error User em ${nome}`, () => {
        cy.viewport(largura, altura)
        cy.start()
        cy.login('error_user', 'secret_sauce')

        cy.get('[data-test="title"]')
          .should('be.visible')
          .and('have.text', 'Products')

        cy.takeStepScreenshot('login','error-user')
      })

      it(`Login - Visual User em ${nome}`, () => {
        cy.viewport(largura, altura)
        cy.start()
        cy.login('visual_user', 'secret_sauce')

        cy.get('[data-test="title"]')
          .should('be.visible')
          .and('have.text', 'Products')

        cy.takeStepScreenshot('login','visual-user')
      })

      it(`Acessibilidade - página de login em ${nome}`, () => {
        cy.viewport(largura, altura)
        cy.start()
        cy.injectAxe()
        cy.checkA11y(null, {
          includedImpacts: ['critical', 'serious']
        })
      })
    })
  })
})