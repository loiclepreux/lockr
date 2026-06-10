/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            login(): Chainable<void>;
        }
    }
}

export {};
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
Cypress.Commands.add("login", () => {
    cy.request("POST", "http://localhost:3000/auth/signin", {
        email: "lepreux.loic@bbox.fr",
        password: "Loic1983.",
    }).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);

        const accessToken = response.body.data.accessToken;

        cy.request({
            method: "GET",
            url: "http://localhost:3000/user/me",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then((meResponse) => {
            expect(meResponse.status).to.eq(200);

            cy.window().then((win) => {
                win.localStorage.setItem(
                    "auth-storage",
                    JSON.stringify({
                        state: {
                            accessToken,
                            user: meResponse.body.data,
                        },
                        version: 0,
                    }),
                );
            });
        });
    });
});
