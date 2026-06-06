class HomePage {
    selectors = {
        logo: '#nava',
        loginLink: '#login2',
        signupLink: '#signin2',
        logoutLink: '#logout2',
        welcomeUser: '#nameofuser',
        cartLink: '#cartur',
        categoryLink: '.list-group a',
        productCards: '#tbodyid .card',
        productTitles: '#tbodyid .card-title a',
        nextButton: '#next2',
        previousButton: '#prev2',
    };

    waitForHomePage() {
        cy.url().should('include', '/index.html');
        this.verifyHomeLoaded();
    }

    verifyHomeLoaded() {
        cy.get(this.selectors.logo).should('be.visible').and('contain', 'PRODUCT STORE');
    }

    openLoginModal() {
        cy.get(this.selectors.loginLink).should('be.visible').click();
    }

    openSignupModal() {
        cy.get(this.selectors.signupLink).should('be.visible').click();
    }

    clickLogout() {
        cy.get(this.selectors.logoutLink).should('be.visible').click();
    }

    verifyLoggedInUser(username) {
        cy.get(this.selectors.welcomeUser, { timeout: 15000 })
            .should('be.visible')
            .and('contain', `Welcome ${username}`);
        cy.get(this.selectors.loginLink).should('not.be.visible');
        cy.get(this.selectors.logoutLink).should('be.visible').and('contain', 'Log out');
    }

    verifyLoggedOutState() {
        cy.url().should('include', '/index.html');
        cy.get(this.selectors.signupLink).should('be.visible').and('contain', 'Sign up');
        cy.get(this.selectors.welcomeUser).should('not.be.visible');
        cy.get(this.selectors.loginLink).should('be.visible').and('contain', 'Log in');
    }

    selectCategory(categoryName) {
        cy.contains(this.selectors.categoryLink, categoryName, { timeout: 10000 }).should('be.visible').click();
    }

    openProductByIndex(index = 0) {
        cy.get(this.selectors.productTitles).eq(index).should('be.visible').click({ force: true });
    }

    captureVisibleProductCards() {
        return cy.get(this.selectors.productCards).should('have.length.greaterThan', 0);
    }

    getVisibleProductNames() {
        return cy.get(this.selectors.productTitles).then(($items) =>
            [...$items].map((item) => item.innerText.trim())
        );
    }

    clickNextPageIfVisible() {
        cy.get('body').then(($body) => {
            if ($body.find(this.selectors.nextButton).length) {
                cy.get(this.selectors.nextButton).click();
            }
        });
    }

    clickPreviousPageIfVisible() {
        cy.get('body').then(($body) => {
            if ($body.find(this.selectors.previousButton).length) {
                cy.get(this.selectors.previousButton).click();
            }
        });
    }

    goToCart() {
        cy.get(this.selectors.cartLink).should('be.visible').click();
    }
}

export default HomePage;
