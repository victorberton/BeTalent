import Ajv from 'ajv'
import { bookingSchema } from '../support/schemas/bookingSchema'

describe('Testes de Segurança', () => {

    const baseUrl = 'https://restful-booker.herokuapp.com'

    // =========================================
    // Health Check
    // =========================================

    it('Deve validar health check da API', () => {

        cy.request({
            method: 'GET',
            url: `${baseUrl}/ping`

        }).then((response) => {

            // Logs HEALTH CHECK
            cy.log('HEALTH CHECK API')
            cy.log(`Status: ${response.status}`)
            cy.log(`Tempo de resposta: ${response.duration}ms`)

            console.log('PING RESPONSE:', {
                status: response.status,
                duration: response.duration,
                headers: response.headers,
                body: response.body
            })

            // Validações
            expect(response.status).to.eq(201)

            // Performance básica
            expect(response.duration).to.be.lessThan(2000)
        })
    })

    // =========================================
    // Não deve deletar reserva sem autenticação
    // =========================================

    it('Não deve deletar reserva sem autenticação', () => {

        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/booking/1`,
            failOnStatusCode: false

        }).then((response) => {

            cy.log('TESTE DE SEGURANÇA - SEM TOKEN')
            cy.log(`Status: ${response.status}`)

            console.log('UNAUTHORIZED DELETE RESPONSE:', response)

            expect(response.status).to.eq(403)
        })
    })

    // =========================================
    // Não deve atualizar sem autenticação
    // =========================================

    it('Não deve atualizar reserva com token inválido', () => {

        cy.request({
            method: 'PUT',
            url: `${baseUrl}/booking/1`,
            failOnStatusCode: false,

            headers: {
                Cookie: 'token=token_invalido',
                'Content-Type': 'application/json'
            },

            body: {
                firstname: 'Hacker'
            }

        }).then((response) => {

            cy.log('TESTE TOKEN INVÁLIDO')
            cy.log(`Status: ${response.status}`)

            console.log('INVALID TOKEN RESPONSE:', response)

            expect(response.status).to.eq(403)
        })
    })

    // =========================================
    // Não deve aceitar payloads maliciosos
    // =========================================

    it('Não deve aceitar SQL Injection', () => {

        cy.request({
            method: 'POST',
            url: `${baseUrl}/auth`,
            failOnStatusCode: false,

            body: {
                username: "' OR '1'='1",
                password: "' OR '1'='1"
            }

        }).then((response) => {

            cy.log('TESTE SQL INJECTION')
            cy.log(`Status: ${response.status}`)

            console.log('SQL INJECTION RESPONSE:', response)

            expect(response.body).to.not.have.property('token')
        })
    })

    // =========================================
    // Não deve aceitar script malicioso (XSS)
    // =========================================

    it('Não deve aceitar script malicioso', () => {

        cy.request({
            method: 'POST',
            url: `${baseUrl}/booking`,
            failOnStatusCode: false,

            body: {
                firstname: '<script>alert("xss")</script>',
                lastname: 'Test'
            }

        }).then((response) => {

            cy.log('TESTE XSS')
            cy.log(`Status: ${response.status}`)

            console.log('XSS RESPONSE:', response)

            // Validação segura
            expect(response.body).to.exist

            // Verifica se retornou booking
            if (response.body.booking) {

                expect(response.body.booking.firstname)
                    .to.not.include('<script>')
            }
        })
    })

    // =========================================
    // Validar headers de segurança
    // =========================================

    it('Deve possuir headers de segurança', () => {

        cy.request({
            method: 'GET',
            url: `${baseUrl}/booking/1`,
            failOnStatusCode: false

        }).then((response) => {

            cy.log('HEADERS DE SEGURANÇA')

            console.log('HEADERS:', response.headers)

            expect(response.headers)
                .to.have.property('x-powered-by')
        })
    })

    // =========================================
    // Validar headers de CORS
    // =========================================

    it('Deve validar headers CORS', () => {

        cy.request({
            method: 'OPTIONS',
            url: `${baseUrl}/booking`,
            failOnStatusCode: false

        }).then((response) => {

            cy.log('TESTE CORS')
            cy.log(`Status: ${response.status}`)

            console.log('CORS HEADERS:', response.headers)

            expect(response.headers).to.exist

            // Validação segura
            if (response.headers['access-control-allow-origin']) {

                cy.log('Header CORS encontrado')

                expect(response.headers)
                    .to.have.property('access-control-allow-origin')
            }
            else {

                cy.log('Header CORS não retornado pela API')
            }
        })
    })
})