describe("Notecards", () => {
    beforeEach(() => {
        cy.session("guest-session-notecards", () => {
            cy.loginAsGuest();
        });
    });

    it("loads notecards view as guest", () => {
        cy.visit("/notecards");
        cy.get('[data-testid="notecards-page"]').should("be.visible");
        cy.contains("Cárta Nótaí").should("exist");
    });
});
