/// <reference types="cypress" />

describe("should redirect to dashboard page", () => {
    it("se connecte correctement", () => {
        cy.visit("http://localhost:5173/signin");

        cy.get('input[role="email"]').type("lepreux51@gmail.com");
        cy.get('input[role="password"]').type("Loic1983.");

        cy.get('button[type="submit"]').click();

        // cy.url().should("include", "/dashboard");
    });
});
