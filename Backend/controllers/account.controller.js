import Util from '../helper/util.helper';
import database from '../db/index';

export default class AccountMiddleware {
  static async createAccount(req, res) {
    let owner;

    try {
      owner = await Util.ownerInfo(req, res);
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: 'Something went wrong',
      });
    }
    const text = 'INSERT INTO accounts(createdon,owner,type) VALUES($1, $2, $3) RETURNING *';
    const values = [
      new Date(),
      owner.id,
      req.body.type,
    ];

    try {
      const { rows } = await database.query(text, values);
      const account = rows[0];
      res.status(201).json({
        status: 201,
        data: {
          accountNumber: account.accountnumber,
          firstName: owner.firstname,
          lastName: owner.lastname,
          email: owner.email,
          type: account.type,
          openingBalance: parseFloat(account.balance),
        },
        message: 'Account created',
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: 'Something went wrong',
      });
    }
  }

  static async createTransaction(req, res) {
    const userInfo = Util.getInfoFromToken(req);
    const acct = await Util.getAccount(res, req.params.accountNumber);
    const newBalance = acct.balance;
    const text = 'INSERT INTO transactions(createdon, type, accountnumber, cashier, amount, oldbalance, newbalance) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [
      new Date(),
      req.body.type,
      req.params.accountNumber,
      userInfo.id,
      req.body.amount,
      req.body.oldBal,
      newBalance,
    ];

    try {
      const { rows } = await database.query(text, values);
      const transaction = rows[0];
      return res.status(200).json({
        status: 200,
        data: {
          id: transaction.id,
          accountNumber: acct.accountnumber,
          amount: parseFloat(req.body.amount),
          cashier: userInfo.id,
          transactionType: req.body.type,
          accountBalance: acct.balance,
        },
        message: `Account ${req.body.type}ed`,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Something went wrong',
      });
    }
  }

  static async changeAccountStatus(req, res) {
    const acct = await Util.getAccount(res, req.params.accountNumber);
    if (acct) {
      const text = 'UPDATE accounts SET status = $1 WHERE accountnumber = $2 RETURNING *';
      const values = [req.body.status, req.params.accountNumber];
      const state = req.body.status === 'active' ? 'Activated' : 'Deactived';
      try {
        const { rows } = await database.query(text, values);
        const account = rows[0];
        return res.status(200).json({
          status: 200,
          data: {
            accountNumber: account.accountnumber,
            status: account.status,
          },
          message: `Account ${state}`,
        });
      } catch (err) {
        return res.status(500).json({
          status: 500,
          error: 'Something went wrong',
        });
      }
    }
    return res.status(404).json({
      status: 404,
      error: 'Account does not exist',
    });
  }

  static async deleteAccount(req, res) {
    const acct = await Util.getAccount(res, req.params.accountNumber);
    if (acct) {
      const text = 'DELETE FROM accounts WHERE accountnumber = $1';
      const values = [req.params.accountNumber];

      try {
        await database.query(text, values);
        return res.status(200).json({
          status: 200,
          message: 'Account successfully deleted',
        });
      } catch (err) {
        return res.status(500).json({
          status: 500,
          error: 'Something went wrong',
        });
      }
    }
    return res.status(404).json({
      status: 404,
      error: 'Account does not exist',
    });
  }

  static async getAllAccounts(req, res) {
    const owner = await Util.getownerId(req);
    if (!owner) {
      return res.status(404).json({
        status: 404,
        error: 'User does not exist',
      });
    }
    const text = 'SELECT createdon,accountnumber,type,status,balance FROM accounts WHERE owner = $1';
    const values = [owner.id];

    try {
      const { rows } = await database.query(text, values);
      if (rows.length === 0) {
        rows[0] = {
          message: 'No accounts yet',
        };
      }
      return res.status(200).json({
        status: 200,
        accounts: rows,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Something went wrong',
      });
    }
  }

  static async getAccount(req, res) {
    const text = 'SELECT accounts.createdon,accounts.accountnumber,users.email, accounts.type, accounts.status, accounts.balance FROM accounts INNER JOIN users ON users.id = accounts.owner WHERE accountnumber = $1';
    const { rows } = await database.query(text, [req.params.accountNumber]);
    if (!rows[0]) {
      return res.status(400).json({
        status: 400,
        data: 'invalid account number',
      });
    }

    return res.status(200).json({
      status: 200,
      data: rows[0],
    });
  }

  static async getAllBankaccount(req, res) {
    if (!req.query.status) {
      const text = 'SELECT accounts.createdon,accounts.accountnumber,users.email, accounts.type, accounts.status, accounts.balance FROM accounts INNER JOIN users ON users.id = accounts.owner';
      const { rows } = await database.query(text);
      if (rows.length === 0) {
        rows[0] = {
          message: 'No accounts yet',
        };
      }
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    }
    const text = 'SELECT accounts.createdon,accounts.accountnumber,users.email, accounts.type, accounts.status, accounts.balance FROM accounts INNER JOIN users ON users.id = accounts.owner WHERE accounts.status = $1';
    const { rows } = await database.query(text, [req.query.status]);
    if (rows.length === 0) {
      rows[0] = {
        message: `No ${req.query.status} accounts`,
      };
    }
    return res.status(200).json({
      status: 200,
      data: rows,
    });
  }
}
