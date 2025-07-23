const path = require("path");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised").default;
const expect = chai.expect;
const { Pact, Matchers } = require("@pact-foundation/pact");
const LOG_LEVEL = process.env.LOG_LEVEL || "INFO";
chai.use(chaiAsPromised);

describe("Pact", () => {
  const provider = new Pact({
    consumer: "Consumer A",
    provider: "User Service",
    // port: 1234, // You can set the port explicitly here or dynamically (see setup() below)
    log: path.resolve(process.cwd(), "logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: LOG_LEVEL,
    spec: 3,
  });

  // Alias flexible matchers for simplicity
  const { eachLike, like, term, iso8601DateTimeWithMillis } = Matchers;

  // Expected user data for the tests
  const newUser = {
    name: "demo user",
    email: "demo.user@example.com",
    age: 30,
  };

  // Defind user payload, with flexible matchers
  // This makes the test much more resilient to changes in actual data.
  // Here we specify the 'shape' of the object that we care about.
  // It is also important here to not put in expectations for parts of the
  // API we don't care about
  const userBodyExpectation = {
    name: like(newUser.name),
    email: like(newUser.email),
    age: like(newUser.age),
    // gender: term({
    //   matcher: 'F|M',
    //   generate: 'M',
    // })
  };

  const registeredUserExpectation = {
    header: {
      status: "success",
      message: "User registered successfully",
    },
    data: like({
      name: newUser.name,
      email: newUser.email,
      age: newUser.age,
    }),
  };

  const MIN_USERS = 2;
  const userListExpectation = eachLike(userBodyExpectation, {
    min: MIN_USERS,
  });

  // Setup a Mock Server before unit tests run.
  // This server acts as a Test Double for the real Provider API.
  // We then call addInteraction() for each test to configure the Mock Service
  // to act like the Provider
  // It also sets up expectations for what requests are to come, and will fail
  // if the calls are not seen.
  before(() =>
    provider.setup().then((opts) => {
      // Get a dynamic port from the runtime
      process.env.API_HOST = `http://127.0.0.1:${opts.port}`;
    })
  );

  // After each individual test (one or more interactions)
  // we validate that the correct request came through.
  // This ensures what we _expect_ from the provider, is actually
  // what we've asked for (and is what gets captured in the contract)
  afterEach(() => provider.verify());

  // Configure and import consumer API
  // Note that we update the API endpoint to point at the Mock Service
  const { register } = require("../../server.js");

  // Verify service client works as expected.
  //
  // Note that we don't call the consumer API endpoints directly, but
  // use unit-style tests that test the collaborating function behaviour -
  // we want to test the function that is calling the external service.

  describe("When a call to the User Service is made to register a new user", () => {
    describe("and the user is authenticated", () => {
      before(() =>
        // Configure the Pact interaction with the expected request and response
        // Case 1 - Successful registration
        provider.addInteraction({
          uponReceiving: "a request to register a new user",
          state: "is authenticated",
          withRequest: {
            method: "POST",
            path: "/users",
            body: like(newUser),
            headers: {
              "Content-Type": "application/json",
              Authorization: like("Bearer token"),
            },
          },
          willRespondWith: {
            status: 201,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: like(newUser),
          },
        })
      );

      it("registers a new user", async () => {
        process.env.USER_API_HOST = provider.mockService.baseUrl;
        const result = await register(newUser, "Bearer token");
        console.log("result", result);
        expect(result).to.have.property("header");
        expect(result.header).to.have.property("status", "success");
        expect(result.header).to.have.property(
          "message",
          "User registered successfully"
        );
        expect(result).to.have.property("data");
        expect(result.data).to.deep.equal(newUser);
      });
    });

    describe("and the user is not authenticated", () => {
      before(() =>
        // Case 2 - Unauthenticated request
        provider.addInteraction({
          uponReceiving: "a request to register a new user without auth",
          state: "is unauthenticated",
          withRequest: {
            method: "POST",
            path: "/users",
            body: like(newUser),
            headers: {
              "Content-Type": "application/json",
              Authorization: like("Bearer wrong-token"),
            },
          },
          willRespondWith: {
            status: 401,
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
            },
            body: "Unauthorized",
          },
        })
      );

      it("returns an error", async () => {
        process.env.USER_API_HOST = provider.mockService.baseUrl;
        try {
          await register(newUser, "Bearer wrong-token");
        } catch (error) {
          expect(error.message).to.include("Status: 401");
          expect(error.message).to.include("Unauthorized");
        }
      });
    });
  });

  // Write pact files
  after(() => {
    return provider.finalize();
  });
});
