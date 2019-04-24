/* eslint-disable no-trailing-spaces */
import bcrypt from 'bcrypt';
import database from '../db/index';

export default class {
  static checkEmptyFields(req, res, next) {
    if (!req.body.email) {
      res.status(400);
      return res.json({
        status: 400,
        error: 'Enter your email',
      });
    }
    if (!req.body.password) {
      res.status(400);
      return res.json({
        status: 400,
        error: 'Enter your password',
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
      return res.status(400).json({
        status: 400,
        error: err.message,
      });
    }
  }
}
