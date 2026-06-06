class LoginPage {
    selectors = {
        modal: '#logInModal',
        username: '#loginusername',
        password: '#loginpassword',
        loginButton: '#logInModal .btn-primary',
    };

    verifyVisible() {
        cy.get(this.selectors.modal).should('be.visible');
        cy.get(this.selectors.username).should('be.visible');
    }

    login(username, password) {
        cy.get(this.selectors.username).clear().type(username);
        cy.get(this.selectors.password).clear().type(password);
        cy.get(this.selectors.loginButton).should('be.visible').click({force: true});
    }
}

export default LoginPage;
