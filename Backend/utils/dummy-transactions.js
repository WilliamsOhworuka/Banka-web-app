
const b = {
  id: 2,
  accountNumber: 30772003,
  createdOn: new Date('December 17, 1995 03:24:00'),
  cashier: 3,
  type: 'debit',
  amount: 400,
  newBalance: 700,
  oldBalance: 300,
};

const c = {
  id: 3,
  accountNumber: 30772003,
  createdOn: new Date('December 17, 1995 03:24:00'),
  cashier: 3,
  type: 'credit',
  amount: 4000,
  newBalance: 7000,
  oldBalance: 3000,
};
const transactions = [b, c];
export default transactions;
