# Workshop with Web UI 2025/07
* Code Generated from [Lovable](https://lovable.dev) 
    * Vite
    * TypeScript
    * React
    * shadcn-ui
    * Tailwind CSS

## 1. Install and start project

### 1.1 Build and Run
```
$npm install

# Start with development mode
$npm run dev
```

Open URL in browser
* http://localhost:8080/
  * Create data in local storage
    * key=token
    * value=token

Build to production
```
$npm run build
```

### 1.2 Build and run with Docker
```
$docker compose build web_ui
$docker compose up -d web_ui
$docker compose ps
```

Open URL in browser
* http://localhost:9000/
  * Create data in local storage
    * key=token
    * value=token


## 2. User Interface Testing
* Test streategies for Web UI ?
  * End-to-End testing
  * Component testing
  * Contract testing
* How to manage dependencies ?
  * External REST API
  * Data in browser ?
    * Local storage
    * Session storage
    * Cookies
* Techniques
  * Web element or Locator strategies
  * Page Object pattern  
* Tools
  * [Robotframework](https://robotframework.org/) and [SeleniumLibrary](https://github.com/robotframework/SeleniumLibrary/)
  * [Playwright](https://playwright.dev/)
    * [Visual testing](https://playwright.dev/docs/test-snapshots)

### 2.1 Locator strategies
* [Playwright best pratices](https://playwright.dev/docs/best-practices)

### 2.2 UI Testing with Playwright

Create playwright project
```
$cd web
$npm init playwright@latest ui-test
$cd ui-test
```

### Configuration of playwright in file `playwright.config.ts`
* Configure projects for major browsers
  * Use chromium only
* Enable VDO
* testIdAttribute
```
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [ ['junit', { outputFile: 'junit.xml' }], ['html', { open: 'never' }] ],
  use: {
    trace: 'on-first-retry',
    video: 'on',
    testIdAttribute: 'data-testid',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Run test with playwright
Run test in headless mode
```
$npx playwright test
```

Run test in headed mode
```
$npx playwright test --headed
```

Run test in UI mode
```
$npx playwright test --ui
```

### Write your test cases in folder `tests/`
* First, design your test cases
* Second, write your test cases

Try to record test script
```
$npx playwright codegen http://localhost:8080/
```

### Try to Mock API in test case
* https://playwright.dev/docs/mock

```
import { test, expect } from "@playwright/test";

test("Success with create a new user", async ({ page }) => {
  // Intercept network requests
  await page.route("http://localhost:8081/users", (route) => {
    if (route.request().method() === "POST") {
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: "12345",
          name: "demo",
          email: "demo@gmail.com",
          age: 30,
        }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "12345",
            name: "demo",
            email: "demo@gmail.com",
            age: 30,
          },
        ]),
      });
    }
  });

  // Navigate to the application
  await page.goto("http://localhost:8080/");
  // Step 1: Click on the "Create User" button
  await page.getByTestId("create-user-button").click();

  // Step 2: Fill in the user details
  await page.getByTestId("name-input").fill("demo");
  await page.getByTestId("email-input").fill("demo@gmail.com");
  await page.getByTestId("age-input").fill("30");
  await page.getByTestId("create-user-button").click();

  // Step 3: Verify with path
  await expect(page).toHaveURL("http://localhost:8080/users");
  // Step 4: Verify the user is listed size = 1 (//*[@data-testid="user-list"]/div)
  await expect(page.getByTestId("user-list")).toBeVisible();
  const userList = await page.getByTestId("user-list");
  const userCount = await userList.locator("> div").count();
  expect(userCount).toBe(1);
});
```

### Setup data for test in local storage
```
// Setup data in local storage
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("token", "token");
  });
});
```

### Refactor to page object pattern
* Separation of Concerns: Each page object handles its own page elements and actions
* Reusability: Page objects can be reused across multiple tests
* Maintainability: If UI elements change, you only need to update the page object
* Readability: The test is now more readable and follows a clear flow
* Encapsulation: Page-specific logic is encapsulated within each page object

### Create 3 pages
1. HomePage.js
2. CreateUserPage.ts
3. UserListPage.ts

HomePage.js
```
import { Page, Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly createUserButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createUserButton = page.getByTestId("create-user-button");
  }

  async goto() {
    await this.page.goto("http://localhost:8080/");
  }

  async clickCreateUserButton() {
    await this.createUserButton.click();
  }
}
```

CreateUserPage.ts
```
import { Page, Locator } from "@playwright/test";

