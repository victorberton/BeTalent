import { PRODUCTS } from '../support/products'
import { dispositivos } from '../support/responsive'

describe('Checkout', () => {

    dispositivos.forEach(({ nome, largura, altura }) => {

        describe(`Em ${nome}`, () => {

            beforeEach(() => {
                cy.viewport(largura, altura)
                cy.start()
                cy.login('standard_user', 'secret_sauce')
            })

            it('Checkout Completo', () => {
                cy.get(`[data-test="${PRODUCTS.BACKPACK}"]`).click()
                cy.get(`[data-test="${PRODUCTS.BOLT_SHIRT}"]`).click()

                cy.get('[data-test="shopping-cart-link"]').click()

                cy.get('[data-test="inventory-item"]').should('have.length', 2)

                cy.get('[data-test="shopping-cart-link"]')
                    .should('be.visible')
                    .click()

                cy.get('[data-test="checkout"]')
                    .should('be.visible')
                    .click()

                cy.get('[data-test="firstName"]').type('Victor')
                cy.get('[data-test="lastName"]').type('Berton')
                cy.get('[data-test="postalCode"]').type('12345678')

                cy.takeStepScreenshot('checkout', 'infoForm')

                cy.get('[data-test="continue"]').click()
                cy.url().should('include', '/checkout-step-two.html')

                cy.get('[data-test="title"]')
                    .should('have.text', 'Checkout: Overview')

                cy.get('[data-test="inventory-item"]')
                    .should('have.length', 2)

                cy.get('[data-test="payment-info-value"]')
                    .should('have.text', 'SauceCard #31337')

                cy.get('[data-test="shipping-info-value"]')
                    .should('have.text', 'Free Pony Express Delivery!')

                cy.get('[data-test="subtotal-label"]')
                    .invoke('text')
                    .should('eq', 'Item total: $45.98'),

                    cy.get('[data-test="tax-label"]')
                        .should('have.text', 'Tax: $3.68')

                cy.get('[data-test="total-label"]')
                    .should('have.text', 'Total: $49.66')

                cy.takeStepScreenshot('checkout', 'checkout-overview')

                cy.get('[data-test="finish"]').should('be.visible').click()

                cy.url().should('include', '/checkout-complete.html')

                cy.get('[data-test="complete-header"]')
                    .should('have.text', 'Thank you for your order!')

                cy.get('[data-test="complete-text"]')
                    .should('have.text', 'Your order has been dispatched, and will arrive just as fast as the pony can get there!')

                cy.takeStepScreenshot('checkout', 'checkout-complete')

                cy.get('[data-test="back-to-products"]')
                    .should('be.visible').click()

                cy.url().should('include', '/inventory.html')
            })

            it(`Acessibilidade - página de formulário em ${nome}`, () => {
                cy.get(`[data-test="${PRODUCTS.BACKPACK}"]`).click()
                cy.get('[data-test="shopping-cart-link"]').click()
                cy.get('[data-test="checkout"]').click()
                cy.injectAxe()
                cy.checkA11y(null, { includedImpacts: ['critical', 'serious'] })
            })

            it(`Acessibilidade - página de resumo em ${nome}`, () => {
                cy.get(`[data-test="${PRODUCTS.BACKPACK}"]`).click()
                cy.get('[data-test="shopping-cart-link"]').click()
                cy.get('[data-test="checkout"]').click()
                cy.get('[data-test="firstName"]').type('Victor')
                cy.get('[data-test="lastName"]').type('Berton')
                cy.get('[data-test="postalCode"]').type('12345678')
                cy.get('[data-test="continue"]').click()
                cy.injectAxe()
                cy.checkA11y(null, { includedImpacts: ['critical', 'serious'] })
            })

            it(`Acessibilidade - página de conclusão em ${nome}`, () => {
                cy.get(`[data-test="${PRODUCTS.BACKPACK}"]`).click()
                cy.get('[data-test="shopping-cart-link"]').click()
                cy.get('[data-test="checkout"]').click()
                cy.get('[data-test="firstName"]').type('Victor')
                cy.get('[data-test="lastName"]').type('Berton')
                cy.get('[data-test="postalCode"]').type('12345678')
                cy.get('[data-test="continue"]').click()
                cy.get('[data-test="finish"]').click()
                cy.injectAxe()
                cy.checkA11y(null, { includedImpacts: ['critical', 'serious'] })
            })
        })
    })
})