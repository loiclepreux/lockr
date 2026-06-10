/// <reference types="cypress" />

describe("Documents", () => {
    beforeEach(() => {
        cy.visit("/signin");
        cy.login();
        cy.visit("/documents");
    });

    it("debug route documents", () => {
        cy.visit("/documents");

        cy.url({ timeout: 10000 }).then((url) => {
            cy.log(url);
        });

        cy.get("body").then(($body) => {
            cy.log($body.text());
        });
    });
});
