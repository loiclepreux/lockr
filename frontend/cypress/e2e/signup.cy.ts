/// <reference types="cypress" />

describe("should redirect to signin page", () => {
    beforeEach(() => {
        cy.visit("http://localhost:5173/signup");
    });

    it("s inscrire correctement", () => {
        cy.get('input[role="Email"]').type("tony10@gmail.com");
        cy.get('input[role="FirsName"]').type("tony");
        cy.get('input[role="LastName"]').type("stark");
        cy.get('input[role="phone"]').type("06.13.13.22.23");
        cy.get('input[role="adress"]').type("3 rue des avengers 92000 Ultron");
        cy.get('input[role="password"]').type("12345678");
        cy.get('input[role="confirmPassword"]').type("12345678");
    });
});
