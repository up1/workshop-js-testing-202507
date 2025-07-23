# Testing strategies of Consumer A ?
* End-to-End testing with API testing
  * Postman
  * Supertest and jest
* Service component testing
  * As same as End-to-End testing but ..
  * Try to mock all dependencies system
    * User service
* Contract testing
* Unit testing
  * Jest and [Jest Mock](https://jestjs.io/docs/mock-functions)

## 1. Component testing
* How to mock `User service` REST API ?
  * Create Mock server ?
  * Change URL of user service from real url to mock url ?

### 1.1 External mock server
* [Postman mock server](https://learning.postman.com/docs/design-apis/mock-apis/set-up-mock-servers/)
* [Stubby](https://www.npmjs.com/package/stubby)
* [WireMock](https://wiremock.org/)
* Container-based => Docker

### 1.2 Working with stubby4node
```
$cd mock-server
$npm install -g stubby
$stubby -d api.yml -w
```

Access to Mock API server
* http://localhost:8882

Start server wotk mock server
```
$export USER_API_HOST=http://localhost:8882
$npm start
```

### 1.3 Internal mock server
* NodeJS
  * [Nock](https://www.npmjs.com/package/nock)
* Go
  * [Gock](https://github.com/h2non/gock)
* Java
  * [WireMock Spring Boot Integration](https://wiremock.org/docs/spring-boot/)
* [Test container](https://testcontainers.com/)

### 1.4 Working with Nock
* In folder `./tests/component-tests`

```
$npm run test:component

PASS  tests/component_tests/register_test.js
  Register API Tests
    POST /api/register - Component Tests with Supertest and Nock user service
      ✓ should successfully register a user when user service returns 201 (87 ms)
      ✓ should return 401 when authorization header is missing (6 ms)
      ✓ should return 401 when authorization token is invalid (6 ms)
      ✓ should return 500 when user service returns 400 error (44 ms)
      ✓ should return 500 when user service is unreachable (15 ms)
      ✓ should return 500 when user service returns 500 error (15 ms)
      ✓ should handle user service timeout (1021 ms)
      ✓ should send correct headers to user service (29 ms)
```

## 2. Unit testing
* All class/function/line must to be tested ?
  * Code/Test coverage % ?