describe('Test the functionality of the homepage', () => {
	beforeEach(() => {
		cy.visit('/')
	})

	it('should have at least one post', () => {
		cy.get('[class^="post-module--container--"]')
	})

	it('should open the menu when the more button is clicked', () => {
		cy.get('.horizPanel > :nth-child(3)').click()
		cy.get('[class^="header-module--visible--"]').should('be.visible')
	})

	it('should change themes', () => {
		cy.get('body').then($body => {
			const startedDark = $body.hasClass('theme-dark')

			cy.get('[class^="header-module--menuButton--"]', { timeout: 10000 }).click()
			cy.get('[class^="themepicker-module--themepickerContainer--"]', { timeout: 6000 }).click()
			
			cy.get('body').should('have.class', startedDark ? 'theme-light' : 'theme-dark', { timeout: 6000 })
		})
	})
})
