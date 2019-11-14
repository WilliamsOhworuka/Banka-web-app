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

const getCurrentUserTransactionsCount = async (req) => {
  const {
    query: {
      lts, type, search, order = 'desc',
    }, params: { userId },
  } = req;
  const param = search.toLowerCase();
  const typeCondition = type ? 'AND type = $3' : '';
  const condition = order.toLowerCase() === 'desc' ? 'transactions.createdon >= $2'
    : 'transactions.createdon <= $2';
  let text;
  let values;
  if (search) {
    text = `SELECT count(transactions.id) 
    FROM transactions INNER JOIN accounts 
    ON accounts.accountnumber = transactions.accountnumber
    INNER JOIN users ON users.id = accounts.owner
    WHERE users.id = $1 AND ${condition} ${typeCondition} AND (lower(transactions.remark) LIKE '%${param}%' OR lower(transactions.type) LIKE '%${param}%'
    OR CAST(transactions.createdon as VarChar) LIKE '%${param}%'
    OR CAST(transactions.accountnumber as VarChar) LIKE '%${param}%')`;
    values = [userId, lts];
  } else {
    text = `SELECT count(transactions.id)
    FROM transactions INNER JOIN accounts 
    ON accounts.accountnumber = transactions.accountnumber
    INNER JOIN users ON users.id = accounts.owner
    WHERE users.id = $1 ${typeCondition} AND ${condition}`;
    values = [userId, lts];
  }
  const { rows: { 0: { count } } } = await database.query(text, values);
  return count;
};

const getCurrentAccountTransactionsCount = async (req) => {
  const {
    query: {
      lts, order = 'desc', search, type,
    }, params: { accountNumber },
  } = req;
  const param = search.toLowerCase();
  const orderCondition = order.toLowerCase() === 'desc' ? 'createdon >= $2'
    : 'transactions.createdon <= $2';
  const typeCondition = type ? 'AND type = $3' : '';
  let text;
  let values;

  if (search) {
    text = `SELECT count(transaction.id)
            FROM transactions
            WHERE accountnumber = $1 AND ${orderCondition} ${typeCondition} AND (remark) LIKE '%${param}%' OR lower(type) LIKE '%${param}%'
            OR CAST(createdon as VarChar) LIKE '%${param}%'
            OR CAST(accountnumber as VarChar) LIKE '%${param}%')`;
    values = [accountNumber, lts, type];
  } else {
    text = `SELECT count(transactions.id)
            FROM transactions 
            WHERE accountnumber = $1 ${typeCondition} AND ${orderCondition}`;
    values = [accountNumber, lts, type];
  }
  const { rows: { 0: { count } } } = await database.query(text, values);
  return count;
};

const getUserTransactions = async (req) => {
  const {
    query: {
      limit, order = 'desc', lts, search,
    }, params: { userId },
  } = req;
  const param = search.toLowerCase();
  let text;
  let values;
  if (lts && order === 'desc') {
    text = `SELECT transactions.createdon, transactions.remark, transactions.type,transactions.amount,
    transactions.accountnumber,transactions.oldbalance, transactions.newbalance 
    FROM transactions INNER JOIN accounts 
    ON accounts.accountnumber = transactions.accountnumber
    INNER JOIN users ON users.id = accounts.owner
    WHERE users.id = $1 AND transactions.createdon <= $3 AND (lower(transactions.remark) LIKE '%${param}%' OR lower(transactions.type) LIKE '%${param}%'
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
    WHERE users.id = $1 AND transactions.createdon >= $3 AND (lower(transactions.remark) LIKE '%${param}%' OR lower(transactions.type) LIKE '%${param}%'
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
    WHERE users.id = $1 AND (lower(transactions.remark) LIKE '%${param}%' OR lower(transactions.type) LIKE '%${param}%'
    OR CAST(transactions.createdon as VarChar) LIKE '%${param}%'
    OR CAST(transactions.accountnumber as VarChar) LIKE '%${param}%')
    ORDER BY transactions.createdon ${order}
    LIMIT $2`;
    values = [userId, limit];
  }

  const { rows } = await database.query(text, values);
  return rows;
};

