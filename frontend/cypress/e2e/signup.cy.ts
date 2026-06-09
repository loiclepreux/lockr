/// <reference types="cypress" />

describe("Signup", () => {
    beforeEach(() => {
        cy.visit("/signup");
    });

    it("should register successfully", () => {
        const email = `cypress-${Date.now()}@lockr.fr`;

        cy.intercept("POST", "**/auth/signup").as("signup");

        cy.get('input[role="Email"]').type(email);
        cy.get('input[role="FirsName"]').type("Tony");
        cy.get('input[role="LastName"]').type("Stark");
        cy.get('input[role="phone"]').type("0613132223");
        cy.get('input[role="adress"]').type("3 rue des Avengers");
        cy.get('input[role="password"]').type("Password123!");
        cy.get('input[role="confirmPassword"]').type("Password123!");

        cy.get('button[type="submit"]').click();

        cy.wait("@signup").then((interception) => {
            expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
            expect(interception.response?.body?.data?.email).to.eq(email);
        });
    });
});
