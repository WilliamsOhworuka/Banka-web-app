import { accounts, transactions } from '../models/storage.model';
import Util from '../helper/util.helper';
import Account from '../models/account.model';
import Transaction from '../models/transaction.model';

export default class AccountMiddleware {
  static createAccount(req, res) {
    Util.generateId(req, accounts);
    Util.generateAccountNumber(req, accounts);

    const owner = Util.ownerInfo(req, res);
    accounts.push(new Account(req.body.id, req.body.accountNumber, Date.now(), owner.id, req.body.type, 'dormant', 0.00));

    res.status(201);
    res.json({
      status: 201,
      data: {
        accountNumber: req.body.accountNumber,
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        type: req.body.type,
        openingBalance: 0.00,
      },
    });
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
