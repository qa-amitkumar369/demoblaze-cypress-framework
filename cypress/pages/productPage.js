class ProductPage {
    selectors = {
        productName: '.name',
        productPrice: '.price-container',
        addToCartButton: '.btn.btn-success.btn-lg',
    };

    getProductName() {
        return cy.get(this.selectors.productName).should('be.visible').invoke('text').then((text) => text.trim());
    }

    getProductPrice() {
        return cy
            .get(this.selectors.productPrice)
            .should('be.visible')
            .invoke('text')
            .then((text) => Number(text.replace(/[^\d.]/g, '')));
    }

    addToCart(expectedAlert = 'Product added.') {
        cy.get(this.selectors.addToCartButton).should('be.visible').click();
        cy.validateAlert(expectedAlert);

    }
}

export default ProductPage;
