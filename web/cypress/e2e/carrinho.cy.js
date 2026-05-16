import { PRODUCTS } from '../support/products'
import { REMOVE_PRODUCTS } from '../support/products'
import { dispositivos } from '../support/responsive'

describe('Carrinho de Compras', () => {

  dispositivos.forEach(({ nome, largura, altura }) => {

    describe(`Em ${nome}`, () => {

      beforeEach(() => {
        cy.viewport(largura, altura)
        cy.start()
        cy.login('standard_user', 'secret_sauce')
      })

      it('Adicionar item ao carrinho', () => {

        cy.get(`[data-test="${PRODUCTS.BACKPACK}"]`).click()
        cy.get(`[data-test="${PRODUCTS.BOLT_SHIRT}"]`).click()
        cy.get(`[data-test="${PRODUCTS.ONESIE}"]`).click()

        cy.get('[data-test="shopping-cart-badge"]').should('have.text', '3')

        cy.get('[data-test="shopping-cart-link"]').click()

        cy.get('[data-test="inventory-item"]').should('have.length', 3)

        cy.takeStepScreenshot('carrinho', 'adicionar-item')
      })

      it('Remover item do carrinho', () => {

        cy.get(`[data-test="${PRODUCTS.BACKPACK}"]`).click()
        cy.get(`[data-test="${PRODUCTS.BOLT_SHIRT}"]`).click()
        cy.get(`[data-test="${PRODUCTS.ONESIE}"]`).click()

        cy.get('[data-test="shopping-cart-link"]').click()

        cy.get(`[data-test="${REMOVE_PRODUCTS.BACKPACK}"]`).click()
        cy.get(`[data-test="${REMOVE_PRODUCTS.BOLT_SHIRT}"]`).click()
        cy.get(`[data-test="${REMOVE_PRODUCTS.ONESIE}"]`).click()

        cy.get('[data-test="inventory-item"]').should('have.length', 0)

        cy.takeStepScreenshot('carrinho', 'remover-item')
      })

      it(`Acessibilidade - página do carrinho em ${nome}`, () => {
        cy.get(`[data-test="${PRODUCTS.BACKPACK}"]`).click()
        cy.get('[data-test="shopping-cart-link"]').click()
        cy.injectAxe()
        cy.checkA11y(null, { includedImpacts: ['critical', 'serious'] })
      })
    })
  })
})