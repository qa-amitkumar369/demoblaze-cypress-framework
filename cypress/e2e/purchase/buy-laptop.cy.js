import HomePage from '../../pages/homePage';
import ProductPage from '../../pages/productPage';
import CartPage from '../../pages/cartPage';
import { generateDynamicUser, formatCurrentDate } from '../../support/utils';

const homePage = new HomePage();
const productPage = new ProductPage();
const cartPage = new CartPage();

describe('Validate laptop purchase flow', () => {
    const user = generateDynamicUser('buyer');
    let orderDetails;

    before(() => {
        cy.fixture('order').then((data) => {
            orderDetails = data;
        });
        cy.signupUser(user.username, user.password, 'Sign up successful.');
    });

    it('validate user is able to buys and submit purchase order for a laptop', () => {
        cy.loginUser(user.username, user.password);
        cy.clearCart();
        cy.cartApiInterceptions();
        cy.setupLaptopApiInterceptions();
        cy.visit('/index.html');
        homePage.verifyLoggedInUser(user.username);
        homePage.selectCategory('Laptops');
        cy.waitForLaptopCategoryResponse();
        homePage.captureVisibleProductCards();

        let selectedProduct = {};

        homePage.openProductByIndex(0);

        productPage.getProductName().then((name) => {
            productPage.getProductPrice().then((price) => {
                selectedProduct.name = name;
                selectedProduct.price = price;

                productPage.addToCart('Product added.');
                cy.waitForAddToCartApi();
                homePage.goToCart();
                cartPage.waitForCartPage();
                cy.waitForviewCartItemApi();
                cartPage.verifyProductInCart(name, price);
                cartPage.verifyTotal(price);
            });
        });

        cartPage.openPlaceOrder();
        cartPage.fillOrderForm(orderDetails);
        cartPage.submitPurchase();

        cartPage.verifyConfirmationVisible();

        cartPage.getConfirmationText().then((text) => {
            const normalizedText = text.replace(/\s+/g, ' ').trim();

            const id = normalizedText.match(/Id:\s*(\d+)/)?.[1];
            const amount = normalizedText.match(/Amount:\s*([\d.]+\s*USD)/)?.[1];
            const cardNumber = normalizedText.match(/Card Number:\s*(\d+)/)?.[1];
            const name = normalizedText.match(/Name:\s*(.*?)(?=Date:)/)?.[1]?.trim();
            const date = normalizedText.match(/Date:\s*(\d{1,2}\/\d{1,2}\/\d{4})/)?.[1];

            expect(id, 'Order id must be numeric').to.match(/^\d+$/);
            expect(amount, 'Amount must match selected product price').to.equal(`${selectedProduct.price} USD`);
            expect(cardNumber, 'Card number must match order form').to.equal(orderDetails.card);
            expect(name, 'Name must match order form').to.equal(orderDetails.name);
            expect(date, 'Date must be current date in m/d/yyyy format').to.equal(formatCurrentDate());
        });

        cartPage.clickConfirmationOk();
    });
});

