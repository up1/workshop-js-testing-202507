const amqp = require('amqplib/callback_api');
const handler = require('./user.handler');

amqp.connect('amqp://user:password@localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'user_queue';

    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, async function(msg) {
      var secs = msg.content.toString().split('.').length - 1;
  
      console.log(" [x] Received %s", msg.content.toString());

      await handler(JSON.parse(msg.content.toString()))

      setTimeout(function() {
        console.log(" [x] Done");
        channel.ack(msg);
      }, secs * 1000);
    }, {
      // manual acknowledgment mode,
      // see /docs/confirms for details
      noAck: false
    });
  });
});