import bcrypt from 'bcrypt';
import database from './index';

const userText = 'INSERT INTO users(firstname, lastname, email, type, password, isadmin) VALUES($1, $2, $3, $4, $5, $6)';
const userValues1 = ['Dan', 'Webstar', 'dan@yahoo.com', 'staff', bcrypt.hashSync('brock', 8), true];
const userValues2 = ['John', 'Lock', 'john@yahoo.com', 'client', bcrypt.hashSync('brock', 8), false];
const accountText = 'INSERT INTO accounts(createdon, owner, type) VALUES($1, $2, $3)';
const accountValues1 = [new Date(), 1, 'current'];
const accountValues2 = [new Date(), 1, 'current'];


const seedUsers = async (query, values) => {
  try {
    return await database.query(query, values);
  } catch (error) {
    console.error(error);
  }
};

seedUsers(userText, userValues1);
seedUsers(userText, userValues2);
seedUsers(accountText, accountValues1);
seedUsers(accountText, accountValues2);
