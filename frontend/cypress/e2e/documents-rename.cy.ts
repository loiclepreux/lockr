/// <reference types="cypress" />

describe("Documents Rename", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/documents");
    });

    it("should upload then rename a document", () => {
        cy.intercept("POST", "http://localhost:3000/documents").as(
            "uploadDocument",
        );

        const originalName = `rename-test-${Date.now()}.pdf`;
        const newName = `renamed-${Date.now()}.pdf`;

        cy.get('[data-cy="open-upload-modal"]', { timeout: 10000 }).click();

        cy.get('[data-cy="upload-file"]').selectFile(
            {
                contents: "cypress/fixtures/test.pdf",
                fileName: originalName,
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
                    method: "PATCH",
                    url: `http://localhost:3000/documents/${documentId}`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: {
                        name: newName,
                    },
                }).then((renameResponse) => {
                    expect(renameResponse.status).to.be.oneOf([200, 201]);
                    expect(renameResponse.body.name).to.eq(newName);
                });
            });
        });
    });
});