const getUserTransactionsCount = async (req) => {
  const { params: { userId }, query: { search } } = req;
  const param = search.toLowerCase();
  const text = `SELECT COUNT(transactions.id)
                      FROM transactions INNER JOIN accounts 
                      ON accounts.accountnumber = transactions.accountnumber
                      INNER JOIN users ON users.id = accounts.owner
                      WHERE users.id = $1 AND (lower(transactions.remark) LIKE '%${param}%' OR lower(transactions.type) LIKE '%${param}%'
                      OR CAST(transactions.createdon as VarChar) LIKE '%${param}%'
                      OR CAST(transactions.accountnumber as VarChar) LIKE '%${param}%')`;
  const values = [userId];
  const { rows } = await database.query(text, values);
  return rows;
};

const getUserTypeTransactions = async (req) => {
  const {
    params: { userId }, query: {
      search, order, limit, type, lts,
    },
  } = req;
  const acctType = type.toLowerCase();
  let text; let values;
  if (search && lts && order === 'desc') {
    const param = search.toLowerCase();
    text = `SELECT transactions.createdon, transactions.remark, transactions.type, transactions.amount,
                      transactions.accountnumber, transactions.oldbalance, transactions.newbalance 
                      FROM transactions INNER JOIN accounts 
                      ON accounts.accountnumber = transactions.accountnumber
                      INNER JOIN users ON users.id = accounts.owner
                      WHERE users.id = $1 AND transactions.createdon <= $4 AND lower(transactions.type) = $2 AND (lower(transactions.remark) LIKE '%${param}%'
                      OR CAST(transactions.createdon as VarChar) LIKE '%${param}%'
                      OR CAST(transactions.accountnumber as VarChar) LIKE '%${param}%')
                      ORDER BY transactions.createdon DESC
                      LIMIT $3`;
    values = [userId, acctType, limit, lts];
  } else if (search && lts && order === 'asc') {
    const param = search.toLowerCase();
    text = `SELECT transactions.createdon, transactions.remark, transactions.type, transactions.amount,
                      transactions.accountnumber, transactions.oldbalance, transactions.newbalance 
                      FROM transactions INNER JOIN accounts 
                      ON accounts.accountnumber = transactions.accountnumber
                      INNER JOIN users ON users.id = accounts.owner
                      WHERE users.id = $1 AND transactions.createdon >= $4 AND lower(transactions.type) = $2 AND (lower(transactions.remark) LIKE '%${param}%'
                      OR CAST(transactions.createdon as VarChar) LIKE '%${param}%'
                      OR CAST(transactions.accountnumber as VarChar) LIKE '%${param}%')
                      ORDER BY transactions.createdon DESC
                      LIMIT $3`;
    values = [userId, acctType, limit, lts];
  } else if (lts) {
    text = `SELECT transactions.createdon, transactions.remark, transactions.type, transactions.amount,
                      transactions.accountnumber, transactions.oldbalance, transactions.newbalance 
                      FROM transactions INNER JOIN accounts 
                      ON accounts.accountnumber = transactions.accountnumber
                      INNER JOIN users ON users.id = accounts.owner
                      WHERE users.id = $1 AND transactions.createdon >= $4 AND lower(transactions.type) = $2
                      ORDER BY transactions.createdon DESC
                      LIMIT $3`;
    values = [userId, acctType, limit, lts];
  } else if (search) {
    const param = search.toLowerCase();
    text = `SELECT transactions.createdon, transactions.remark, transactions.type, transactions.amount,
            transactions.accountnumber, transactions.oldbalance, transactions.newbalance 
            FROM transactions INNER JOIN accounts 
            ON accounts.accountnumber = transactions.accountnumber
            INNER JOIN users ON users.id = accounts.owner
            WHERE users.id = $1 AND lower(transactions.type) = $2 AND (lower(transactions.remark) LIKE '%${param}%'
            OR CAST(transactions.createdon as VarChar) LIKE '%${param}%'
            OR CAST(transactions.accountnumber as VarChar) LIKE '%${param}%')
            ORDER BY transactions.createdon DESC
            LIMIT $3`;
    values = [userId, acctType, limit];
  } else {
    text = `SELECT transactions.createdon, transactions.remark, transactions.type, transactions.amount,
                      transactions.accountnumber, transactions.oldbalance, transactions.newbalance 
                      FROM transactions INNER JOIN accounts 
                      ON accounts.accountnumber = transactions.accountnumber
                      INNER JOIN users ON users.id = accounts.owner
                      WHERE users.id = $1 AND lower(transactions.type) = $2
                      ORDER BY transactions.createdon ${order}
                      LIMIT $3`;
    values = [userId, acctType, limit];
  }
  const { rows } = await database.query(text, values);
  return rows;
};

