import database from './index';

const accountText = `create table if not exists accounts(
    id serial not null,
    accountNumber serial unique not null,
    createdOn date not null,
    owner int references users(id) not null,
    type varchar(10) not null,
    status varchar(20) default 'active',
    balance numeric(10,2) default 0.00,
    PRIMARY KEY(id, accountNumber)
)`;

const userText = `create table if not exists users(
    id serial primary key,
    firstName varchar(30) not null,
    lastName varchar(30) not null,
    email varchar(50) unique not null,
    password varchar(128) not null,
    type varchar(10) default 'client',
    isAdmin boolean default 'false'
)`;

const transactionText = `create table if not exists transactions(
    id serial primary key,
    createdOn date not null,
    type varchar(10) not null,
    accountNumber int references accounts(accountnumber) not null,
    cashier int references users(id) not null,
    amount numeric(10,2) not null,
    oldBalance numeric(10,2) not null,
    newBalance numeric(10,2) not null
)`;

const seedAccountSequence = 'ALTER SEQUENCE accounts_accountnumber_seq RESTART WITH 30772001';

const create = async () => {
  try {
    await database.query(userText);
    await database.query(accountText);
    await database.query(transactionText);
    await database.query(seedAccountSequence);
  } catch (err) {
    console.error(err);
  }
};

create();