export class CreateUserPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly ageInput: Locator;
  readonly createUserButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByTestId("name-input");
    this.emailInput = page.getByTestId("email-input");
    this.ageInput = page.getByTestId("age-input");
    this.createUserButton = page.getByTestId("create-user-button");
  }

  async fillUserDetails(name: string, email: string, age: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.ageInput.fill(age);
  }

  async clickCreateUserButton() {
    await this.createUserButton.click();
  }

  async createUser(name: string, email: string, age: string) {
    await this.fillUserDetails(name, email, age);
    await this.clickCreateUserButton();
  }
}
```

UserListPage.ts
```
import { Page, Locator, expect } from "@playwright/test";

export class UserListPage {
  readonly page: Page;
  readonly userList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userList = page.getByTestId("user-list");
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL("http://localhost:8080/users");
  }

  async verifyUserListVisible() {
    await expect(this.userList).toBeVisible();
  }

  async getUserCount(): Promise<number> {
    return await this.userList.locator("> div").count();
  }

  async verifyUserCount(expectedCount: number) {
    const userCount = await this.getUserCount();
    expect(userCount).toBe(expectedCount);
  }
}
```

index.ts
```
export { HomePage } from "./HomePage";
export { CreateUserPage } from "./CreateUserPage";
export { UserListPage } from "./UserListPage";
```

Update file test case
```
import { test, expect } from "@playwright/test";
import { HomePage, CreateUserPage, UserListPage } from "../pages";

test("Success with create a new user", async ({ page }) => {
  // Initialize page objects
  const homePage = new HomePage(page);
  const createUserPage = new CreateUserPage(page);
  const userListPage = new UserListPage(page);

  // Intercept network requests
  await page.route("http://localhost:8081/users", (route) => {
    if (route.request().method() === "POST") {
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: "12345",
          name: "demo",
          email: "demo@gmail.com",
          age: 30,
        }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "12345",
            name: "demo",
            email: "demo@gmail.com",
            age: 30,
          },
        ]),
      });
    }
  });

  // Step 1: Navigate to the application and click create user button
  await homePage.goto();
  await homePage.clickCreateUserButton();

  // Step 2: Fill in the user details and create user
  await createUserPage.createUser("demo", "demo@gmail.com", "30");

  // Step 3: Verify navigation to user list page
  await userListPage.verifyUrl();
  
  // Step 4: Verify the user is listed
  await userListPage.verifyUserListVisible();
  await userListPage.verifyUserCount(1);
});
```

### 2.3 UI Testing with Robotframework and SeleniumLibrary
* Install [Python 3](https://www.python.org/)

Check your python
```
$python -V
$pip -V
```

Install robotframework and seleniumlibrary
```
$pip install robotframework
$pip install robotframework-seleniumlibrary

$robot
[ ERROR ] Expected at least 1 argument, got 0.

Try --help for usage information.
```

### Create first test case
```
*** Settings ***
Library           SeleniumLibrary
Test Teardown    Close All Browsers

*** Test Cases ***
Create User Successfully
    [Documentation]    This test case verifies that a user can be created successfully.
    Open Browser    http://localhost:8080/    chrome
    # Set data in local storage
    Execute JavaScript    localStorage.setItem("token", "token");
    Click Element    xpath=//*[@data-testid="create-user-button"]
    Input data in register form
    Submit registration form
    Validate register success message

*** Keywords ***
Input data in register form
    [Documentation]    This keyword inputs data into the registration form.
    Input Text    xpath=//*[@data-testid="name-input"]    testuser
    Input Text    xpath=//*[@data-testid="email-input"]    testuser@example.com
    Input Text    xpath=//*[@data-testid="age-input"]    30

Submit registration form
    [Documentation]    This keyword submits the registration form.
    Click Element    xpath=//*[@data-testid="create-user-button"]

Validate register success message
    [Documentation]    This keyword validates that the success message is displayed.
    Wait Until Element Is Visible    xpath=//*[@data-testid="user-list"]
    Location Should Be    http://localhost:8080/users
    # Check div count
    ${div_count}=    Get Element Count    xpath=//*[@data-testid="user-list"]/div
    Should Be Equal As Integers    ${div_count}    3
```

Try to run
```
$robot create_user_success.robot
```

### List of your problems ?
* XXX
* YYY
* ZZZ

## 3. Contract testing
* Working with External REST API
  * Consumer = Web UI
  * Provider = User Service