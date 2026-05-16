Cypress.Commands.add('getToken', () => {

  return cy.request({
    method: 'POST',
    url: 'https://restful-booker.herokuapp.com/auth',
    body: {
      username: 'admin',
      password: 'password123'
    }
  }).then((response) => {

    return response.body.token
  })
})