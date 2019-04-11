export class Client {
  constructor(id, email, firstName, lastname, password, type) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastname = lastname;
    this.password = password;
    this.type = type;
  }
}

export class Staff extends Client {
  constructor(id, email, firstName, lastname, password, type, isAdmin) {
    super(id, email, firstName, lastname, password, type);
    this.isAdmin = isAdmin;
  }
}
