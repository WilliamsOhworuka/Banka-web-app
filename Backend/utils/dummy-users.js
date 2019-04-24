import bcrypt from 'bcrypt';

const b = ['Dan', 'Webstar', 'dan@yahoo.com', 'staff', bcrypt.hashSync('brock', 8), true];
const a = ['John', 'Lock', 'john@yahoo.com', 'staff', bcrypt.hashSync('brock', 8), false];
const users = [a, b];
export default users;
