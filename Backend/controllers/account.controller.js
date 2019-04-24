import { accounts, transactions } from '../models/storage.model';
import Util from '../helper/util.helper';
import database from '../db/index';
import Transaction from '../models/transaction.model';

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

  static createTransaction(req, res) {
    const userInfo = Util.getInfoFromToken(req);
    Util.generateId(req, transactions);
    const acct = Util.getAccount(req.params.accountNumber);
    const newBalance = acct.balance;
    transactions.push(new Transaction(req.body.id, req.params.accountNumber, Date.now(), 'credit', userInfo.id, req.body.amount, acct.balance, newBalance));
    res.status(200).json({
      status: 200,
      data: {
        id: req.body.id,
        accountNumber: req.params.accountNumber,
        amount: parseFloat(req.body.amount),
        cashier: userInfo.id,
        transactionType: req.body.type,
        accountBalance: newBalance,
      },
    });
  }

  static changeAccountStatus(req, res) {
    const acct = Util.getAccount(req.params.accountNumber);
    if (acct) {
      const Oldstatus = acct.status;
      if (Oldstatus === 'active') {
        acct.status = 'dormant';
      } else {
        acct.status = 'active';
      }
      return res.status(200).json({
        status: 200,
        data: {
          accountNumber: acct.accountNumber,
          status: acct.status,
        },
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'Account does not exist',
    });
  }

  static deleteAccount(req, res) {
    const acct = Util.getAccount(req.params.accountNumber);
    if (acct) {
      const index = accounts.indexOf(acct);
      accounts.splice(index, 1);

      return res.status(200).json({
        status: 200,
        message: 'Account successfully deleted',
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'Account does not exist',
    });
  }
}
