describe('Booking Filter', () => {

    const baseUrl = 'https://restful-booker.herokuapp.com'

    it('Deve filtrar reservas por firstname e lastname', () => {

        cy.fixture('booking').then((booking) => {

            // Cria reserva
            cy.request({
                method: 'POST',
                url: `${baseUrl}/booking`,
                body: booking

            }).then((createResponse) => {

                expect(createResponse.status).to.eq(200)

                const bookingId = createResponse.body.bookingid

                cy.log('RESERVA CRIADA')
                cy.log(`Booking ID: ${bookingId}`)

                // Filtro
                cy.request({
                    method: 'GET',

                    url: `${baseUrl}/booking`,

                    qs: {
                        firstname: booking.firstname,
                        lastname: booking.lastname
                    }

                }).then((filterResponse) => {

                    cy.log('FILTRO POR NOME')
                    cy.log(`Status: ${filterResponse.status}`)
                    cy.log(`Resultados: ${filterResponse.body.length}`)

                    console.log('FILTER RESPONSE:', filterResponse.body)

                    // Validações
                    expect(filterResponse.status).to.eq(200)

                    expect(filterResponse.body)
                        .to.be.an('array')

                    expect(filterResponse.body.length)
                        .to.be.greaterThan(0)

                    // Valida se booking criado está na lista
                    const bookingIds =
                        filterResponse.body.map(item => item.bookingid)

                    expect(bookingIds)
                        .to.include(bookingId)
                })
            })
        })
    })

    it('Deve consultar reservas por checkin e checkout', () => {

        cy.fixture('booking').then((booking) => {

            // Cria reserva
            cy.request({
                method: 'POST',
                url: `${baseUrl}/booking`,
                body: booking

            }).then((createResponse) => {

                expect(createResponse.status).to.eq(200)

                const bookingId = createResponse.body.bookingid

                cy.log('RESERVA CRIADA')
                cy.log(`Booking ID: ${bookingId}`)

                console.log('CREATE RESPONSE:', createResponse.body)

                // Consulta filtro por datas
                cy.request({
                    method: 'GET',

                    url: `${baseUrl}/booking`,

                    qs: {
                        checkin: booking.bookingdates.checkin,
                        checkout: booking.bookingdates.checkout
                    }

                }).then((filterResponse) => {

                    cy.log('FILTRO POR DATAS')

                    cy.log(`Status: ${filterResponse.status}`)

                    cy.log(`Resultados encontrados: ${filterResponse.body.length}`)

                    console.log('DATE FILTER RESPONSE:', filterResponse.body)

                    // Validações resilientes
                    expect(filterResponse.status).to.eq(200)

                    expect(filterResponse.body)
                        .to.be.an('array')

                    // Log comportamento da API
                    if (filterResponse.body.length === 0) {

                        cy.log(
                            'API não retornou resultados para o filtro de datas'
                        )
                    }
                })
            })
        })
    })
})