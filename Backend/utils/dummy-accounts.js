
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

const accounts = [b, c];
export default accounts;
