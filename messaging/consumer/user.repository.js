class UserRepository {

    constructor() {
        this.users = new Map([]);
    }

    async insert(user) {
        const id = 100;
        return this.users.set(id, user.name, user.email, user.age);
    }
}

module.exports = new UserRepository();
