/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        loginAsGuest(): Chainable<void>;
        passQuiz(sectionNum: number): Chainable<void>;
    }
}
