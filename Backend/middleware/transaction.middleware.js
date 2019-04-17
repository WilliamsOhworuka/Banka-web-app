import Util from '../helper/util.helper';

export default class TransactionService {
  static creditAccount(req, res, next) {
    const userInfo = Util.getInfoFromToken(req);
    if (!userInfo.isAdmin) {
      const acct = Util.getAccount(req.params.accountNumber);
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
      const acct = Util.getAccount(req.params.accountNumber);
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
}
