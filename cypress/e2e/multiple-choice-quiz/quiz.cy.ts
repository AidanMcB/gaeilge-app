// https://on.cypress.io/api

describe('Multiple Choice Quiz', () => {

    beforeEach(() => {
        cy.session('guest-session', () => {
            cy.loginAsGuest();
        });
        cy.visit('/section-select');
        cy.contains('h1', 'Roghnaigh modúl');
        cy.get('[data-testid="section-1"]').find('[data-testid="quiz"]').click();

        cy.get('[data-testid="question-view"]').should('be.visible');
    });

    it('Take Section 1 quiz and fail with 30%.', () => {
        cy.visit('/section-select');
        cy.contains('h1', 'Roghnaigh modúl');
        cy.get('[data-testid="section-1"]').find('[data-testid="quiz"]').click();
        // Assuming each quiz has 10 questions
        for (let i = 0; i < 10; i++) {
            // select random answer and submit
            cy.get('[data-testid="radio-option-1"]').click();
            cy.get('[data-testid="submit-btn"]').click();
            // go to next questions
            cy.get('[data-testid="next-or-see-answer-btn"]').click()
        }
        // After test completes
        cy.get('[data-testid="result-percentage"]').should('contain.text', '30%')
        cy.get('[data-testid="banner-message"]').should('not.exist');
    });

    it('Take Section 1 quiz and achieve a score of 100%. This should unlock section 2.', () => {
        cy.visit('/section-select');
        cy.contains('h1', 'Roghnaigh modúl');
        cy.passQuiz(1);
        // After test completes
        cy.get('[data-testid="result-percentage"]').should('contain.text', '100%')
        cy.get('[data-testid="banner-message"]').should('exist');

        cy.get('[data-testid="banner-message"]').find('.text-white > .font-bold').click();
        cy.get('[data-testid="section-2"]').find('[data-testid="quiz"]').should('not.be.disabled');
    });

    it('Pass all quizzes. Next section should be unlocked after each quiz.', () => {
        cy.visit('/section-select');
        cy.contains('h1', 'Roghnaigh modúl');

        for(let i = 1; i <= 5; i++) {
            cy.passQuiz(i);
            // After test completes
            cy.get('[data-testid="result-percentage"]').should('contain.text', '100%')
            cy.get('[data-testid="banner-message"]').should('exist');
    
            cy.get('[data-testid="banner-message"]').find('.text-white > .font-bold').click();
            cy.get(`[data-testid="section-${i + 1}"]`).find('[data-testid="quiz"]').should('not.be.disabled');
        }

    });

    it('Navigating to /results view before finishing a test will not show answers', () => {
        cy.visit('/section-select');
        cy.contains('h1', 'Roghnaigh modúl');
        cy.get('[data-testid="section-1"]').find('[data-testid="quiz"]').click();

        cy.get('[data-testid="question-view"]').should('be.visible');
        cy.visit('/quiz/section/1/results');
        
        cy.get('[data-testid="unfinished-quiz"]')
            .should('be.visible')
            .contains('You have not answered all 10 quiz questions!');
    });

});
  