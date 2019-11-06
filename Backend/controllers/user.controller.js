/* eslint-disable no-restricted-globals */
import bcrypt from 'bcrypt';
import Utils from '../helper/util.helper';
import database from '../db/index';

const { checkProfileOwner, check } = Utils;

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
      return res.status(403).json({
        error: 'Unauthorized user',
      });
    }
    if (!valid) {
      return undefined;
    }

    try {
      const { rows } = await database.query(query, values);
      return res.status(200).json({
        status: 200,
        data: rows,
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
      return res.status(403).json({
        error: 'Unauthorized user',
      });
    }

    try {
      const { rows } = await database.query(query, values);
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err.message,
      });
    }
  }
}
