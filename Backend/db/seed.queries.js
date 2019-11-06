import bcrypt from 'bcrypt';
import database from './index';

const userText = 'INSERT INTO users(firstname, lastname, email, type, password, isadmin) VALUES($1, $2, $3, $4, $5, $6)';
const userValues1 = ['Dan', 'Webstar', 'dan@yahoo.com', 'staff', bcrypt.hashSync('brocky', 8), true];
const userValues2 = ['John', 'Lock', 'john@yahoo.com', 'client', bcrypt.hashSync('brocky', 8), false];
const userValues3 = ['Johnna', 'Lockdown', 'johnna@yahoo.com', 'staff', bcrypt.hashSync('brocky', 8), false];
const accountText = 'INSERT INTO accounts(createdon, owner, type, accountname) VALUES($1, $2, $3, $4)';
const accountValues1 = [new Date(), 1, 'current', 'John Wick'];
const accountValues2 = [new Date(), 2, 'current', 'James Dean'];
const transactionText = 'INSERT INTO transactions(createdon, type, remark, accountnumber, cashier, amount, oldbalance, newbalance) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
const transactionValues = [new Date(), 'credit', 'Card Maintenace Fee', 30772001, 1, 100.00, 0.00, 100.00];

const seedTables = async (query, values) => {
  try {
    return await database.query(query, values);
  } catch (error) {
    return console.error('seeding tables', error);
  }
};

seedTables(userText, userValues1).then((res) => {
  seedTables(accountText, accountValues1);
  seedTables(accountText, accountValues2);
  seedTables(transactionText, transactionValues);
});
seedTables(userText, userValues2);
seedTables(userText, userValues3);
