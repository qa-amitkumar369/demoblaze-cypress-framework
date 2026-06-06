import HomePage from '../pages/homePage';
import SignupPage from '../pages/signupPage';
import LoginPage from '../pages/loginPage';
import CartPage from '../pages/cartPage';

const homePage = new HomePage();
const signupPage = new SignupPage();
const loginPage = new LoginPage();
const cartPage = new CartPage();

Cypress.Commands.add('visitHome', () => {
  cy.visit('/');
  homePage.verifyHomeLoaded();
});

Cypress.Commands.add('stubAlertBeforeLoad', () => {
  cy.on('window:before:load', (win) => {
    if (win.alert && win.alert.isSinonProxy) {
      console.log('Alert already stubbed');
    } else {
      cy.stub(win, 'alert').as('alertStub');
    }
  });
});

Cypress.Commands.add('validateAlert', (expectedText) => {
  cy.get('@alertStub').should('have.been.calledOnce');
  cy.get('@alertStub').should('have.been.calledWith', expectedText);
});

Cypress.Commands.add('signupUser', (username, password, expectedAlert = 'Sign up successful.') => {
  cy.stubAlertBeforeLoad();
  cy.visitHome();
  cy.loginAndSignupApiInterception();
  homePage.openSignupModal();
  signupPage.verifyVisible();
  signupPage.signup(username, password);
  cy.waitForSignupApi().its('response.statusCode').should('eq', 200);
  cy.validateAlert(expectedAlert);
  if (expectedAlert === 'Sign up successful.') {
    signupPage.verifyClosed();
  }
});

Cypress.Commands.add('loginUser', (username, password, expectedAlert = null) => {
  cy.stubAlertBeforeLoad();
  cy.visitHome();
  cy.loginAndSignupApiInterception();
  homePage.openLoginModal();
  loginPage.verifyVisible();
  if (expectedAlert) {
    loginPage.login(username, password);
    cy.validateAlert(expectedAlert);
    return;
  }

  loginPage.login(username, password);
  cy.waitForLoginApi().its('response.statusCode').should('eq', 200);
  homePage.verifyLoggedInUser(username);
});

Cypress.Commands.add('logoutUser', () => {
  homePage.clickLogout();
  homePage.verifyLoggedOutState();
});

Cypress.Commands.add('clearCart', () => {
  cy.visit('/cart.html');
  cartPage.waitForCartPage();

  const deleteUntilEmpty = () => {
    cy.get('body').then(($body) => {
      const deleteLinks = $body.find('#tbodyid .success td a');
      if (deleteLinks.length) {
        cy.wrap(deleteLinks[0]).click();
        deleteUntilEmpty();
      }
    });
  };

  deleteUntilEmpty();
  cartPage.verifyCartTableRendered();
});

Cypress.Commands.add('getNotebookCatalog', () => {
  return cy
    .request('GET', `${Cypress.env('apiBaseUrl')}/entries`)
    .its('body.Items')
    .then((items) => items.filter((item) => item.cat === 'notebook'));
});

Cypress.Commands.add('setupLaptopApiInterceptions', () => {
  cy.intercept('POST', '**/bycat').as('getLaptopCategory');
  cy.intercept('POST', '**/pagination').as('getLaptopPagination');
});

Cypress.Commands.add('waitForLaptopCategoryResponse', () => {
  return cy.wait('@getLaptopCategory');
});

Cypress.Commands.add('waitForLaptopPaginationResponse', () => {
  return cy.wait('@getLaptopPagination').then(() => {
    return cy.get('@getLaptopPagination.all').then((interceptions) => {
      const latestCall = interceptions[interceptions.length - 1];
      return latestCall;
    });
  });
});

Cypress.Commands.add('cartApiInterceptions', () => {
  cy.intercept('POST', '**/addtocart').as('addToCartApi');
  cy.intercept('POST', '**/view').as('viewCartItemApi');
});

Cypress.Commands.add('waitForAddToCartApi', () => {
  return cy.wait('@addToCartApi');
});

Cypress.Commands.add('waitForviewCartItemApi', () => {
  return cy.wait('@viewCartItemApi');
});

Cypress.Commands.add('loginAndSignupApiInterception', () => {
  cy.intercept('POST', '**/login').as('checkLoginApi');
  cy.intercept('POST', '**/signup').as('checkSignupApi');
});

Cypress.Commands.add('waitForLoginApi', () => {
  return cy.wait('@checkLoginApi', { timeout: 200000 });
});

Cypress.Commands.add('waitForSignupApi', () => {
  return cy.wait('@checkSignupApi', { timeout: 200000 });
});
