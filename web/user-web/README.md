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

## 2.1 Locator strategies
* [Playwright best pratices](https://playwright.dev/docs/best-practices)


## 3. Contract testing
* Working with External REST API
  * Consumer = Web UI
  * Provider = User Service