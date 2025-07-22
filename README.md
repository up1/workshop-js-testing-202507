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




