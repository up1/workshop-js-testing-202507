const User = require('./user');
const userRepository = require('./user.repository');

const handler = (message) => {
  console.log("[x] Processing user event:", message);
  return Promise.resolve(userRepository.insert(new User(message.id, message.name, message.email, message.age)));
}

module.exports = handler;