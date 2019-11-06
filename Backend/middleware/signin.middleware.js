/* eslint-disable no-trailing-spaces */
import bcrypt from 'bcrypt';
import Util from '../helper/util.helper';
import database from '../db/index';

export default class {
  static checkEmptyFields(req, res, next) {
    const valid = Util.check(res, { email: req.body.email, password: req.body.password }, 'signinSchema');
    if (valid) {
      return next();
    }
    return undefined;
  }

  static async checkPassword(req, res, next) {
    const { body: { oldPassword, newPassword }, params: { id } } = req;
    const valid = Util.check(res, { oldPassword, newPassword }, 'changePasswordSchema');
    let user;

    if (!valid) {
      return undefined;
    }

    try {
      user = await Util.getUserById(res, id);
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err.message,
      });
    }

    const passwordMatch = bcrypt.compareSync(oldPassword, user.password);

    if (!passwordMatch || newPassword === oldPassword) {
      return res.status(403).json({
        status: 403,
        error: 'Your current password is inCorrect',
      });
    }
    return next();
  }

  static async checkExistence(req, res, next) {
    const text = 'SELECT * FROM users WHERE email = $1';
    const value = [req.body.email];

    try {
      const { rows } = await database.query(text, value);
      const user = rows[0];
      if (user) {
        const passwordMatch = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordMatch) {
          return res.status(403).json({
            status: 403,
            error: 'Invalid email or password',
          });
        }
        [req.body.dbResponse] = rows;
        return next();
      } 
      return res.status(403).json({
        status: 403,
        error: 'Invalid email or password',
      });
    } catch (err) {
      return res.json({
        status: res.status,
        error: err.message,
      });
    }
  }
}
