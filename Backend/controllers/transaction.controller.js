import database from '../db/index';
import Util from '../helper/util.helper';
import transactionHelpers from '../helper/transactions.helper';

const {
  getAccountTransactions, getAllAccountTransactions,
  getAllAccountTransactionsCount, getAllUserTransactions,
  getAllUserTransactionsCount, getUserTransactions,
  getUserTransactionsCount, getAccountTransactionsCount,
} = transactionHelpers;

export default class {
  static async getTransactions(req, res) {
    const { query: { search } } = req;

    try {
      if (search) {
        const { 0: { count } } = await getAccountTransactionsCount(req, search);
        const rows = await getAccountTransactions(req, search);

        return res.status(200).json({
          status: 200,
          data: rows,
          total: count,
        });
      }
      const { 0: { count } } = await getAllAccountTransactionsCount(req);
      const rows = await getAllAccountTransactions(req);

      return res.status(200).json({
        status: 200,
        data: rows,
        total: count,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }

  static async getTransaction(req, res) {
    const text = 'SELECT id AS transactionId, createdon, type, remark, accountnumber, amount, oldbalance, newbalance FROM transactions WHERE id = $1';
    try {
      const { rows } = await database.query(text, [req.params.transaction_id]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'No such transaction',
        });
      }
      return res.status(200).json({
        status: 200,
        data: rows[0],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Something went wrong',
      });
    }
  }

  static async getUserTransactions(req, res) {
    const { query: { search } } = req;
    const staff = Util.checkStaffAccess(req);
    const owner = Util.getInfoFromToken(req);

    if (!staff && !owner.id === req.params.userId) {
      return res.status(403).json({
        status: 401,
        error: 'Unauthorized user',
      });
    }
    try {
      if (search) {
        const { 0: { count } } = await getUserTransactionsCount(req, search);
        const rows = await getUserTransactions(req, search);

        return res.status(200).json({
          status: 200,
          data: rows,
          total: count,
        });
      }

      const { 0: { count } } = await getAllUserTransactionsCount(req);
      const rows = await getAllUserTransactions(req);

      return res.status(200).json({
        status: 200,
        data: rows,
        total: count,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }
}
