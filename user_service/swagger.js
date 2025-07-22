const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        title: "User Service",
        description: "API documentation for the User Service",
        version: "1.0.0"
    },
    host: "localhost:8081",
    securityDefinitions: {
        apiKeyAuth:{
            type: "apiKey",
            in: "header",       // can be "header", "query" or "cookie"
            name: "Authorization",  // name of the header, query parameter or cookie
            description: "API Key Authentication" // optional, can be omitted
        }
    }
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./users_router.js']

swaggerAutogen(outputFile, endpointsFiles, doc);