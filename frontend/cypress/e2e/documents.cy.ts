/// <reference types="cypress" />

describe("Documents", () => {
    beforeEach(() => {
        cy.visit("/signin");
        cy.login();
        cy.visit("/documents");
    });

    it("should upload a document", () => {
        cy.intercept("POST", "http://localhost:3000/documents").as(
            "uploadDocument",
        );

        cy.contains("Mes", { timeout: 10000 }).should("exist");
        cy.contains("documents").should("exist");

        cy.get('[data-cy="open-upload-modal"]', { timeout: 10000 })
            .should("exist")
            .click();

        cy.get('[data-cy="upload-file"]').selectFile(
            "cypress/fixtures/test.pdf",
            { force: true },
        );

        cy.get('[data-cy="upload-doctype"]').type("Facture");
        cy.get('[data-cy="upload-priority"]').select("Moyenne");
        cy.get('[data-cy="upload-submit"]').click();

        cy.wait("@uploadDocument").then((interception) => {
            expect(interception.response?.statusCode).to.eq(201);
            expect(interception.response?.body?.name).to.eq("test.pdf");
        });

    });
});
