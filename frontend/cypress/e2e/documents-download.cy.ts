/// <reference types="cypress" />

describe("Documents Download", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/documents");
    });

    it("should upload then download a document", () => {
        cy.intercept("POST", "http://localhost:3000/documents").as(
            "uploadDocument",
        );

        const documentName = `download-test-${Date.now()}.pdf`;

        cy.contains("Mes", { timeout: 10000 }).should("exist");
        cy.contains("documents").should("exist");

        cy.get('[data-cy="open-upload-modal"]', { timeout: 10000 })
            .should("exist")
            .click();

        cy.get('[data-cy="upload-file"]').selectFile(
            {
                contents: "cypress/fixtures/test.pdf",
                fileName: documentName,
                mimeType: "application/pdf",
            },
            { force: true },
        );

        cy.get('[data-cy="upload-doctype"]').type("Facture");
        cy.get('[data-cy="upload-priority"]').select("Moyenne");
        cy.get('[data-cy="upload-submit"]').click();

        cy.wait("@uploadDocument").then((interception) => {
            expect(interception.response?.statusCode).to.eq(201);

            const documentId = interception.response?.body?.id;
            expect(documentId).to.be.a("string");

            cy.window().then((win) => {
                const auth = JSON.parse(
                    win.localStorage.getItem("auth-storage") || "{}",
                );

                const accessToken = auth.state.accessToken;

                cy.request({
                    method: "GET",
                    url: `http://localhost:3000/documents/${documentId}/download`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    encoding: "binary",
                }).then((downloadResponse) => {
                    expect(downloadResponse.status).to.eq(200);

                    expect(
                        downloadResponse.headers["content-disposition"],
                    ).to.contain("attachment");
                });
            });
        });
    });
});
