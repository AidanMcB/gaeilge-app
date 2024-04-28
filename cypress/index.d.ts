/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject = any> {
      passQuiz(sectionNum: number): Chainable<any>;
    }
}

declare namespace Cypress {
    interface Chainable<Subject = any> {
      passMatching(sectionNum: number): Chainable<any>;
    }
}
  