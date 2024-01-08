describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'root',
      username: 'root',
      password: 'root'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function(){
    it('succeeds with correct credentials', function(){
      cy.get('#username').type('root')
      cy.get('#password').type('root')
      cy.get('#login-button').click()

      cy.contains('root logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'root logged in')
      cy.contains('root logged in').should('not.exist')
    })
  })
  describe('When logged in', function(){
    beforeEach(function(){
      // login the user
      cy.login({ username: 'root', password: 'root' })
    })

    it('A blog can be created', function(){
      cy.contains('create new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('http://cypress.com')
      cy.get('#create-button').click()

      cy.contains('a blog created by cypress')
    })

    it('user can like a blog', function(){
      cy.contains('create new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('http://cypress.com')
      cy.get('#create-button').click()
      cy.contains('view').click()

      cy.contains('like').click()
    })

    it('the user who created the blog can delete it', function(){
      cy.createBlog({
        title: 'a blog created by cypress',
        author: 'cypress',
        url: 'http://cypress.com'
      })
      cy.contains('view').click()
      cy.contains('Remove').click()
    })

    it('blogs are ordered according to likes', function(){
      cy.createBlog({
        title: 'a blog created by cypress',
        author: 'cypress',
        url: 'http://cypress.com',
        likes: 10
      })

      cy.createBlog({
        title: 'another blog created by cypress',
        author: 'cypress',
        url: 'http://cypress.com',
      })

      cy.get('.blog').eq(0).should('contain', 'a blog created by cypress')
      cy.get('.blog').eq(1).should('contain', 'another blog created by cypress')
    })
  })
})