const getUserTypeTransactionsCount = async (req) => {
  const { params: { userId }, query: { search, type } } = req;
  let text; let values;
  const acctType = type.toLowerCase();
  if (search) {
    const param = search.toLowerCase();
    text = `SELECT COUNT(transactions.id)
                      FROM transactions INNER JOIN accounts 
                      ON accounts.accountnumber = transactions.accountnumber
                      INNER JOIN users ON users.id = accounts.owner
                      WHERE users.id = $1 AND lower(transactions.type) = $2 AND (lower(transactions.remark) LIKE '%${param}%'
                      OR CAST(transactions.createdon as VarChar) LIKE '%${param}%'
                      OR CAST(transactions.accountnumber as VarChar) LIKE '%${param}%')`;
    values = [userId, acctType];
  } else {
    text = `SELECT COUNT(transactions.id)
                      FROM transactions INNER JOIN accounts 
                      ON accounts.accountnumber = transactions.accountnumber
                      INNER JOIN users ON users.id = accounts.owner
                      WHERE users.id = $1 AND lower(transactions.type) = $2`;
    values = [userId, acctType];
  }
  const { rows } = await database.query(text, values);
  return rows;
};

const getAccountTypeTransactions = async (req) => {
  const {
    params: { accountNumber }, query: {
      search, limit, order, type, lts,
    },
  } = req;
  const acctType = type.toLowerCase();
  let text; let values;
  if (search && lts && order === 'desc') {
    const param = search.toLowerCase();
    text = `SELECT createdon, remark, type, amount,
            accountnumber,oldbalance, newbalance 
            FROM transactions 
            WHERE accountnumber = $1 AND createdon <= $4 AND lower(type) = $2 AND (lower(remark) LIKE '%${param}%' OR lower(type) LIKE '%${param}%'
            OR CAST(createdon as VarChar) LIKE '%${param}%'
            OR CAST(accountnumber as VarChar) LIKE '%${param}%')
            order by createdon DESC
            LIMIT $3`;
    values = [accountNumber, acctType, limit, lts];
  } else if (search && lts && order === 'asc') {
    const param = search.toLowerCase();
    text = `SELECT createdon, remark, type, amount,
            accountnumber,oldbalance, newbalance 
            FROM transactions 
            WHERE accountnumber = $1 AND createdon >= $4 AND lower(type) = $2 AND (lower(remark) LIKE '%${param}%' OR lower(type) LIKE '%${param}%'
            OR CAST(createdon as VarChar) LIKE '%${param}%'
            OR CAST(accountnumber as VarChar) LIKE '%${param}%')
            order by createdon ASC
            LIMIT $3`;
    values = [accountNumber, acctType, limit, lts];
  } else if (lts) {
    text = `SELECT createdon, remark, type, amount,
            accountnumber,oldbalance, newbalance 
            FROM transactions 
            WHERE accountnumber = $1 AND createdon >= $4 AND lower(type) = $2
            order by createdon ASC
            LIMIT $3`;
    values = [accountNumber, acctType, limit, lts];
  } else if (search) {
    const param = search.toLowerCase();
    text = `SELECT createdon, remark, type, amount,
            accountnumber,oldbalance, newbalance 
            FROM transactions 
            WHERE accountnumber = $1 AND lower(type) = $2 AND (lower(remark) LIKE '%${param}%' OR lower(type) LIKE '%${param}%'
            OR CAST(createdon as VarChar) LIKE '%${param}%'
            OR CAST(accountnumber as VarChar) LIKE '%${param}%')
            order by createdon ASC
            LIMIT $3`;
    values = [accountNumber, acctType, limit];
  } else {
    text = `SELECT createdon, remark, type, amount,
            accountnumber,oldbalance, newbalance 
            FROM transactions 
            WHERE accountnumber = $1 AND type = $2
            order by createdon DESC
            LIMIT $3`;
    values = [accountNumber, type, limit];
  }
  const { rows } = await database.query(text, values);
  return rows;
};

