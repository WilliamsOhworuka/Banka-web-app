export class Client {
  constructor(id, email, firstName, lastName, password, type) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.type = type;
  }
}

export class Staff extends Client {
  constructor(id, email, firstName, lastName, password, type, isAdmin) {
    super(id, email, firstName, lastName, password, type);
    this.isAdmin = isAdmin;
  }
}
