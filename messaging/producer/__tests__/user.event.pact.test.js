const path = require("path")
const {
  MessageProviderPact,
  providerWithMetadata,
} = require("@pact-foundation/pact");
const {userCreated} = require("../user.event");

describe("Producer Pact", () => {
  const provider = new MessageProviderPact({
    provider: "Producer",
    logLevel: "info",
    pactUrls: [
      path.resolve(
        process.cwd() + "/../consumer",
        "pacts",
        "Consumer-Producer.json"
      ),
    ],
    messageProviders: {
      "a user add event": providerWithMetadata(() => {
        return userCreated(1, "demo2", "demo@example.com", 30);
      }, {
        "contentType": "application/json",
        "queue": "user_queue",
      }),
    }
  });

  describe("userCreated event", () => {
    it("should send a user created event", () => {
      return provider.verify();
    });
  });
});
