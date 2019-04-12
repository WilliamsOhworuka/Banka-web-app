import Util from './util.service';
import AccountService from './account.service';
import { transactions } from '../models/storage.model';
import Transaction from '../models/transaction.model';


export default class TransactionService {
  static creditAccount(req, res, next) {
    const userInfo = Util.getInfoFromToken(req);
    if (!userInfo.isAdmin) {
      const acct = AccountService.getAccount(req.params.accountNumber);
      acct.balance = Number(req.body.amount) + acct.balance;
      req.body.type = 'credit';
      return next();
    }
    return res.status(403).json({
      status: 403,
      error: 'Request denied',
    });
  }

  static debitAccount(req, res, next) {
    const userInfo = Util.getInfoFromToken(req);
    if (!userInfo.isAdmin) {
      const acct = AccountService.getAccount(req.params.accountNumber);
      if (acct.balance > req.body.amount) {
        acct.balance -= Number(req.body.amount);
        req.body.type = 'debit';
        return next();
      }
      return res.status(412).json({
        status: 403,
        error: 'Insufficient balance',
      });
    }
    return res.status(403).json({
      status: 403,
      error: 'Request denied',
    });
  }

  static createTransaction(req, res) {
    const userInfo = Util.getInfoFromToken(req);
    Util.generateId(req, transactions);
    const acct = AccountService.getAccount(req.params.accountNumber);
    const newBalance = acct.balance;
    transactions.push(new Transaction(req.body.id, req.params.accountNumber, Date.now(), 'credit', userInfo.id, req.body.amount, acct.balance, newBalance));
    res.status(200).json({
      status: 200,
      data: {
        id: req.body.id,
        accountNumber: req.params.accountNumber,
        amount: parseFloat(req.body.amount),
        cashier: userInfo.id,
        transactionType: request.body.type,
        accountBalance: newBalance,
      },
    });
  }
}
