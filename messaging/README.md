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

### 3. Start Consumer

## Testing strategies ?
* End-to-end testing
* Contract testing

## Contract testing with Pact's messaging