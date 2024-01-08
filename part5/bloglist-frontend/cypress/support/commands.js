// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', ({ username, password }) => {
    cy.request('POST', 'http://localhost:3003/api/login', {
        username, password
    }).then(({ body }) => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
        cy.visit('http://localhost:5173')
    })
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes }) => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedBlogappUser'))
    const token = loggedUser.token
    const encodedId = token.split('.')[1]
    const decodedToken = JSON.parse(atob(encodedId))
    const user = decodedToken.id

    cy.request({
        url: 'http://localhost:3003/api/blogs',
        method: 'POST',
        body: { title, author, url, user, likes },
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
        }
    })
    cy.visit('http://localhost:5173')
})