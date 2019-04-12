import bcrypt from 'bcrypt';

const a = {
  id: 1,
  firstName: 'kid',
  lastName: 'kudi',
  email: 'kid@yahooo.com',
  type: 'client',
  password: bcrypt.hashSync('kiddy', 8),
};

const b = {
  id: 2,
  firstName: 'mike',
  lastName: 'banon',
  email: 'mike@yahoo.com',
  type: 'staff',
  password: bcrypt.hashSync('mikey', 8),
  isAdmin: true,
};

const c = {
  id: 3,
  firstName: 'kid',
  lastName: 'kudih',
  email: 'kidih@yahoo.com',
  type: 'staff',
  password: bcrypt.hashSync('brock', 8),
  isAdmin: false,
};

const users = [a, b, c];
export default users;
