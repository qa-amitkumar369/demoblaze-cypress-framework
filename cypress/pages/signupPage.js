class SignupPage {
    selectors = {
        modal: '#signInModal',
        username: '#sign-username',
        password: '#sign-password',
        signupButton: '#signInModal .btn-primary',
    };

    verifyVisible() {
        cy.get(this.selectors.modal).should('be.visible');
        cy.get(this.selectors.username).should('be.visible');
    }

    signup(username, password) {
        cy.get(this.selectors.username).clear().type(username );
        cy.get(this.selectors.password).clear().type(password);
        cy.get(this.selectors.signupButton).click();
    }

    verifyClosed() {
        cy.get(this.selectors.modal).should('not.be.visible');
    }
}

export default SignupPage;
