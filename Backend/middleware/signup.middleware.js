import Util from '../helper/util.helper';
import database from '../db/index';

export default class Validate {
  static checkValidInput(req, res, next) {
    const valid = Util.check(res, {
      'first name': req.body.firstName,
      'last name': req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      'confirm password': req.body.confirmPassword,
    }, 'signupSchema');
    if (valid) {
      return next();
    }
    return undefined;
  }

  static async exists(req, res, next) {
    const text = 'SELECT * FROM users WHERE email = $1';
    const value = [req.body.email];

    try {
      const { rows } = await database.query(text, value);
      if (rows[0]) {
        return res.status(409).json({
          status: 409,
          error: 'Email already exists',
        });
      }
      return next();
    } catch (err) {
      return res.status(400).json({
        status: 400,
        error: err.message,
      });
    }
  }
}
