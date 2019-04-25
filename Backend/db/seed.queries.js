import bcrypt from 'bcrypt';
import database from './index';

const userText = 'INSERT INTO users(firstname, lastname, email, type, password, isadmin) VALUES($1, $2, $3, $4, $5, $6)';
const userValues1 = ['Dan', 'Webstar', 'dan@yahoo.com', 'staff', bcrypt.hashSync('brock', 8), true];
const userValues2 = ['John', 'Lock', 'john@yahoo.com', 'client', bcrypt.hashSync('brock', 8), false];
const userValues3 = ['Johnna', 'Lockdown', 'johnna@yahoo.com', 'staff', bcrypt.hashSync('brock', 8), false];
const accountText = 'INSERT INTO accounts(createdon, owner, type) VALUES($1, $2, $3)';
const accountValues1 = [new Date(), 1, 'current'];
const accountValues2 = [new Date(), 1, 'current'];


const seedTables = async (query, values) => {
  try {
    return await database.query(query, values);
  } catch (error) {
    return console.error(error);
  }
};

seedTables(userText, userValues1).then((res) => {
  seedTables(accountText, accountValues1);
  seedTables(accountText, accountValues2);
});
seedTables(userText, userValues2);
seedTables(userText, userValues3);
