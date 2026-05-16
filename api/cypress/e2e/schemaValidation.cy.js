import Ajv from 'ajv'
import { bookingSchema } from '../support/schemas/bookingSchema'



// =========================================
// Validar schema da reserva
// =========================================
describe('Validação de Schema', () => {

    const ajv = new Ajv()
    const validate = ajv.compile(bookingSchema)

    const baseUrl = 'https://restful-booker.herokuapp.com'

    it('Deve validar schema da reserva', () => {

        cy.fixture('booking').then((booking) => {

            const ajv = new Ajv()

            const validate = ajv.compile(bookingSchema)

            // Cria reserva
            cy.request({
                method: 'POST',
                url: `${baseUrl}/booking`,
                body: booking

            }).then((createResponse) => {

                expect(createResponse.status).to.eq(200)

                const bookingId = createResponse.body.bookingid

                cy.log(`Reserva criada: ${bookingId}`)

                // Consulta reserva criada
                cy.request({
                    method: 'GET',
                    url: `${baseUrl}/booking/${bookingId}`

                }).then((getResponse) => {

                    cy.log('SCHEMA VALIDATION')

                    cy.log(`Status: ${getResponse.status}`)

                    console.log('GET RESPONSE:', getResponse.body)

                    // Valida status
                    expect(getResponse.status).to.eq(200)

                    // Valida schema
                    const valid = validate(getResponse.body)

                    console.log('VALID:', valid)

                    console.log('SCHEMA ERRORS:', validate.errors)

                    expect(
                        valid,
                        JSON.stringify(validate.errors)
                    ).to.be.true
                })
            })
        })
    })
})