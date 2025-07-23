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
* [Test container](https://testcontainers.com/)

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

### 1.2 Internal mock server
* NodeJS
  * [Nock](https://www.npmjs.com/package/nock)
* Go
  * [Gock](https://github.com/h2non/gock)
* Java
  * [WireMock Spring Boot Integration](https://wiremock.org/docs/spring-boot/)

## 2. Unit testing
* All class/function/line must to be tested ?
  * Code/Test coverage % ?