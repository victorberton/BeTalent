import { SORT_OPTIONS } from '../support/sort'
import { dispositivos } from '../support/responsive'

describe('Ordenar e Filtrar Produtos', () => {

  dispositivos.forEach(({ nome, largura, altura }) => {

    describe(`Em ${nome}`, () => {

      beforeEach(() => {
        cy.viewport(largura, altura)
        cy.start()
        cy.login('standard_user', 'secret_sauce')
      })

      it('Ordenar Produtos A-Z', () => {

        cy.get('[data-test="product-sort-container"]').select(SORT_OPTIONS.NAME_ASC)

        cy.get('.inventory_item_name').then(($itens) => {

          const prodTitulos = [...$itens].map(el => el.innerText.trim())

          const titulosOrdenados = [...prodTitulos].sort((a, b) => a.localeCompare(b, 'en-US', { sensitivity: 'base' })
          )

          expect(prodTitulos).to.deep.equal(titulosOrdenados)

          cy.takeStepScreenshot('productListing', 'ordenar-az')
        })
      })

      it('Ordenar Produtos Z-A', () => {

        cy.get('[data-test="product-sort-container"]').select(SORT_OPTIONS.NAME_DESC)

        cy.get('.inventory_item_name').then(($itens) => {

          const prodTitulos = [...$itens].map(el => el.innerText.trim())

          const titulosOrdenados = [...prodTitulos].sort((a, b) => b.localeCompare(a, 'en-US', { sensitivity: 'base' })
          )

          expect(prodTitulos).to.deep.equal(titulosOrdenados)
          cy.takeStepScreenshot('productListing', 'ordenar-za')
        })
      })

      it('Ordenar Price Low to High', () => {

        cy.get('[data-test="product-sort-container"]').select(SORT_OPTIONS.PRICE_ASC)

        cy.get('.inventory_item_price').then(($itens) => {
          const precos = [...$itens].map(el =>
            parseFloat(el.innerText.replace('$', '').trim())
          )

          const precosOrdenados = [...precos].sort((a, b) => a - b)

          expect(precos).to.deep.equal(precosOrdenados)
          cy.takeStepScreenshot('productListing', 'ordenar-preco-baixo-alto')
        })
      })

      it('Ordenar Price High to Low', () => {

        cy.get('[data-test="product-sort-container"]').select(SORT_OPTIONS.PRICE_DESC)

        cy.get('.inventory_item_price').then(($itens) => {
          const precos = [...$itens].map(el =>
            parseFloat(el.innerText.replace('$', '').trim())
          )

          const precosOrdenados = [...precos].sort((a, b) => b - a)

          expect(precos).to.deep.equal(precosOrdenados)
          cy.takeStepScreenshot('productListing', 'ordenar-preco-alto-baixo')
        })
      })

      it(`Acessibilidade - Ordenação de Produtos em ${nome}`, () => {

        cy.get('[data-test="product-sort-container"]')
          .should('be.visible')
          .select(SORT_OPTIONS.NAME_ASC)

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