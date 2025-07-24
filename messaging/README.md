# Working with messaging server
* Asynchronous communication
* Message or Event-based
* Tools
  * RabbitMQ
  * Apache Kafka

## Structure
1. Producer
   * Create memsage/event
   * Send to messaging
2. Consumer
   * Read data from message
   * Processing

## Build and start project

### 1. Start messaging server with RabbitMQ
```
$docker compose up -d rabbitmq
$docker compose ps
```

Access to RabbitMQ Management UI
* http://localhost:15672
  * user=user
  * password=password

### 2. Start Producer
```
$cd producer
$npm install
$npm start
```

### 3. Start Consumer
```
$cd consumer
$npm install
$npm start
```

## Testing strategies for consumer and producer ?
* End-to-end testing
* Contract testing

## Contract testing with Pact's messaging
* https://docs.pact.io/implementation_guides/javascript/docs/messages


### 1. Consumer to create contract file
```
$cd consumer
$npm run test:contract
```
Results
* Generated contract file in folder `pacts/` 
* Publish contract to Pact broker

### 2. Producer as provider to verify from contract
* Example to read/load contract file from Consumer side
```
$cd producer
$npm run test:contract
```