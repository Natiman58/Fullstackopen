
describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'root-2',
      username: 'root-2',
      password: 'root-2'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })

  it('user can login', function() {
    cy.contains('login').click()
    cy.get('#username').type('root-2')
    cy.get('#password').type('root-2')
    cy.get('#login-button').click()
    cy.contains('root-2 logged in')
  })

  describe('when logged in', function() {
    beforeEach(function(){
      /*cy.contains('login').click()
      cy.get('#username').type('root-2')
      cy.get('#password').type('root-2')
      cy.get('#login-button').click()
      cy.contains('root-2 logged in')*/
      cy.login({ username: 'root-2', password: 'root-2' })
      })

    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('#noteInput').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function(){
      beforeEach(function(){
        /*
        cy.contains('new note').click()
        cy.get('input').type('another note cypress')
        cy.contains('save').click()*/
        cy.createNote({
          content: 'another note cypress',
          important: true
        })
      })
      it('it can be made important', function(){
        cy.contains('another note cypress').contains('make not important').click()
        cy.contains('show all').click()
        cy.contains('another note cypress').contains('make important')
      })
    })

    describe('and several notes exist', function () {
      beforeEach(function () {
        cy.login({ username: 'root-2', password: 'root-2' })
        //cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        //cy.createNote({ content: 'third note', important: false })
      })

      it('one of those can be made important', function () {
        // works withot the span div
        cy.contains('show all').click()
        /*
        cy.contains('second note').contains('make important').click()
        cy.contains('second note').contains('make not important')
        */
        cy.contains('second note').parent().find('button').as('theButton')
        cy.get('@theButton').click({ multiple: true })
        cy.get('@theButton').should('contain', 'make not important')
      })
    })
  })

  it('login fails with wrong password', function(){
    cy.contains('login').click()
    cy.get('#username').type('root-2')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()
    cy.contains('Wrong credentials')
    cy.get('.error').contains('Wrong credentials')
    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'root-2 logged in')
    cy.contains('root-2 logged in').should('not.exist')
  })
})