# Workshop with Web UI
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

### Refactor to page object pattern

## 2.3 UI Testing with Robotframework and SeleniumLibrary

## 3. Contract testing
* Working with External REST API
  * Consumer = Web UI
  * Provider = User Service