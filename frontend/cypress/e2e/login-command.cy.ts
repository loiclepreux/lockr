/// <reference types="cypress" />

describe("Login Command", () => {
    it("should login with custom command", () => {
        cy.login();
    });
});
