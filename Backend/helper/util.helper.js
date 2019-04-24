import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import dotenv from 'dotenv';
import database from '../db/index';

dotenv.config();

export default class Util {
  static SendToken(req, res, action, dbResponse) {
    let stat;
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
        } else {
          stat = 201;
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
        });
      },
    );
  }

  static async getAccount(res, acctNumber) {
    const text = 'SELECT * FROM accounts WHERE accountnumber = $1';
    const values = [acctNumber];

    try {
      const { rows } = await database.query(text, values);
      return rows[0];
    } catch (err) {
      return res.status(400).json({
        status: 400,
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
      return res.json({
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
      return res.status(400).json({
        status: 400,
        error: err.message,
      });
    }
  }
}
