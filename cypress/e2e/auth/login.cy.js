import { generateDynamicUser } from '../../support/utils';
import HomePage from '../../pages/homePage';

const homePage = new HomePage();

describe('Validate user signup and login with valid account', () => {
    const user = generateDynamicUser('loginuser');

    before(() => {
        cy.signupUser(user.username, user.password, 'Sign up successful.');
    });

    it('logs in successfully, shows welcome banner, then logs out to home page', () => {
        cy.loginUser(user.username, user.password);
        cy.logoutUser();
        homePage.verifyLoggedOutState();
    });
});
