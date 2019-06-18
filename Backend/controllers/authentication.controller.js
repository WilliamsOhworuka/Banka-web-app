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
      res.status(500).json({
        status: 500,
        error: 'Something went wrong',
      });
    }
  },

  sendResponse(req, res) {
    Util.SendToken(req, res, 'signin', req.body.dbResponse);
  },

  async AdmincreateUser(req, res) {
    const hashPassword = bcrypt.hashSync(`${req.body.firstName}${req.body.lastName}`, 8);
    const text = 'INSERT INTO users(firstName, lastName, email, password, type, isAdmin) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      hashPassword,
      req.body.type,
      req.body.isAdmin,
    ];

    const user = Util.getInfoFromToken(req);
    if (!user.isAdmin) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized user',
      });
    }
    const valid = Util.check(res, {
      'first name': req.body.firstName,
      'last name': req.body.lastName,
      email: req.body.email,
      type: req.body.type,
      isAdmin: req.body.isAdmin,
    }, 'createUserSchema');

    if (valid) {
      try {
        const dbRes = await database.query(text, values);
        const { rows } = dbRes;
        return res.status(201).json({
          status: 201,
          data: {
            firstname: rows[0].firstname,
            lastname: rows[0].lastname,
            email: rows[0].email,
            type: rows[0].type,
            isadmin: rows[0].isAdmin,
          },
          message: `${req.body.type} created`,
        });
      } catch (err) {
        return res.status(500).json({
          status: 500,
          error: err.message,
        });
      }
    }
    return undefined;
  },
};
