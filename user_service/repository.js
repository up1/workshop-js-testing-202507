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
    // Count the current number of users
    const currentCount = this.users.length;
    // Assign a new ID based on the current count
    user.id = currentCount + 1;
    // Add the new user to the users array
    this.users.push(user);
  }

  clear() {
    this.users = [];
  }
}

module.exports = UserRepository;
