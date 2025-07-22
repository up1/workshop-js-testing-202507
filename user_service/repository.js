class UserRepository {
  constructor() {
    this.users = [];
  }

  fetchAll() {
    return this.users;
  }

  getById(id) {
    return this.users.find((user) => id == user.id);
  }

  insert(user) {
    this.users.push(user);
  }

  clear() {
    this.users = [];
  }
}

module.exports = UserRepository;
