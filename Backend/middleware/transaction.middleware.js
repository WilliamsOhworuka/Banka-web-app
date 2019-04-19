import Util from '../helper/util.helper';

export default class TransactionService {
  static creditAccount(req, res, next) {
    const userInfo = Util.getInfoFromToken(req);

    if (!userInfo.isAdmin) {
      const acct = Util.getAccount(req.params.accountNumber);
      if (!acct) {
        return res.status(404).json({
          status: 404,
          error: 'Account not found',
        });
      }

      if (req.body.amount <= 0 || !isFinite(req.body.amount)) {
        return res.status(403).json({
          status: 403,
          error: 'forbidden operation',
        });
      }

      acct.balance = Number(req.body.amount) + acct.balance;
      req.body.type = 'credit';
      return next();
    }
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  }

  static debitAccount(req, res, next) {
    const userInfo = Util.getInfoFromToken(req);

    if (!userInfo.isAdmin && userInfo.type === 'staff') {
      const acct = Util.getAccount(req.params.accountNumber);

      if (!acct) {
        return res.status(404).json({
          status: 404,
          error: 'Account not found',
        });
      }

      if (!isFinite(req.body.amount) || req.body.amount <= 0) {
        return res.status(403).json({
          status: 403,
          error: 'forbidden operation',
        });
      }

      if (acct.balance > req.body.amount) {
        acct.balance -= Number(req.body.amount);
        req.body.type = 'debit';
        return next();
      }

      return res.status(403).json({
        status: 403,
        error: 'Insufficient balance',
      });
    }
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  }
}
