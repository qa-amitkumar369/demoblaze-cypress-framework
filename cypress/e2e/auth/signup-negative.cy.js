import { generateDynamicUser } from '../../support/utils';

describe('Validate signup with existing user', () => {
    const user = generateDynamicUser('existinguser');

    before(() => {
        cy.signupUser(user.username, user.password, 'Sign up successful.');
    });

    it('shows validation error when trying to register the same username again', () => {
        cy.signupUser(user.username, user.password, 'This user already exist.');
    });
});

