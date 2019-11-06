/* eslint-disable no-restricted-globals */
import bcrypt from 'bcrypt';
import Utils from '../helper/util.helper';
import database from '../db/index';

const { checkProfileOwner, check, checkPassword } = Utils;

export default class {
  static async editUsername(req, res) {
    const { body: { firstname, lastname }, params: { id } } = req;
    const valid = check(res, { firstname, lastname }, 'editFullnameSchema');
    const values = [firstname, lastname, id];
    const owner = checkProfileOwner(req, id);
    const query = `UPDATE users
      SET firstname = $1, lastname= $2
      WHERE id = $3
      RETURNING *`;

    if (!owner || !isFinite(id)) {
      return res.status(401).json({
        error: 'Unauthorized user',
      });
    }
    if (!valid) {
      return undefined;
    }

    try {
      const {
        rows: {
          0: {
            firstname: firstName,
            lastname: lastName,
          },
        },
      } = await database.query(query, values);
      return res.status(200).json({
        status: 200,
        data: {
          firstName,
          lastName,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err.message,
      });
    }
  }

  static async editPassword(req, res) {
    const { body: { newPassword }, params: { id } } = req;
    const hashPassword = bcrypt.hashSync(newPassword, 8);
    const values = [hashPassword, id];
    const owner = checkProfileOwner(req, id);
    const query = `UPDATE users
      SET password = $1
      WHERE id = $2`;

    if (!owner || !isFinite(id)) {
      return res.status(401).json({
        error: 'Unauthorized user',
      });
    }

    try {
      await database.query(query, values);
      return res.status(200).json({
        status: 200,
        message: 'change successful',
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err.message,
      });
    }
  }

  static async editEmail(req, res) {
    const { body: { email, password }, params: { id } } = req;
    const values = [email, id];
    const owner = checkProfileOwner(req, id);
    const valid = Utils.check(res, { password, email }, 'editEmailSchema');
    const query = `UPDATE users
      SET email = $1
      WHERE id = $2
      RETURNING *`;

    if (!owner || !isFinite(id)) {
      return res.status(401).json({
        error: 'Unauthorized user',
      });
    }
    try {
      const validPassword = await checkPassword(password, id, res);
      if (!valid) {
        return res.status(401).json({
          error: 'Unauthorized user',
        });
      }

      if (!validPassword) {
        return res.status(403).json({
          error: 'The password entered is invalid',
        });
      }

      const { rows: { 0: { email: newEmail } } } = await database.query(query, values);
      return res.status(200).json({
        status: 200,
        data: {
          email: newEmail,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err.message,
      });
    }
  }
}
