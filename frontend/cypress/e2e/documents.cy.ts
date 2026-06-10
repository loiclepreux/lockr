/// <reference types="cypress" />

describe("Documents", () => {
    beforeEach(() => {
        cy.login();
    });

    it("should access documents page", () => {
        cy.visit("/documents");

        cy.url().should("include", "/documents");

        cy.contains("Mes").should("exist");
        cy.contains("documents").should("exist");
    });
});
