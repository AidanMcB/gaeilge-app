describe('In-app documentation', () => {
    it('renders docs overview without authentication', () => {
        cy.visit("/docs/overview");
        cy.get('[data-testid="docs-root"]').should("be.visible");
        cy.contains("Cleachtadh Gaeilge");
    });

    it('navigates between doc pages from sidebar', () => {
        cy.visit("/docs/overview");
        cy.get('[data-testid="docs-nav-architecture"]').click();
        cy.url().should("include", "/docs/architecture");
        cy.contains("High-level diagram");
    });

    it('renders on a narrow viewport', () => {
        cy.viewport(375, 812);
        cy.visit("/docs/overview");
        cy.get('[data-testid="docs-root"]').should("be.visible");
    });
});
