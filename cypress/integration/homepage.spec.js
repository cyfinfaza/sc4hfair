describe('Test the functionality of the homepage', () => {
	beforeEach(() => {
		cy.visit("/")
	})
	it('should have at least one post', () => {
		cy.get('.post-module--container--3Yzfd')
	});
	it('should open the menu when the more button is clicked', () => {
		cy.get('.horizPanel > :nth-child(3)').click()
	});
})
