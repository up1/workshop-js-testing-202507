const amqp = require("amqplib/callback_api");
const { faker } = require("@faker-js/faker");
const {userCreated} = require("./user.event");

const createFakeUser = () => {
  const fakeUser = userCreated(
    faker.number.int({ min: 1, max: 1000 }),
    faker.person.firstName(),
    faker.internet.email(),
    faker.number.int({ min: 18, max: 65 }),
  );
  return JSON.stringify(fakeUser);
};

amqp.connect("amqp://user:password@localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = "user_queue";
    var msg = createFakeUser();
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true,
    });
    console.log(" [x] Sent '%s'", msg);
  });
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
