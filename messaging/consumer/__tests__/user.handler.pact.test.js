const {
  MatchersV3,
  MessageConsumerPact,
  asynchronousBodyHandler,
} = require("@pact-foundation/pact");
const userEventHandler = require('../user.handler');
const { like } = MatchersV3;
const path = require("path");

describe("RabbitMQ handler", () => {
  const messagePact = new MessageConsumerPact({
    consumer: "Consumer",
    provider: "Producer",
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "info",
  });

  describe("receive a add user event", () => {
    it("accepts a user event", () => {
      return messagePact
        .expectsToReceive("a user add event")
        .withContent({
          id: like(1),
          name: like("demo"),
          email: like("demo@example.com"),
          age: like(30),
        })
        .withMetadata({
          "contentType": "application/json",
          "queue": "user_queue",
        })
        .verify(asynchronousBodyHandler(userEventHandler));
    });
  });
});
