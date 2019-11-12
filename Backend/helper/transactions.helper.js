import database from '../db/index';

const getAllUserTransactions = async (req) => {
  const { query: { limit, order = 'desc', lts }, params: { userId } } = req;
  let text;
  let values;
  if (lts && order === 'desc') {
    text = `SELECT transactions.createdon, transactions.remark, transactions.type,transactions.amount,
    transactions.accountnumber,transactions.oldbalance, transactions.newbalance 
    FROM transactions INNER JOIN accounts 
    ON accounts.accountnumber = transactions.accountnumber
    INNER JOIN users ON users.id = accounts.owner
    WHERE users.id = $1 AND transactions.createdon <= $3
    ORDER BY transactions.createdon DESC
    LIMIT $2`;
    values = [userId, limit, lts];
  } else if (lts && order === 'asc') {
    text = `SELECT transactions.createdon, transactions.remark, transactions.type,transactions.amount,
    transactions.accountnumber,transactions.oldbalance, transactions.newbalance 
    FROM transactions INNER JOIN accounts 
    ON accounts.accountnumber = transactions.accountnumber
    INNER JOIN users ON users.id = accounts.owner
    WHERE users.id = $1 AND transactions.createdon >= $3
    ORDER BY transactions.createdon ASC
    LIMIT $2`;
    values = [userId, limit, lts];
  } else {
    text = `SELECT transactions.createdon, transactions.remark, transactions.type,transactions.amount,
    transactions.accountnumber,transactions.oldbalance, transactions.newbalance 
    FROM transactions INNER JOIN accounts 
    ON accounts.accountnumber = transactions.accountnumber
    INNER JOIN users ON users.id = accounts.owner
    WHERE users.id = $1 
    ORDER BY transactions.createdon ${order}
    LIMIT $2`;
    values = [userId, limit];
  }

  const { rows } = await database.query(text, values);
  return rows;
};

const getAllUserTransactionsCount = async (req) => {
  const text = `SELECT count(transactions.id)
                    FROM transactions INNER JOIN accounts 
                    ON accounts.accountnumber = transactions.accountnumber
                    INNER JOIN users ON users.id = accounts.owner
                    WHERE users.id = $1`;

  const values = [req.params.userId];
  const { rows } = await database.query(text, values);
  return rows;
};

const getUserTransactions = async (req, param) => {
  const { query: { limit, order = 'desc', lts }, params: { userId } } = req;
  let text;
  let values;
  if (lts && order === 'desc') {
    text = `SELECT transactions.createdon, transactions.remark, transactions.type,transactions.amount,
    transactions.accountnumber,transactions.oldbalance, transactions.newbalance 
    FROM transactions INNER JOIN accounts 
    ON accounts.accountnumber = transactions.accountnumber
    INNER JOIN users ON users.id = accounts.owner
    WHERE users.id = $1 AND transactions.createdon <= $3 AND (transactions.remark LIKE '%${param}%' OR transactions.type LIKE '%${param}%'
    OR CAST(transactions.createdon as VarChar) LIKE '%${param}%'
    OR CAST(transactions.accountnumber as VarChar) LIKE '%${param}%')
    ORDER BY transactions.createdon DESC
    LIMIT $2`;
    values = [userId, limit, lts];
  } else if (lts && order === 'asc') {
    text = `SELECT transactions.createdon, transactions.remark, transactions.type,transactions.amount,
    transactions.accountnumber,transactions.oldbalance, transactions.newbalance 
    FROM transactions INNER JOIN accounts 
    ON accounts.accountnumber = transactions.accountnumber
    INNER JOIN users ON users.id = accounts.owner
    WHERE users.id = $1 AND transactions.createdon >= $3 AND (transactions.remark LIKE '%${param}%' OR transactions.type LIKE '%${param}%'
    OR CAST(transactions.createdon as VarChar) LIKE '%${param}%'
    OR CAST(transactions.accountnumber as VarChar) LIKE '%${param}%')
    ORDER BY transactions.createdon ASC
    LIMIT $2`;
    values = [userId, limit, lts];
  } else {
    text = `SELECT transactions.createdon, transactions.remark, transactions.type,transactions.amount,
    transactions.accountnumber,transactions.oldbalance, transactions.newbalance 
    FROM transactions INNER JOIN accounts 
    ON accounts.accountnumber = transactions.accountnumber
    INNER JOIN users ON users.id = accounts.owner
    WHERE users.id = $1 AND (transactions.remark LIKE '%${param}%' OR transactions.type LIKE '%${param}%'
    OR CAST(transactions.createdon as VarChar) LIKE '%${param}%'
    OR CAST(transactions.accountnumber as VarChar) LIKE '%${param}%')
    ORDER BY transactions.createdon ${order}
    LIMIT $2`;
    values = [userId, limit];
  }

  const { rows } = await database.query(text, values);
  return rows;
};

