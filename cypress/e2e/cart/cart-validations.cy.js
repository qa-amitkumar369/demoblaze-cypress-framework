import HomePage from '../../pages/homePage';
import ProductPage from '../../pages/productPage';
import CartPage from '../../pages/cartPage';
import { generateDynamicUser } from '../../support/utils';

const homePage = new HomePage();
const productPage = new ProductPage();
const cartPage = new CartPage();

describe('Validate cart and post purchase behaviour', () => {
    const user = generateDynamicUser('cartuser');
    let orderDetails;

    before(() => {
        cy.fixture('order').then((data) => {
            orderDetails = data;
        });
        cy.signupUser(user.username, user.password, 'Sign up successful.');
    });


    it('validate place order button is disabled on cart page without any product', () => {
        cy.visit('/cart.html');
        cartPage.waitForCartPage();
        cartPage.verifyPlaceOrderDisabled();
    });

    it('validate purchase modal closes after order confirmation and second purchase in same flow is not possible', () => {
        cy.setupLaptopApiInterceptions();
        cy.loginUser(user.username, user.password);
        cy.clearCart();
        cy.visit("/index.html");
        homePage.selectCategory('Laptops');
        cy.waitForLaptopCategoryResponse();
        homePage.openProductByIndex(0);
        productPage.addToCart('Product added.');

        homePage.goToCart();
        cartPage.waitForCartPage();
        cartPage.openPlaceOrder();
        cartPage.fillOrderForm(orderDetails);
        cartPage.submitPurchase();
        cartPage.verifyConfirmationVisible();

        cy.get('body').then(($body) => {
            const visibleOrderModal = $body.find('#orderModal:visible');
            if (visibleOrderModal.length) {
                cy.wrap(visibleOrderModal)
                    .find('.btn-primary')
                    .should('not.be.enabled');
            } else {
                cy.get('#orderModal').should('not.exist');
            }
        });

        cartPage.clickConfirmationOk();
    });
});
