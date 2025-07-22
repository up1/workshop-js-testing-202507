const UserRepository = require('./repository');

const userRepository = new UserRepository();

// Load default data into a repository
const importData = () => {
  const data = require('./data/users.json');
  data.reduce((a, v) => {
    v.id = a + 1;
    userRepository.insert(v);
    return a + 1;
  }, 0);
};

module.exports = {
  importData
};