const getUserTransactionsCount = async (req, param) => {
  const text = `SELECT COUNT(transactions.id)
                      FROM transactions INNER JOIN accounts 
                      ON accounts.accountnumber = transactions.accountnumber
                      INNER JOIN users ON users.id = accounts.owner
                      WHERE users.id = $1 AND (transactions.remark LIKE '%${param}%' OR transactions.type LIKE '%${param}%'
                      OR CAST(transactions.createdon as VarChar) LIKE '%${param}%'
                      OR CAST(transactions.accountnumber as VarChar) LIKE '%${param}%')`;
  const values = [req.params.userId];
  const { rows } = await database.query(text, values);
  return rows;
};

const getAllAccountTransactions = async (req) => {
  const { query: { limit, order = 'desc', lts }, params: { accountNumber } } = req;
  let text;
  let values;
  if (lts && order === 'desc') {
    text = `SELECT createdon, remark, type, amount,
    accountnumber,oldbalance, newbalance 
     FROM transactions 
     WHERE accountnumber = $1 AND createdon <= $3
     order by createdon DESC
     LIMIT $2`;
    values = [req.params.accountNumber, limit, lts];
  } else if (lts && order === 'asc') {
    text = `SELECT createdon, remark, type, amount,
    accountnumber,oldbalance, newbalance 
     FROM transactions 
     WHERE accountnumber = $1 AND createdon >= $3
     order by createdon ASC
     LIMIT $2`;
    values = [req.params.accountNumber, limit, lts];
  } else {
    text = `SELECT createdon, remark, type, amount,
     accountnumber,oldbalance, newbalance 
     FROM transactions 
     WHERE accountnumber = $1
     ORDER BY createdon ${order}
     LIMIT $2`;
    values = [accountNumber, limit];
  }
  const { rows } = await database.query(text, values);
  return rows;
};

const getAllAccountTransactionsCount = async (req) => {
  const text = `SELECT count(transactions.id)
                      FROM transactions 
                      WHERE accountnumber = $1`;
  const values = [req.params.accountNumber];
  const { rows } = await database.query(text, values);
  return rows;
};

const getAccountTransactions = async (req, param) => {
  const { query: { limit, order = 'DESC', lts } } = req;
  let text;
  let values;
  if (lts && order === 'desc') {
    text = `SELECT createdon, remark, type, amount,
    accountnumber,oldbalance, newbalance 
     FROM transactions 
     WHERE accountnumber = $1 AND createdon <= $3 AND (remark LIKE '%${param}%' OR type LIKE '%${param}%'
     OR CAST(createdon as VarChar) LIKE '%${param}%'
     OR CAST(accountnumber as VarChar) LIKE '%${param}%')
     order by createdon DESC
     LIMIT $2`;
    values = [req.params.accountNumber, limit, lts];
  } else if (lts && order === 'asc') {
    text = `SELECT createdon, remark, type, amount,
    accountnumber,oldbalance, newbalance 
     FROM transactions 
     WHERE accountnumber = $1 AND createdon >= $3 AND (remark LIKE '%${param}%' OR type LIKE '%${param}%'
     OR CAST(createdon as VarChar) LIKE '%${param}%'
     OR CAST(accountnumber as VarChar) LIKE '%${param}%')
     order by createdon ASC
     LIMIT $2`;
    values = [req.params.accountNumber, limit, lts];
  } else {
    text = `SELECT createdon, remark, type, amount,
    accountnumber,oldbalance, newbalance 
     FROM transactions 
     WHERE accountnumber = $1 AND (remark LIKE '%${param}%' OR type LIKE '%${param}%'
     OR CAST(createdon as VarChar) LIKE '%${param}%'
     OR CAST(accountnumber as VarChar) LIKE '%${param}%')
     ORDER BY createdon ${order}
     LIMIT $2`;
    values = [req.params.accountNumber, req.query.limit];
  }
  const { rows } = await database.query(text, values);
  return rows;
};

const getAccountTransactionsCount = async (req, param) => {
  const text = `SELECT COUNT(transactions.id)
                        FROM transactions 
                        WHERE accountnumber = $1 AND (remark LIKE '%${param}%' OR type LIKE '%${param}%'
                        OR CAST(createdon as VarChar) LIKE '%${param}%'
                        OR CAST(accountnumber as VarChar) LIKE '%${param}%')`;
  const values = [req.params.accountNumber];
  const { rows } = await database.query(text, values);
  return rows;
};

export default {
  getAccountTransactions,
  getAllAccountTransactions,
  getAllAccountTransactionsCount,
  getAllUserTransactions,
  getAllUserTransactionsCount,
  getUserTransactions,
  getUserTransactionsCount,
  getAccountTransactionsCount,
};
