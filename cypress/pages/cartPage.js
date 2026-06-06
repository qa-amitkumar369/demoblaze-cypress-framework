import HomePage from "./homePage";
const homePage = new HomePage();

class CartPage {
    selectors = {
        tableBody: '#tbodyid',
        rows: '#tbodyid .success',
        totalLabel: '#totalp',
        placeOrderButton: 'button.btn-success',
        orderModal: '#orderModal',
        name: '#name',
        country: '#country',
        city: '#city',
        card: '#card',
        month: '#month',
        year: '#year',
        purchaseButton: '#orderModal .btn-primary',
        confirmationPopup: '.sweet-alert.showSweetAlert.visible',
        confirmationTitle: '.sweet-alert.showSweetAlert.visible h2',
        confirmationText: '.sweet-alert.showSweetAlert.visible p',
        confirmOkButton: '.sweet-alert.showSweetAlert.visible .confirm',
    };

    waitForCartPage() {
        cy.url().should('include', '/cart.html');
    }

    verifyCartTableRendered() {
        cy.get(this.selectors.tableBody).should('exist');
    }

    getRows() {
        return cy.get(this.selectors.rows);
    }

    verifyProductInCart(productName, productPrice) {
        this.getRows().should('have.length.at.least', 1);
        cy.get(this.selectors.tableBody).within(() => {
            cy.contains('td', productName).should('be.visible');
            cy.contains('td', String(productPrice)).should('be.visible');
        });
    }

    verifyTotal(expectedTotal) {
        cy.get(this.selectors.totalLabel, { timeout: 15000 })
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                expect(Number(text.trim())).to.eq(Number(expectedTotal));
            });
    }

    openPlaceOrder() {
        cy.get(this.selectors.placeOrderButton).should('be.visible').click();
        cy.get(this.selectors.orderModal).should('be.visible');
    }

    verifyPlaceOrderDisabled() {
        cy.get(this.selectors.placeOrderButton).should('be.disabled');
    }

    fillOrderForm(orderDetails) {
        cy.get(this.selectors.name).clear().type(orderDetails.name, { delay: 0 });
        cy.get(this.selectors.country).clear().type(orderDetails.country, { delay: 0 });
        cy.get(this.selectors.city).clear().type(orderDetails.city, { delay: 0 });
        cy.get(this.selectors.card).clear().type(orderDetails.card, { delay: 0 });
        cy.get(this.selectors.month).clear().type(orderDetails.month, { delay: 0 });
        cy.get(this.selectors.year).clear().type(orderDetails.year, { delay: 0 });
    }

    submitPurchase() {
        cy.get(this.selectors.purchaseButton).should('be.visible').click();
    }

    verifyConfirmationVisible() {
        cy.get(this.selectors.confirmationPopup, { timeout: 15000 }).should('be.visible');
        cy.get(this.selectors.confirmationTitle).should('contain', 'Thank you for your purchase!');
    }

    getConfirmationText() {
        return cy.get(this.selectors.confirmationText).invoke('text');
    }

    clickConfirmationOk() {
        cy.get(this.selectors.confirmOkButton).should('be.visible').click();
        homePage.waitForHomePage();
        cy.get(this.selectors.confirmationPopup).should('not.exist');
    }
}

export default CartPage;
