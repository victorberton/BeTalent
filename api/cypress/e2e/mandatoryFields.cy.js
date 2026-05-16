import Ajv from 'ajv'

describe('Validações Negativas', () => {
    // =========================================
    // Validar campos obrigatórios
    // =========================================
    const baseUrl = 'https://restful-booker.herokuapp.com'

    it('Deve validar campos obrigatórios', () => {

        const invalidPayload = {
            firstname: '',
            lastname: ''
        }

        cy.request({
            method: 'POST',
            url: `${baseUrl}/booking`,
            failOnStatusCode: false,
            body: invalidPayload

        }).then((response) => {

            // Logs VALIDAÇÃO NEGATIVA
            cy.log('VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS')
            cy.log(`Status retornado: ${response.status}`)
            cy.log(`Tempo de resposta: ${response.duration}ms`)

            console.log('INVALID REQUEST:', invalidPayload)

            console.log('VALIDATION RESPONSE:', {
                status: response.status,
                duration: response.duration,
                headers: response.headers,
                body: response.body
            })

            // Validação
            expect(response.status).to.not.eq(200)
        })
    })
})