# Demoblaze Cypress Automation Framework

This repository contains Cypress automation solution for the Demoblaze site. The focus is on the user journeys requested in the task: **signup**, **login**, **laptop purchase flow**, and a small set of negative and catalog validation scenarios.

## What was considered essential to test, and why

### Core scenario (spec file location- cypress\e2e\purchase\buy-laptop.cy.js)
The primary focus was on the end-to-end purchase journey, which represents the most critical functionality of the application:

1. Register a new user with dynamic credentials
2. Login with valid credentials
3. Buy a laptop and validate:
      - selected laptop name and price
      - cart item and total
      - order confirmation details

This flow ensures that all major components (authentication, product selection, cart, and checkout) work together correctly.

### Additional validations
4. Invalid login validation
5. Signup with an existing username
6. Validate login without username
7. Validate login with valid username and wrong password
8. Validate that products shown under category Laptops are laptop products on current and next page
9. Validate user remains within laptop category after using next and previous pagination
10. Validate Place Order button is disabled when cart is empty.
11. Validate purchase modal closes after confirmation, or if still present, purchase button is no longer enabled

These tests help verify- 
- correct error handling
- data consistency across UI pages
- proper navigation and state management
- edge cases users may encounter

Below are the spec files for additional validations:
- cypress\e2e\auth\login-negative.cy.js
- cypress\e2e\auth\login.cy.js
- cypress\e2e\auth\signup-negative.cy.js
- cypress\e2e\cart\cart-validations.cy.js
- cypress\e2e\catalog\laptops.cy.js

## Tech stack
- Cypress
- JavaScript
- Page Object Model (POM)
- Custom commands (`commands.js`)

## Project structure

```text
.
├── cypress.config.js
├── cypress
│   ├── e2e
│   │   ├── auth
│   │   ├── cart
│   │   ├── catalog
│   │   └── purchase
│   ├── fixtures
│   ├── pages
│   └── support
└── package.json
```

## Setup instructions

### Prerequisites
Please make sure these are installed before running the tests:
- [Node.js](https://nodejs.org/) version 18 or later
- npm (comes with Node.js)

### Install dependencies
```bash
npm install
```

## How to run the tests

### Open Cypress Test Runner (This will launch the Cypress Test Runner UI)
```bash
npm run cy:open
```
#### Steps after opening Cypress:

- Select E2E Testing when prompted
- Choose your preferred browser (e.g., Electron)
- You will see a list of spec files available in the project
- Click on any spec file (e.g., login.cy.js, laptops.cy.js)
- The selected test will start executing, and you can observe the test steps in real time

### Run the full test suite in headless mode
```bash
npm run cy:run
```
This command will do following: 

- Execute all test cases in headless mode
- Capture screenshots automatically for failed tests
- Generate a consolidated Mochawesome report after execution

Once the run is complete, you can view the HTML report here: cypress/reports/html/index.html

## How the tests were designed:

- Followed a Page Object Model (POM) structure to keep tests clean and maintainable
- Used Cypress best practices, avoiding hard waits and relying on built-in retries and assertions
- Used API interception (cy.intercept) to validate backend responses where UI validation alone was not reliable (especially for category and pagination checks)
- Ensured tests are stable in both open and headless modes
- Added reporting and screenshot capture to make debugging easier

Overall, the aim was to keep the tests:
- simple
- readable
- stable
- close to real user behavior

## AI usage disclosure
I used AI assistance during development for below:

- To improve and stabilize alert validation handling
- AI is used to explore alternative approaches, and finally I implemented stubbing which works consistently in both open(headed) and run (headless) mode.
