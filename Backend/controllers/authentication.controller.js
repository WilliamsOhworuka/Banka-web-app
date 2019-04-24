import bcrypt from 'bcrypt';
import database from '../db/index';
import Util from '../helper/util.helper';

export default {
  async createUser(req, res) {
    const hashPassword = bcrypt.hashSync(req.body.password, 8);
    const text = 'INSERT INTO users(firstName, lastName, email, password) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      hashPassword,
    ];

    try {
      const dbRes = await database.query(text, values);
      Util.SendToken(req, res, 'signup', dbRes.rows[0]);
    } catch (err) {
      res.status(400).json({
        status: 400,
        error: err.message,
      });
    }
  },

  sendResponse(req, res) {
    Util.SendToken(req, res, 'signin', req.body.dbResponse);
  },
};
