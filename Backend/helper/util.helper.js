import jwt from 'jsonwebtoken';
import joi from '@hapi/joi';
import jwtDecode from 'jwt-decode';
import dotenv from 'dotenv';
import database from '../db/index';
import schema from './joi.schema';


dotenv.config();

export default class Util {
  static SendToken(req, res, action, dbResponse) {
    let stat;
    let message;
    jwt.sign(
      {
        id: dbResponse.id,
        isAdmin: dbResponse.isadmin,
        type: dbResponse.type,
      },
      process.env.my_secret,
      (err, token) => {
        if (action === 'signin') {
          stat = 200;
          message = 'Sucessfully signed in';
        } else {
          stat = 201;
          message = 'Sucessfully signed up';
        }
        res.status(stat);
        res.json({
          status: stat,
          data: {
            token,
            id: dbResponse.id,
            firstName: dbResponse.firstname,
            lastName: dbResponse.lastname,
            email: dbResponse.email,
          },
          message: `${message}`,
        });
      },
    );
  }

  static check(res, properties, scheme) {
    let status = true;
    joi.validate(properties, schema[scheme], (err) => {
      if (err) {
        const msg = Util.errorMessage(err.details[0].type, err.details[0].path);
        res.status(403);
        res.json({
          status: 403,
          error: msg,
        });
        status = false;
      }
    });
    return status;
  }

  static async checkEmailOwner(req, res) {
    const { id } = Util.getInfoFromToken(req);
    const text = 'SELECT * from users WHERE email = $1 AND id = $2';
    const values = [req.params.user_email, id];
    try {
      const { rows } = await database.query(text, values);
      return rows[0];
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err.message,
      });
    }
  }

  static checkStaffAccess(req) {
    const userInfo = Util.getInfoFromToken(req);
    if (userInfo.type === 'staff') {
      return 'true';
    }
    return 'false';
  }

  static errorMessage(type, path) {
    const error = {
      'any.allowOnly': {
        msg: path == 'confirm password' ? 'password does not match' : `invalid ${path}`,
      },
      'any.empty': {
        msg: `Enter ${path}`,
      },
      'any.required': {
        msg: `Enter ${path}`,
      },
      'string.email': {
        msg: 'Invalid email',
      },
      'string.min': {
        msg: 'Invalid email or password',
      },
      'string.regex.base': {
        msg: `invalid ${path}`,
      },
      'number.base': {
        msg: `invalid ${path}`,
      },
      'number.min': {
        msg: `invalid ${path}`,
      },
      'number.max': {
        msg: `invalid ${path}`,
      },
      'string.alphanum': {
        msg: `invalid ${path}`,
      },
    };
    return error[type].msg;
  }

  static async getAccount(res, acctNumber) {
    const text = 'SELECT * FROM accounts WHERE accountnumber = $1';
    const values = [acctNumber];

    try {
      const { rows } = await database.query(text, values);
      return rows[0];
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err.message,
      });
    }
  }

  static async getOwner(res, TransactionId) {
    const text = 'SELECT accounts.owner FROM accounts INNER JOIN transactions ON transactions.accountnumber=accounts.accountnumber WHERE transactions.id=$1';
    const values = [TransactionId];
    try {
      const { rows } = await database.query(text, values);
      if (!rows[0]) {
        return 'false';
      }
      return rows[0];
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err.message,
      });
    }
  }

  static getToken(req) {
    const bearer = req.headers.authorization.split(' ');
    return bearer[1];
  }

  static getInfoFromToken(req) {
    const token = Util.getToken(req);
    const content = jwtDecode(token);
    return content;
  }

  static async getUserById(res, id) {
    const text = 'SELECT * FROM users WHERE id = $1';
    const value = [id];
    try {
      const { rows } = await database.query(text, value);
      if (!rows[0]) {
        return false;
      }
      return rows[0];
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err.message,
      });
    }
  }

  static async ownerInfo(req, res) {
    const { id } = Util.getInfoFromToken(req);
    const user = await Util.getUserById(res, id);
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };
  }

  static async updateTable(res, table, column, value, row, rowValue) {
    const text = `UPDATE ${table} SET ${column} = $1 WHERE ${row} = $2 RETURNING *`;
    const values = [value, rowValue];

    try {
      const { rows } = await database.query(text, values);
      return rows[0];
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Something went wrong',
      });
    }
  }

  static async getownerId(req) {
    const text = 'SELECT id FROM users WHERE email = $1';
    const { rows } = await database.query(text, [req.params.user_email]);
    return rows[0];
  }

  static trim(string) {
    return string.replace(/^\s+|\s+$/g, '');
  }

  static trimValues(req, object) {
    const keys = Object.keys(object);
    keys.forEach((item) => {
      req.body[item] = Util.trim(req.body[item]);
    });
  }
}
