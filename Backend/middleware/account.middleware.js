import jwt from 'jsonwebtoken';
import Util from '../helper/util.helper';
import users from '../models/storage.model';

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

  // eslint-disable-next-line consistent-return
  static checkAuthorization(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
      });
    }
    const userId = Util.ownerInfo(req, res).id;
    if (!users.find(item => item.id === userId)) {
      return res.status(401).json({
        status: 401,
        error: 'unauthorized',
      });
    }

    const token = Util.getToken(req);
    jwt.verify(token, 'bufallo', (err) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized',
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
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  }
}
