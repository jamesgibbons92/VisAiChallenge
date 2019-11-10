/// <reference types="Cypress" />

const loginForm = {
    unInput: "#username",
    pwInput: "#password",
    loginButton: "button#log-in",
    errorText: '.alert-warning'
}

context('Hackathon V1', () => {
    beforeEach(() => {
        cy.visit("https://demo.applitools.com/hackathon.html")
        cy.viewport(1800, 1000)
        cy.fixture('login').as('login')
    })
    describe('Login Page UI Elements Test', () => {
        it('page elements are present', () => {
            cy.get('.logo-w > a > img')
                .should('have.attr', 'src')
                .and('include', 'img/logo-big.png')
            cy.get('.auth-header')
                .should('contain.text', 'Login Form')
            cy.get(':nth-child(1) > label')
                .should('have.text', 'Username')
            cy.get(loginForm.unInput)
                .should('have.attr', 'placeholder')
                .and('include', 'Enter your username')
            cy.get('form > :nth-child(2) > label')
                .should('have.text', 'Password')
            cy.get(loginForm.pwInput)
                .should('have.attr', 'placeholder')
                .and('include', 'Enter your password')
            cy.get(loginForm.loginButton)
                .should('exist')
                .and('have.text', "Log In")
                .and('be.enabled')
            cy.get('.form-check-label')
                .should('not.be.checked')
            cy.get('[style="display: inline-block; margin-bottom:4px;"] > img')
                .should('have.attr', 'src')
                .and('contain', 'twitter')
            cy.get(':nth-child(2) > img').should('have.attr', 'src')
                .and('contain', 'facebook')
            cy.get(':nth-child(3) > img').should('have.attr', 'src')
                .and('contain', 'linkedin')
        })
    })

    const loginData = require('../fixtures/login')

    describe('Data-Driven Test - Login', () => {

        loginData.forEach(login => {
            it(`Login with username: \"${login.username}\" and password: \"${login.password}\".`, () => {
                // cypress won't allow calling .type() with an empty string.
                if (login.username != "") {
                    cy.get(loginForm.unInput)
                        .type('username')
                }
                if (login.password != "") {
                    cy.get(loginForm.pwInput)
                        .type('password')
                }
                cy.get(loginForm.loginButton)
                    .click()
                if (!login.isLoggedIn) {
                    //not logged in. so expected result is an error
                    cy.get(loginForm.errorText)
                        .should('exist')
                        .and('contain.text', login.errorMessage)
                } else {
                    cy.get('.top-menu-controls > .logged-user-w > .logged-user-i > .avatar-w > img')
                        .should('exist')
                }
            })
        })
    })


    describe('Table sort test', () => {
        beforeEach(() => {
            cy.get(loginForm.unInput)
                .type("Bruce")
            cy.get(loginForm.pwInput)
                .type("Wayne")
            cy.get(loginForm.loginButton)
                .click()
        })

        it('sorts by ascending order', () => {
            function amountToNumber(string) {
                //function to turn the amount value into a number for comparing.
                return parseFloat(string.trim().replace(/\s+|,|\s+|\w{3}$/g, ''))
            }
            //click amount header to sort by ascending
            cy.get('#amount').click()
            //  verify ascending
            let amountArray = []
            let amounts = cy.get('#transactionsTable tbody .text-right.bolder.nowrap')
                .each(function ($el, index, $list) {
                    //console.log($list[index])
                    if (index > 0) {
                        expect(amountToNumber($list[index].innerText)).to.be.greaterThan(amountToNumber(($list[index - 1]).innerText))
                    }
                })
        })
        it('table data is intact after sorting', () => {
            let initialTableState = []
            cy.get('#transactionsTable tbody tr')
                .each(function ($el, index, $list) {
                    //the initial table rows stored in an array. for comparing after sorting
                    initialTableState.push($list[index].innerText)
                })
            //sorted    
            cy.get('#amount').click()
            //verify data rows are intact after sorting, by comparing each row to the intial table rows.
            cy.get('#transactionsTable tbody tr')
                .each(function ($el, index, $list) {
                    expect($list[index].innerText).to.be.oneOf(initialTableState)
                })
        })
    })

    describe('Canvas chart test', () => {
        beforeEach(() => {
            cy.get(loginForm.unInput)
                .type("Bruce")
            cy.get(loginForm.pwInput)
                .type("Wayne")
            cy.get(loginForm.loginButton)
                .click()
            cy.get('#showExpensesChart').click()
        })
        it('chart data is correct', () => {
            // can't test this easily, as it's a canvas. would need to use image comparison
            cy.wait(500)
                // wait a bit for animation to complete
                .get('#canvas')
                .toMatchImageSnapshot()
        })
        it('adds next years data for comparison', () => {
            cy.get('#addDataset').click()
            // unable to test this. as there is no element on the page to indicate 2019 data. 
            // would need to be done via image comparison
        })

    })
    describe('Dynamic content test', () => {
        beforeEach(() => {
            cy.visit('https://demo.applitools.com/hackathon.html?showAd=true')
            cy.get(loginForm.unInput)
                .type("Bruce")
            cy.get(loginForm.pwInput)
                .type("Wayne")
            cy.get(loginForm.loginButton)
                .click()
        })

        it('displays both ads', () => {
            cy.get('#flashSale > img')
                .should('exist')
                .and('have.attr', 'src')
                .and('equal', 'img/flashSale.gif')
            cy.get('#flashSale2 > img')
                .should('exist')
                .and('have.attr', 'src')
                .and('equal', 'img/flashSale2.gif')

        })

    })
})