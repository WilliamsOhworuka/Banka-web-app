const a = {
  id: 1,
  accountNumber: 30772001,
  createdOn: Date.now(),
  owner: 1,
  type: 'savings',
  status: 'active',
  balance: 30000.00,
};

const b = {
  id: 2,
  accountNumber: 30772002,
  createdOn: Date.now(),
  owner: 2,
  type: 'current',
  status: 'active',
  balance: 300.00,
};

const c = {
  id: 3,
  accountNumber: 30772003,
  createdOn: Date.now(),
  owner: 3,
  type: 'savings',
  status: 'dormant',
  balance: 3000.00,
};

const accounts = [a, b, c];
export default accounts;
