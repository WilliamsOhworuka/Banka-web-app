import jwt from 'jsonwebtoken';
import Account from '../models/account.model';
import { accounts } from '../models/storage.model';
import Util from './util.service';

export default class AccountService {
  static checkEmptyFields(req, res, next) {
    if (!req.body.type) {
      res.status(400);
      return res.json({
        status: 400,
        error: 'Set account type',
      });
    }
    return next();
  }

  static checkAuthorization(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(403).json({
        status: 403,
        error: 'Access denied',
      });
    }
    const token = Util.getToken(req);
    jwt.verify(token, 'bufallo', (err) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          error: 'Request denied',
        });
      }
      return next();
    });
  }

  static checkStaffAccess(req, res, next) {
    const userInfo = Util.getInfoFromToken(req);
    if (userInfo.type === 'staff') {
      return next();
    }
    return res.status(403).json({
      status: 403,
      error: 'Request denied',
    });
  }

  static generateAccountNumber(req, array) {
    const seed = 30772003;
    req.body.accountNumber = seed + array.length + 3;
  }

  static create(req, res, next) {
    Util.generateId(req, accounts);
    AccountService.generateAccountNumber(req, accounts);

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
    next();
  }

  static getAccount(accountNumber) {
    return accounts.find(item => item.accountNumber === +accountNumber);
  }

  static changeAccountStatus(req, res) {
    const acct = AccountService.getAccount(req.params.accountNumber);
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
}
