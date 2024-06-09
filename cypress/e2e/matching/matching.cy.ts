describe('Multiple Choice Quiz', () => {

    beforeEach(() => {
        cy.visit('/section-select');
        cy.contains('h1', 'Roghnaigh modúl');
        cy.get('[data-testid="section-1"]').find('[data-testid="quiz"]').click();

        cy.get('[data-testid="question-view"]').should('be.visible');
    });

});