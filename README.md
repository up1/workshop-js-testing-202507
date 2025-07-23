# Workshop :: Full stack testing


## 1. Provider :: User service
* REST API
* API Document with Swagger
* API testing with Postman


### 1.1 Start server
```
$cd user_service
$npm install
```
Generate [Swagger or OpenAPI](https://swagger.io/)
* swagger_output.json

```
$npm run swagger-autogen
```

Start service
```
$npm start
```

Swagger or OpenAPI documentation
* http://localhost:8081/docs


### 1.2 API testing with Postman
* External testing or Blackbox testing

Run API testing with Postman and [newman](https://www.npmjs.com/package/newman)
* [newman-reporter-htmlextra](https://www.npmjs.com/package/newman-reporter-htmlextra)
```
$npm install -g newman

$cd newman
$newman run user_service.postman_collection.json
```

### 1.3 API testing with [Supertest](https://www.npmjs.com/package/supertest) and [Jest](https://jestjs.io/)
* Internal testing or White box testing

```
$npm run test:api
```
See coverage report in file
* `coverage/lcov-report/index.html`

### 1.4 Working with Docker
```
$docker compose build user_service
$docker compose up -d user_service
$docker compose ps
```

Swagger or OpenAPI documentation
* http://localhost:8081/docs

## 2. Consumer :: Consumer A
* REST API
* Call API from User service


### 2.1 Start server
```
$cd consumer_a
$npm install
```

Start consumer A
```
$npm start
```

Access to api
* http://localhost:8082


### 2.2 API testing with Postman
* External testing or Blackbox testing
* Postman collection in folder `./postman`


### 2.3 Try by yourself
* Try to create a Swagger or OpenAPI documentation
* Add API test with Supertest and Jest (Internal testing)
* What are problems from testing ?

## 3. Contract Testing
* Consumer A ==> User Service
  * List of problems ?
* Tools
  * Postman
  * [Pact](https://docs.pact.io/)
  * [Pact Broker](https://docs.pact.io/pact_broker)

### 3.1 Shared understanding between consumer and provider
* API Specification
* Request and Response
* Success and failure cases
* Message confirmation is called `Contract`
  * HTTP protocol => HTTP request and response format
  * Queue messaging => Message or Event format

### [Contract test](https://pactflow.io/blog/contract-testing-using-json-schemas-and-open-api-part-1/)
  * Collaboration
  * Communication
  * Specification
  * Evolution

### 3.2 Create Contract file
* Register
  * Call user service => POST /users
    * Suucess case
    * Failure case
* Create test case to generate contract file
  * `tests/contract_tests/user_service_specs.js`

```
$cd consumer_a
$npm install
$npm run test:contract
```

Pact's contract file created in folder `./pacts/`





