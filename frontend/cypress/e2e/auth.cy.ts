/// <reference types="cypress" />

describe("Authentication", () => {
    beforeEach(() => {
        cy.visit("/signin");
    });

    it("should login successfully", () => {
        cy.intercept("POST", "**/auth/signin").as("signin");
        cy.intercept("GET", "**/auth/me").as("me");
        cy.intercept("GET", "**/user/me").as("userMe");

        cy.get('[data-cy="login-email"]').type("lepreux.loic@bbox.fr");
        cy.get('[data-cy="login-password"]').type("Loic1983.");
        cy.get('[data-cy="login-submit"]').click();

        cy.wait("@signin").then((interception) => {
            cy.log(`SIGNIN STATUS: ${interception.response?.statusCode}`);
            cy.log(JSON.stringify(interception.response?.body));
        });

        cy.wait(3000);

        cy.url().then((url) => {
            cy.log(`CURRENT URL: ${url}`);
        });
    });

    it("should refuse invalid credentials", () => {
        cy.on("window:alert", (text) => {
            expect(text).to.contain("Identifiants");
        });

        cy.get('[data-cy="login-email"]').type("lepreux.loic@bbox.fr");
        cy.get('[data-cy="login-password"]').type("MauvaisPassword");
        cy.get('[data-cy="login-submit"]').click();
    });
});
