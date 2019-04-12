export default class Account {
  constructor(id, accountNumber, createdOn, type, cashier, amount, oldBalance, newBalance) {
    this.id = id;
    this.accountNumber = accountNumber;
    this.createdOn = createdOn;
    this.cashier = cashier;
    this.type = type;
    this.amount = amount;
    this.newBalance = newBalance;
    this.oldBalance = oldBalance;
  }
}
