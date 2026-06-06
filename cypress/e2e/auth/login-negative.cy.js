import { generateDynamicUser } from '../../support/utils';

describe('Validate negative login scenarios', () => {
    const user = generateDynamicUser('neglogin');

    before(() => {
        cy.signupUser(user.username, user.password, 'Sign up successful.');
    });

    it('shows an error when username is not provided', () => {
        cy.loginUser(' ', user.password, 'Wrong password.');
    });

    it('shows an error for invalid credentials', () => {
        cy.loginUser('invalid_user_12345', 'InvalidPass!123', 'User does not exist.');
    });

    it('shows an error when correct username is used with wrong password', () => {
        cy.loginUser(user.username, 'WrongPassword123!', 'Wrong password.');
    });
});
