import jwt from 'jsonwebtoken';
import Util from '../helper/util.helper';

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
}
