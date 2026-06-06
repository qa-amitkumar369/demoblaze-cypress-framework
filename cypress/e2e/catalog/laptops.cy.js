import HomePage from '../../pages/homePage';
import { generateDynamicUser } from '../../support/utils';

const homePage = new HomePage();

const validateLaptopApiResponse = (interception) => {
    expect(interception.request.method).to.eq('POST');
    expect(interception.response.statusCode).to.eq(200);

    const responseBody = interception.response?.body?.Items || []
    expect(
        responseBody,
        'Laptop category response should not be empty'
    ).to.be.an('array').and.not.be.empty;

    responseBody.forEach((item) => {
        expect(item, 'Each product should have category').to.have.property('cat');

        const normalizedCategory = String(item.cat).trim().toLowerCase();

        expect(
            ['notebook', 'laptop'],
            `Unexpected category found for product: ${item.title}`
        ).to.include(normalizedCategory);
    });
};

describe('Validate laptop category responses and pagination', () => {
    const user = generateDynamicUser('cataloguser');

    before(() => {
        cy.signupUser(user.username, user.password, 'Sign up successful.');
    });

    beforeEach(() => {
        cy.loginUser(user.username, user.password);
        cy.setupLaptopApiInterceptions();
    });

    it('validates all items returned for laptop category on current page and next page', () => {
        cy.visit("/index.html");
        homePage.selectCategory('Laptops');

        cy.waitForLaptopCategoryResponse().then(validateLaptopApiResponse);

        // Validate next page category response only if Next button is available
        cy.get('body').then(($body) => {
            const hasNext = $body.find('#next2:visible').length > 0;

            if (hasNext) {
                homePage.clickNextPageIfVisible();
                cy.waitForLaptopPaginationResponse().then(validateLaptopApiResponse);
            } else {
                cy.log('Next button is not available, skipping next page validation.');
            }
        });
    });

    it('validates user remains in laptop category after clicking next and previous pagination button', () => {
        cy.visitHome();
        homePage.selectCategory('Laptops');
        cy.waitForLaptopCategoryResponse().then(validateLaptopApiResponse);
        let movedToNextPage = false;

        cy.get('body').then(($body) => {
            const hasNext = $body.find('#next2:visible').length > 0;

            if (hasNext) {
                movedToNextPage = true;
                homePage.clickNextPageIfVisible();
            } else {
                cy.log('Next button is not available, skipping next page navigation.');
            }
        });

        cy.then(() => {
            cy.get('body').then(($body) => {
                const hasPrevious = $body.find('#prev2:visible').length > 0;

                if (hasPrevious) {
                    homePage.clickPreviousPageIfVisible();
                    cy.wait(2000);
                    cy.waitForLaptopPaginationResponse().then(validateLaptopApiResponse);
                } else if (movedToNextPage) {
                    throw new Error(
                        'Previous button should be available after navigating to next page.'
                    );
                } else {
                    cy.log('Previous button is not available, skipping previous page validation.');
                }
            });
        });
    });
});
