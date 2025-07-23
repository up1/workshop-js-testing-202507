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

## 2.3 UI Testing with Robotframework and SeleniumLibrary

## 3. Contract testing
* Working with External REST API
  * Consumer = Web UI
  * Provider = User Service