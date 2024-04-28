/// <reference types="cypress" />
///<reference path="../index.d.ts" />

import { getCorrectAnswer } from "./utils";

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("passQuiz", (sectionNum: number) => {
    cy.get(`[data-testid="section-${sectionNum}"]`).find('[data-testid="quiz"]').click();

    cy.get('[data-testid="question-view"]').should('be.visible');
    // Assuming each quiz has 10 questions
    for (let i = 0; i < 10; i++) {
        // get correct answer 
        cy.document().then((doc) => {

             const questionContainer = doc.querySelector('[data-testid="question-view"]');
             const questionId = questionContainer?.getAttribute('data-question-id');
                
            if (questionId) {
                const correctAnswer = getCorrectAnswer(sectionNum, parseInt(questionId));
                cy.get(`[data-cy="radio-option-${correctAnswer}"]`).click();
                cy.get('[data-testid="submit-btn"]').click();
                // go to next questions
                cy.get('[data-testid="next-or-see-answer-btn"]').click()
            }
        })
    }
});

export {
    
}
