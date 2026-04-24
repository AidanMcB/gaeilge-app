describe('Auth and guest', () => {
    it('opens documentation from login screen', () => {
        cy.visit("/login");
        cy.get('[data-testid="login-link-docs"]').click();
        cy.url().should("include", "/docs/overview");
        cy.get('[data-testid="docs-root"]').should("be.visible");
    });

    it('continues as guest and reaches home', () => {
        cy.loginAsGuest();
        cy.contains("Cleachtadh").should("exist");
    });
});
