describe('Matching game', () => {
    beforeEach(() => {
        cy.session('guest-session-matching', () => {
            cy.loginAsGuest();
        });
        cy.visit('/section-select');
        cy.contains('h1', 'Roghnaigh modúl');
        cy.get('[data-testid="section-1"]').find('[data-testid="matching"]').click();
    });

    it('shows matching grid for section 1', () => {
        cy.get('[data-testid="active-matching-section"]', { timeout: 15000 }).should('be.visible');
        cy.get('[data-testid="english-col"]').find('[data-testid="term-card"]').should('have.length.at.least', 1);
    });
});
