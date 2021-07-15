describe("A test for testing the testing software's test capability for testing software", () => {
	it('is sane', ()=>{
		cy.visit('/')
		expect(true).to.equal(true)
	})
	it('is not python', ()=>{
		expect([1, 2, 3]).not.to.equal([1, 2, 3])
	})
	it('fails', ()=>{
		expect(true).to.equal(false)
	})
})