import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Util from '../helper/util.helper';

dotenv.config();

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
  static async checkAuthorization(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
      });
    }

    const token = Util.getToken(req);
    jwt.verify(token, process.env.my_secret, (err) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      }
      return next();
    });
  }

  static async checkTokenOwner(req, res, next) {
    const { id } = Util.getInfoFromToken(req);
    const exist = await Util.getUserById(res, id);
    if (!exist) {
      return res.status(404).json({
        status: 404,
        error: 'Not found',
      });
    }
    return next();
  }

  static async checkStaffAccess(req, res, next) {
    const userInfo = Util.getInfoFromToken(req);
    const exist = await Util.getUserById(res, userInfo.id);
    if (!exist) {
      return res.status(404).json({
        status: 404,
        error: 'Not found',
      });
    }

    if (userInfo.type === 'staff') {
      return next();
    }
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  }
}