const getAccountTypeTransactionsCount = async (req) => {
  const { params: { accountNumber }, query: { search, type } } = req;
  let text; let values;
  const acctType = type.toLowerCase();
  if (search) {
    const param = search.toLowerCase();
    text = `SELECT COUNT(transactions.id)
            FROM transactions 
            WHERE accountnumber = $1 AND type = $2 AND (lower(remark) LIKE '%${param}%' OR lower(type) LIKE '%${param}%'
            OR CAST(createdon as VarChar) LIKE '%${param}%'
            OR CAST(accountnumber as VarChar) LIKE '%${param}%')`;
    values = [accountNumber, acctType];
  } else {
    text = `SELECT COUNT(transactions.id)
            FROM transactions 
            WHERE accountnumber = $1 AND type = $2`;
    values = [accountNumber, acctType];
  }
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

const getAccountTransactions = async (req) => {
  const {
    query: {
      limit, order = 'DESC', lts, search,
    },
  } = req;
  const param = search.toLowerCase();
  let text;
  let values;
  if (lts && order === 'desc') {
    text = `SELECT createdon, remark, type, amount,
    accountnumber,oldbalance, newbalance 
     FROM transactions 
     WHERE accountnumber = $1 AND createdon <= $3 AND (lower(remark) LIKE '%${param}%' OR lower(type) LIKE '%${param}%'
     OR CAST(createdon as VarChar) LIKE '%${param}%'
     OR CAST(accountnumber as VarChar) LIKE '%${param}%')
     order by createdon DESC
     LIMIT $2`;
    values = [req.params.accountNumber, limit, lts];
  } else if (lts && order === 'asc') {
    text = `SELECT createdon, remark, type, amount,
    accountnumber,oldbalance, newbalance 
     FROM transactions 
     WHERE accountnumber = $1 AND createdon >= $3 AND (lower(remark) LIKE '%${param}%' OR lower(type) LIKE '%${param}%'
     OR CAST(createdon as VarChar) LIKE '%${param}%'
     OR CAST(accountnumber as VarChar) LIKE '%${param}%')
     order by createdon ASC
     LIMIT $2`;
    values = [req.params.accountNumber, limit, lts];
  } else {
    text = `SELECT createdon, remark, type, amount,
    accountnumber,oldbalance, newbalance 
     FROM transactions 
     WHERE accountnumber = $1 AND (lower(remark) LIKE '%${param}%' OR lower(type) LIKE '%${param}%'
     OR CAST(createdon as VarChar) LIKE '%${param}%'
     OR CAST(accountnumber as VarChar) LIKE '%${param}%')
     ORDER BY createdon ${order}
     LIMIT $2`;
    values = [req.params.accountNumber, req.query.limit];
  }
  const { rows } = await database.query(text, values);
  return rows;
};

const getAccountTransactionsCount = async (req) => {
  const { params: { accountNumber }, query: { search } } = req;
  const param = search.toLowerCase();
  const text = `SELECT COUNT(transactions.id)
                        FROM transactions 
                        WHERE accountnumber = $1 AND (lower(remark) LIKE '%${param}%' OR lower(type) LIKE '%${param}%'
                        OR CAST(createdon as VarChar) LIKE '%${param}%'
                        OR CAST(accountnumber as VarChar) LIKE '%${param}%')`;
  const values = [accountNumber];
  const { rows } = await database.query(text, values);
  return rows;
};

export default {
  getCurrentAccountTransactionsCount,
  getCurrentUserTransactionsCount,
  getAccountTransactions,
  getAllAccountTransactions,
  getAllAccountTransactionsCount,
  getAllUserTransactions,
  getAllUserTransactionsCount,
  getUserTransactions,
  getUserTransactionsCount,
  getAccountTransactionsCount,
  getAccountTypeTransactions,
  getAccountTypeTransactionsCount,
  getUserTypeTransactions,
  getUserTypeTransactionsCount,
};
