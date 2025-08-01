const zod = require("zod");
const User = require('./user');
const userRepository = require('./user.repository');

const schema = zod.object({
  id: zod.number(),
  email: zod.email(),
  name: zod.string(),
  age: zod.number(),
});

const handler = (message) => {
  console.log("[x] Processing user event:", message);
  // Validate jsonschema
  const result = schema.safeParse(message);
  if (!result.success) {
    return Promise.reject(new Error("Invalid user event"));
  }

  // Insert user into repository
  console.log("[x] Inserting user into repository:", message);
  return Promise.resolve(userRepository.insert(new User(message.id, message.name, message.email, message.age)));
}

module.exports = handler;