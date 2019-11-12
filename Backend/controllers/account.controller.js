import Util from '../helper/util.helper';
import database from '../db/index';

export default class {
  static async createAccount(req, res) {
    let owner;

    try {
      owner = await Util.ownerInfo(req, res);
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: err.message,
      });
    }
    const text = 'INSERT INTO accounts(createdon, owner, accountname, type) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [
      new Date(),
      owner.id,
      req.body.accountname.toLowerCase(),
      req.body.type.toLowerCase(),
    ];

    try {
      const { rows } = await database.query(text, values);
      const account = rows[0];
      res.status(201).json({
        status: 201,
        data: {
          ...account,
        },
        message: 'Account created',
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: err.message,
      });
    }
  }

  static async createTransaction(req, res) {
    const userInfo = Util.getInfoFromToken(req);
    const acct = await Util.getAccount(res, req.params.accountNumber);
    const newBalance = acct.balance;
    const text = 'INSERT INTO transactions(createdon, type, remark, accountnumber, cashier, amount, oldbalance, newbalance) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const values = [
      new Date(),
      req.body.type,
      req.body.remark,
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
          remark: rows[0].remark,
          cashier: userInfo.id,
          transactionType: rows[0].type,
          accountBalance: acct.balance,
        },
        message: `Account ${req.body.type}ed`,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err.message,
      });
    }
  }

  static async changeAccountStatus(req, res) {
    const valid = Util.check(res, {
      'account number': `${req.params.accountNumber}`,
      status: req.body.status,
    }, 'statusChangeSchema');

    if (valid) {
      const acct = await Util.getAccount(res, req.params.accountNumber);
      if (acct) {
        const text = 'UPDATE accounts SET status = $1 WHERE accountnumber = $2 RETURNING *';
        const state = req.body.status === 'activate' ? 'Active' : 'Deactivated';
        const values = [state, req.params.accountNumber];
        try {
          const { rows } = await database.query(text, values);
          const account = rows[0];
          res.status(200).json({
            status: 200,
            data: {
              accountNumber: account.accountnumber,
              status: account.status,
            },
            message: `Account ${state}`,
          });
        } catch (error) {
          res.status(500).json({
            status: 500,
            error: error.message,
          });
        }
      } else {
        res.status(404).json({
          status: 404,
          error: 'Account does not exist',
        });
      }
    }
    return undefined;
  }


  static async deleteAccount(req, res) {
    const valid = Util.check(res, { 'account number': req.params.accountNumber }, 'generalSchema');
    if (valid) {
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
            error: err.message,
          });
        }
      }
      return res.status(404).json({
        status: 404,
        error: 'Account does not exist',
      });
    }
    return undefined;
  }

  static async getAllAccounts(req, res) {
    const valid = Util.check(res, { email: req.params.user_email }, 'generalSchema');

    if (valid) {
      const owner = await Util.getownerId(req);
      const accountOwner = await Util.checkEmailOwner(req, res);
      const staff = Util.checkStaffAccess(req);

      if (!owner) {
        return res.status(404).json({
          status: 404,
          error: 'User does not exist',
        });
      }

      if (!accountOwner && staff) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized user',
        });
      }

      const text = 'SELECT createdon,accountname,accountnumber,type,status,balance FROM accounts WHERE owner = $1';
      const values = [owner.id];

      try {
        const { rows } = await database.query(text, values);

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
    return undefined;
  }

  static async getAccount(req, res) {
    const text = 'SELECT accounts.createdon,accounts.accountnumber,accounts.accountname,users.email, accounts.type, accounts.status, accounts.balance FROM accounts INNER JOIN users ON users.id = accounts.owner WHERE accountnumber = $1';
    const { rows } = await database.query(text, [req.params.accountNumber]);
    if (!rows[0]) {
      return res.status(403).json({
        status: 403,
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
      const text = 'SELECT accounts.createdon,accounts.accountname,accounts.accountnumber,users.email, accounts.type, accounts.status, accounts.balance FROM accounts INNER JOIN users ON users.id = accounts.owner';
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
    const text = 'SELECT accounts.createdon,accounts.accountname,accounts.accountnumber,users.email, accounts.type, accounts.status, accounts.balance FROM accounts INNER JOIN users ON users.id = accounts.owner WHERE accounts.status = $1';
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
