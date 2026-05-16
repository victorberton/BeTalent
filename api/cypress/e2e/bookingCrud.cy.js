import { bookingSchema } from '../support/schemas/bookingSchema'

describe('API - Restful Booker', () => {

  const baseUrl = 'https://restful-booker.herokuapp.com'

  // =========================================
  // Basic Auth
  // =========================================

  it('Deve autenticar com sucesso', () => {

    cy.request({
      method: 'POST',
      url: 'https://restful-booker.herokuapp.com/auth',
      body: {
        username: 'admin',
        password: 'password123'
      }

    }).then((response) => {

      cy.log(`Token gerado: ${response.body.token}`)

      expect(response.status).to.eq(200)

      expect(response.body)
        .to.have.property('token')
    })
  })

   // =========================================
  // Listar reservas
  // =========================================

  it('Deve consultar lista de reservas', () => {

    cy.request({
      method: 'GET',
      url: `${baseUrl}/booking`

    }).then((response) => {

      // Logs GET
      cy.log('CONSULTA DE RESERVAS')
      cy.log(`Status GET: ${response.status}`)
      cy.log(`Tempo de resposta: ${response.duration}ms`)
      cy.log(`Quantidade retornada: ${response.body.length}`)

      console.log('GET BOOKINGS RESPONSE:', {
        status: response.status,
        duration: response.duration,
        headers: response.headers,
        body: response.body
      })

      // Validações
      expect(response.status).to.eq(200)

      expect(response.body).to.be.an('array')

      expect(response.body.length).to.be.greaterThan(0)

      // Valida estrutura básica
      expect(response.body[0]).to.have.property('bookingid')
    })
  })

  // =========================================
  // Create
  // =========================================

  it('Deve criar uma reserva com sucesso', () => {

    cy.fixture('booking').then((booking) => {

      cy.request({
        method: 'POST',
        url: `${baseUrl}/booking`,
        body: booking

      }).then((response) => {

        const bookingId = response.body.bookingid

        // Logs visíveis no Cypress Runner
        cy.log('RESERVA CRIADA')
        cy.log(`Status: ${response.status}`)
        cy.log(`Booking ID: ${bookingId}`)
        cy.log(`Cliente: ${booking.firstname} ${booking.lastname}`)
        cy.log(`Tempo de resposta: ${response.duration}ms`)

        // Logs técnicos no console
        console.log('CREATE REQUEST:', booking)

        console.log('CREATE RESPONSE:', {
          status: response.status,
          duration: response.duration,
          headers: response.headers,
          body: response.body
        })

        // Validações
        expect(response.status).to.eq(200)

        expect(response.body).to.have.property('bookingid')

        expect(response.body.booking).to.include({
          firstname: booking.firstname,
          lastname: booking.lastname,
          totalprice: booking.totalprice,
          depositpaid: booking.depositpaid,
          additionalneeds: booking.additionalneeds
        })

        expect(response.body.booking.bookingdates)
          .to.deep.equal(booking.bookingdates)
      })
    })
  })

  // =========================================
  // Consulta
  // =========================================

  it('Deve consultar uma reserva criada', () => {

    cy.fixture('booking').then((booking) => {

      // Cria reserva
      cy.request({
        method: 'POST',
        url: `${baseUrl}/booking`,
        body: booking

      }).then((createResponse) => {

        expect(createResponse.status).to.eq(200)

        const bookingId = createResponse.body.bookingid

        // Logs da criação
        cy.log('=== RESERVA CRIADA ===')
        cy.log(`Status Create: ${createResponse.status}`)
        cy.log(`Booking ID: ${bookingId}`)
        cy.log(`Cliente: ${booking.firstname} ${booking.lastname}`)

        console.log('CREATE RESPONSE:', {
          status: createResponse.status,
          duration: createResponse.duration,
          headers: createResponse.headers,
          body: createResponse.body
        })

        // Consulta reserva criada
        cy.request({
          method: 'GET',
          url: `${baseUrl}/booking/${bookingId}`

        }).then((getResponse) => {

          // Logs da consulta
          cy.log('CONSULTA DE RESERVA')
          cy.log(`Status GET: ${getResponse.status}`)
          cy.log(`Reserva consultada: ${bookingId}`)
          cy.log(`Tempo de resposta: ${getResponse.duration}ms`)

          console.log('GET RESPONSE:', {
            status: getResponse.status,
            duration: getResponse.duration,
            headers: getResponse.headers,
            body: getResponse.body
          })

          // Validações
          expect(getResponse.status).to.eq(200)

          expect(getResponse.body).to.include({
            firstname: booking.firstname,
            lastname: booking.lastname,
            totalprice: booking.totalprice,
            depositpaid: booking.depositpaid,
            additionalneeds: booking.additionalneeds
          })

          expect(getResponse.body.bookingdates)
            .to.deep.equal(booking.bookingdates)
        })
      })
    })
  })

  // =========================================
  // Atualizar
  // =========================================

  it('Deve atualizar uma reserva', () => {

    cy.fixture('booking').then((booking) => {

      // Cria reserva
      cy.request({
        method: 'POST',
        url: `${baseUrl}/booking`,
        body: booking

      }).then((createResponse) => {

        expect(createResponse.status).to.eq(200)

        const bookingId = createResponse.body.bookingid

        // Logs CREATE
        cy.log('=== RESERVA CRIADA ===')
        cy.log(`Status Create: ${createResponse.status}`)
        cy.log(`Booking ID: ${bookingId}`)
        cy.log(`Cliente: ${booking.firstname} ${booking.lastname}`)
        cy.log(`Tempo Create: ${createResponse.duration}ms`)

        console.log('CREATE REQUEST:', booking)

        console.log('CREATE RESPONSE:', {
          status: createResponse.status,
          duration: createResponse.duration,
          headers: createResponse.headers,
          body: createResponse.body
        })

        // Busca token
        cy.getToken().then((token) => {

          cy.log('=== AUTENTICAÇÃO ===')
          cy.log(`Token gerado: ${token.substring(0, 8)}...`)

          console.log('TOKEN:', token)

          // Payload atualizado
          const updatedBooking = {
            firstname: 'QA',
            lastname: 'Automation',
            totalprice: 1500,
            depositpaid: false,
            bookingdates: {
              checkin: '2026-06-01',
              checkout: '2026-06-10'
            },
            additionalneeds: 'Lunch'
          }

          // Atualiza reserva
          cy.request({
            method: 'PUT',
            url: `${baseUrl}/booking/${bookingId}`,

            headers: {
              Cookie: `token=${token}`,
              'Content-Type': 'application/json'
            },

            body: updatedBooking

          }).then((updateResponse) => {

            // Logs UPDATE
            cy.log('RESERVA ATUALIZADA')
            cy.log(`Status Update: ${updateResponse.status}`)
            cy.log(`Reserva atualizada: ${bookingId}`)
            cy.log(`Tempo Update: ${updateResponse.duration}ms`)

            console.log('UPDATE REQUEST:', updatedBooking)

            console.log('UPDATE RESPONSE:', {
              status: updateResponse.status,
              duration: updateResponse.duration,
              headers: updateResponse.headers,
              body: updateResponse.body
            })

            // Validações
            expect(updateResponse.status).to.eq(200)

            expect(updateResponse.body).to.include({
              firstname: updatedBooking.firstname,
              lastname: updatedBooking.lastname,
              totalprice: updatedBooking.totalprice,
              depositpaid: updatedBooking.depositpaid,
              additionalneeds: updatedBooking.additionalneeds
            })

            expect(updateResponse.body.bookingdates)
              .to.deep.equal(updatedBooking.bookingdates)
          })
        })
      })
    })
  })

  // =========================================
  // Atualização Parcial
  // =========================================

  it('Deve atualizar parcialmente uma reserva', () => {

    cy.fixture('booking').then((booking) => {

      // Cria reserva
      cy.request({
        method: 'POST',
        url: `${baseUrl}/booking`,
        body: booking

      }).then((createResponse) => {

        expect(createResponse.status).to.eq(200)

        const bookingId = createResponse.body.bookingid

        // Logs CREATE
        cy.log('=== RESERVA CRIADA ===')
        cy.log(`Booking ID: ${bookingId}`)

        console.log('CREATE RESPONSE:', createResponse.body)

        // Busca token
        cy.getToken().then((token) => {

          cy.log('=== AUTENTICAÇÃO ===')

          // Payload parcial
          const partialPayload = {
            firstname: 'Partial QA'
          }

          // PATCH
          cy.request({
            method: 'PATCH',
            url: `${baseUrl}/booking/${bookingId}`,

            headers: {
              Cookie: `token=${token}`,
              'Content-Type': 'application/json'
            },

            body: partialPayload

          }).then((patchResponse) => {

            // Logs PATCH
            cy.log('PATCH REALIZADO')
            cy.log(`Status PATCH: ${patchResponse.status}`)
            cy.log(`Reserva alterada: ${bookingId}`)

            console.log('PATCH REQUEST:', partialPayload)

            console.log('PATCH RESPONSE:', {
              status: patchResponse.status,
              duration: patchResponse.duration,
              headers: patchResponse.headers,
              body: patchResponse.body
            })

            // Validações PATCH
            expect(patchResponse.status).to.eq(200)

            // Campo alterado
            expect(patchResponse.body.firstname)
              .to.eq(partialPayload.firstname)

            // Campos preservados
            expect(patchResponse.body.lastname)
              .to.eq(booking.lastname)

            expect(patchResponse.body.totalprice)
              .to.eq(booking.totalprice)

            expect(patchResponse.body.depositpaid)
              .to.eq(booking.depositpaid)

            expect(patchResponse.body.bookingdates)
              .to.deep.equal(booking.bookingdates)
          })
        })
      })
    })
  })

  // =========================================
  // Delete
  // =========================================

  it('Deve deletar uma reserva', () => {

    cy.fixture('booking').then((booking) => {

      // Cria reserva
      cy.request({
        method: 'POST',
        url: `${baseUrl}/booking`,
        body: booking

      }).then((createResponse) => {

        expect(createResponse.status).to.eq(200)

        const bookingId = createResponse.body.bookingid

        // Logs CREATE
        cy.log('=== RESERVA CRIADA ===')
        cy.log(`Status Create: ${createResponse.status}`)
        cy.log(`Booking ID: ${bookingId}`)
        cy.log(`Cliente: ${booking.firstname} ${booking.lastname}`)
        cy.log(`Tempo Create: ${createResponse.duration}ms`)

        console.log('CREATE REQUEST:', booking)

        console.log('CREATE RESPONSE:', {
          status: createResponse.status,
          duration: createResponse.duration,
          headers: createResponse.headers,
          body: createResponse.body
        })

        // Busca token
        cy.getToken().then((token) => {

          cy.log('=== AUTENTICAÇÃO ===')
          cy.log(`Token gerado: ${token.substring(0, 8)}...`)

          console.log('TOKEN:', token)

          // Deleta reserva criada
          cy.request({
            method: 'DELETE',
            url: `${baseUrl}/booking/${bookingId}`,

            headers: {
              Cookie: `token=${token}`,
              'Content-Type': 'application/json'
            }

          }).then((deleteResponse) => {

            // Logs DELETE
            cy.log('=== RESERVA DELETADA ===')
            cy.log(`Status Delete: ${deleteResponse.status}`)
            cy.log(`Reserva deletada: ${bookingId}`)
            cy.log(`Tempo Delete: ${deleteResponse.duration}ms`)

            console.log('DELETE RESPONSE:', {
              status: deleteResponse.status,
              duration: deleteResponse.duration,
              headers: deleteResponse.headers,
              body: deleteResponse.body
            })

            // Validação DELETE
            expect(deleteResponse.status).to.eq(201)

            // Valida que reserva não existe mais
            cy.request({
              method: 'GET',
              url: `${baseUrl}/booking/${bookingId}`,
              failOnStatusCode: false

            }).then((getResponse) => {

              cy.log('VALIDAÇÃO DELETE')
              cy.log(`Status pós-delete: ${getResponse.status}`)

              console.log('POST DELETE VALIDATION:', {
                status: getResponse.status,
                body: getResponse.body
              })

              expect(getResponse.status).to.eq(404)
            })
          })
        })
      })
    })
  })
})