import Util from '../helper/util.helper';

export default class TransactionService {
  static async creditAccount(req, res, next) {
    const userInfo = Util.getInfoFromToken(req);

    if (!userInfo.isAdmin) {
      const valid = Util.check(res, {
        amount: req.body.amount,
        remark: req.body.remark,
        'account number': req.params.accountNumber,
      }, 'transactionSchema');
      if (valid) {
        const acct = await Util.getAccount(res, req.params.accountNumber);
        if (!acct) {
          res.status(404).json({
            status: 404,
            error: 'Account not found',
          });
        } else {
          const newBalance = Number(req.body.amount) + Number(acct.balance);
          req.body.type = 'credit';
          req.body.oldBal = acct.balance;
          await Util.updateTable(res, 'accounts', 'balance', newBalance, 'accountnumber', req.params.accountNumber);
          next();
        }
      }
      return undefined;
    }
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized user',
    });
  }

  static async debitAccount(req, res, next) {
    const userInfo = Util.getInfoFromToken(req);

    if (!userInfo.isAdmin) {
      const valid = Util.check(res, {
        amount: req.body.amount,
        remark: req.body.remark,
        'account number': req.params.accountNumber,
      }, 'transactionSchema');
      if (valid) {
        const acct = await Util.getAccount(res, req.params.accountNumber);
        if (!acct) {
          res.status(404).json({
            status: 404,
            error: 'Account not found',
          });
        } else {
          const diff = acct.balance - req.body.amount;
          if (diff < 1) {
            res.status(403).json({
              status: 403,
              error: 'insufficient balance',
            });
          } else {
            const newBalance = acct.balance - req.body.amount;
            req.body.type = 'debit';
            req.body.oldBal = acct.balance;
            await Util.updateTable(res, 'accounts', 'balance', newBalance, 'accountnumber', req.params.accountNumber);
            next();
          }
        }
      }
      return undefined;
    }
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized user',
    });
  }

  static async checkOwner(req, res, next) {
    const userinfo = Util.getInfoFromToken(req);
    const user = await Util.getUserById(res, userinfo.id);
    const staff = Util.checkStaffAccess(req);
    const valid = Util.check(res, { 'account number': req.params.accountNumber }, 'generalSchema');
    if (valid) {
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
          error: 'Unauthorized user',
        });
      }

      if (user.id !== account.owner && !staff) {
        return res.status(401).json({
          status: 401,
          error: 'unauthorized user',
        });
      }
      return next();
    }
    return undefined;
  }

  static async checkTransactionOwner(req, res, next) {
    const userinfo = Util.getInfoFromToken(req);
    const user = await Util.getUserById(res, userinfo.id);
    const valid = Util.check(res, { 'transaction id': req.params.transaction_id }, 'generalSchema');

    if (valid) {
      const account = await Util.getOwner(res, req.params.transaction_id);

      if (!user) {
        return res.status(404).json({
          status: 404,
          error: 'User does not exist',
        });
      }

      if (account === 'false') {
        return res.status(404).json({
          status: 404,
          error: 'No such transaction',
        });
      }

      if (user.id !== account.owner) {
        return res.status(401).json({
          status: 401,
          error: 'unauthorized user',
        });
      }
      return next();
    }
    return undefined;
  }
}
