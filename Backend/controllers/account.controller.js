import Util from '../helper/util.helper';
import database from '../db/index';

export default class AccountMiddleware {
  static async createAccount(req, res) {
    let owner;

    try {
      owner = await Util.ownerInfo(req, res);
    } catch (err) {
      res.json({
        error: err.message,
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
      });
    } catch (err) {
      res.status(400).json({
        status: 400,
        error: err.message,
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
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        error: err.message,
      });
    }
  }

  static async changeAccountStatus(req, res) {
    const acct = await Util.getAccount(res, req.params.accountNumber);
    if (acct) {
      const text = 'UPDATE accounts SET status = $1 WHERE accountnumber = $2 RETURNING *';
      const values = [req.body.status, req.params.accountNumber];

      try {
        const { rows } = await database.query(text, values);
        const account = rows[0];
        return res.status(200).json({
          status: 200,
          data: {
            accountNumber: account.accountnumber,
            status: account.status,
          },
        });
      } catch (err) {
        return res.status(400).json({
          status: 400,
          error: err.message,
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
        return res.status(400).json({
          status: 400,
          error: err.message,
        });
      }
    }
    return res.status(404).json({
      status: 404,
      error: 'Account does not exist',
    });
  }
}
