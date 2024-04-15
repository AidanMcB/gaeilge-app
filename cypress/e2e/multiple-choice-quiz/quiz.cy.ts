// https://on.cypress.io/api

describe('Multiple Choice Quiz', () => {

    it('Take Section 1 quiz', () => {
        cy.visit('/section-select');
        cy.contains('h1', 'Choose a section');
        cy.get('[data-testid="section-1"]').find('[data-testid="quiz"]').click();
        // Assuming each quiz has 10 questions
        for (let i = 0; i < 10; i++) {
            // select random answer and submit
            cy.get('[data-testid="radio-option-1"]').click();
            cy.get('[data-testid="submit-btn"]').click();
            // go to next questions
            cy.get('[data-testid="next-or-see-answer-btn"]').click()
        }

    });

    // it('First quiz questions should be loaded into view', () => {
    //     cy.get('[data-testid="question-view"]')
    // });

});
  