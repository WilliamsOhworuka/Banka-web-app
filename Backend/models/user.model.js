export class User {
  constructor(id, email, firstName, lastname, password, type) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastname = lastname;
    this.password = password;
    this.type = type;
  }

  get firstName() {
    return this.firstName;
  }

  get lastName() {
    return this.lastName;
  }

  set firstName(firstname) {
    this.firstName = firstname;
  }

  set lastName(lastname) {
    this.lastName = lastname;
  }
}

export class Staff extends User {
  constructor(id, email, firstName, lastname, password, type, isAdmin) {
    super(id, email, firstName, lastname, password, type);
    this.isAdmin = isAdmin;
  }
}
