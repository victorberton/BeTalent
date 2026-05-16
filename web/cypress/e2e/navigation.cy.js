import { PRODUCTS } from '../support/products'
import { dispositivos } from '../support/responsive'


describe('Navegação pelo portal', () => {

  dispositivos.forEach(({ nome, largura, altura }) => {

    describe(`Em ${nome}`, () => {

      beforeEach(() => {
        cy.viewport(largura, altura)
        cy.start()
        cy.login('standard_user', 'secret_sauce')
      })

      it('Nevagar pelo portal, menus e checkout', () => {
        Cypress.on('uncaught:exception', () => false)

        cy.get('#react-burger-menu-btn').click()

        cy.takeStepScreenshot('navigation', 'menu-opened')

        cy.get('[data-test="about-sidebar-link"]')
          .invoke('removeAttr', 'target')
          .click()

        cy.url().should('include', 'saucelabs.com')

        cy.go('back')

        cy.url().should('include', '/inventory.html')

        cy.get('[data-test="inventory-item-name"]')
          .first()
          .should('be.visible')
          .click()

        cy.get('#react-burger-menu-btn').click()

        cy.get('[data-test="inventory-sidebar-link"]')
          .should('be.visible')
          .click()

        cy.get(`[data-test="${PRODUCTS.BACKPACK}"]`).click()

        cy.takeStepScreenshot('navigation', 'product-selected')

        cy.get('[data-test="shopping-cart-link"]')
          .should('be.visible')
          .click()

        cy.get('[data-test="checkout"]')
          .should('be.visible')
          .click()

        cy.get('[data-test="firstName"]').type('Victor')
        cy.get('[data-test="lastName"]').type('Berton')
        cy.get('[data-test="postalCode"]').type('12345678')

        cy.get('[data-test="continue"]').click()
      })

      it(`Acessibilidade - Navegação completa em ${nome}`, () => {
        Cypress.on('uncaught:exception', () => false)

        cy.get('#react-burger-menu-btn').click()

        cy.get('[data-test="about-sidebar-link"]')
          .invoke('removeAttr', 'target')
          .click()

        cy.url().should('include', 'saucelabs.com')

        cy.go('back')

        cy.url().should('include', '/inventory.html')

        cy.get('[data-test="inventory-item-name"]')
          .first()
          .should('be.visible')
          .click()

        cy.get('#react-burger-menu-btn').click()

        cy.get('[data-test="inventory-sidebar-link"]')
          .should('be.visible')
          .click()

        cy.get(`[data-test="${PRODUCTS.BACKPACK}"]`).click()

        cy.get('[data-test="shopping-cart-link"]')
          .should('be.visible')
          .click()

        cy.get('[data-test="checkout"]')
          .should('be.visible')
          .click()

        cy.get('[data-test="firstName"]').type('Victor')
        cy.get('[data-test="lastName"]').type('Berton')
        cy.get('[data-test="postalCode"]').type('12345678')

        cy.get('[data-test="continue"]').click()

        cy.injectAxe()

        cy.checkA11y(
          null,
          {
            includedImpacts: ['critical', 'serious']
          }
        )
      })
    })
  })
})