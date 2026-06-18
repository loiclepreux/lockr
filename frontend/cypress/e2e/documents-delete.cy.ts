/// <reference types="cypress" />

describe("Documents Delete", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/documents");
    });

    it("should upload then delete a document", () => {
        cy.intercept("POST", "http://localhost:3000/documents").as(
            "uploadDocument",
        );

        const documentName = `delete-test-${Date.now()}.pdf`;

        cy.get('[data-cy="open-upload-modal"]', { timeout: 10000 }).click();

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
                    method: "DELETE",
                    url: `http://localhost:3000/documents/${documentId}`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }).then((deleteResponse) => {
                    expect(deleteResponse.status).to.be.oneOf([200, 204]);
                    expect(deleteResponse.body.id).to.eq(documentId);
                    expect(deleteResponse.body.deletedAt).to.not.equal(null);
                    expect(deleteResponse.body.status).to.eq("DELETED");
                });
            });
        });
    });
});
