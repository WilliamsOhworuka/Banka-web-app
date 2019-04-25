import Util from '../helper/util.helper';

export default class TransactionService {
  static async creditAccount(req, res, next) {
    const userInfo = Util.getInfoFromToken(req);

    if (!userInfo.isAdmin) {
      const acct = await Util.getAccount(res, req.params.accountNumber);
      if (!acct) {
        return res.status(404).json({
          status: 404,
          error: 'Account not found',
        });
      }

      if (req.body.amount <= 0 || !isFinite(req.body.amount)) {
        return res.status(422).json({
          status: 422,
          error: 'Invalid Operation',
        });
      }

      const newBalance = Number(req.body.amount) + Number(acct.balance);
      req.body.type = 'credit';
      req.body.oldBal = acct.balance;
      await Util.updateTable(res, 'accounts', 'balance', newBalance, 'accountnumber', req.params.accountNumber);
      return next();
    }
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  }

  static async debitAccount(req, res, next) {
    const userInfo = Util.getInfoFromToken(req);

    if (!userInfo.isAdmin && userInfo.type === 'staff') {
      const acct = await Util.getAccount(res, req.params.accountNumber);

      if (!acct) {
        return res.status(404).json({
          status: 404,
          error: 'Account not found',
        });
      }

      if (!isFinite(req.body.amount) || req.body.amount <= 0) {
        return res.status(422).json({
          status: 422,
          error: 'Invalid Operation',
        });
      }

      if (acct.balance > req.body.amount) {
        const newBalance = acct.balance - req.body.amount;
        req.body.type = 'debit';
        req.body.oldBal = acct.balance;
        await Util.updateTable(res, 'accounts', 'balance', newBalance, 'accountnumber', req.params.accountNumber);
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

  static async checkOwner(req, res, next) {
    const userinfo = Util.getInfoFromToken(req);
    const user = await Util.getUserById(res, userinfo.id);
    const account = await Util.getAccount(res, req.params.accountNumber);

    if (!account) {
      return res.status(404).json({
        status: 404,
        error: 'Account does not exist',
      });
    }

    if (!user) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
      });
    }

    if (user.id !== account.owner) {
      return res.status(401).json({
        status: 401,
        error: 'unauthorized',
      });
    }
    return next();
  }

  static async checkTransactionOwner(req, res, next) {
    const userinfo = Util.getInfoFromToken(req);
    const user = await Util.getUserById(res, userinfo.id);
    const account = await Util.getOwner(res, req.params.transaction_id);

    if (account === 'false') {
      return res.status(404).json({
        status: 404,
        error: 'No such transaction',
      });
    }

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'Unauthorized',
      });
    }

    if (user.id !== account.owner) {
      return res.status(401).json({
        status: 401,
        error: 'unauthorized',
      });
    }
    return next();
  }
}
