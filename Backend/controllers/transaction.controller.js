import database from '../db/index';
import Util from '../helper/util.helper';
import transactionHelpers from '../helper/transactions.helper';

const {
  getAccountTransactions, getAllAccountTransactions,
  getAllAccountTransactionsCount, getAllUserTransactions,
  getAllUserTransactionsCount, getUserTransactions,
  getUserTransactionsCount, getAccountTransactionsCount,
  getAccountTypeTransactions, getAccountTypeTransactionsCount,
  getUserTypeTransactions, getUserTypeTransactionsCount,
  getCurrentAccountTransactionsCount, getCurrentUserTransactionsCount,
} = transactionHelpers;

export default class {
  static async getTransactions(req, res) {
    const {
      query: {
        search, lts, type, limit,
      },
    } = req;

    try {
      if (type) {
        const { 0: { count } } = await getAccountTypeTransactionsCount(req);
        const rows = await getAccountTypeTransactions(req);
        const next = rows ? rows[rows.length - 1].createdon : null;
        const current = limit < count ? limit : count;
        const currentCount = lts ? await getCurrentAccountTransactionsCount(req) : current;

        return res.status(200).json({
          status: 200,
          data: rows,
          next,
          currentCount,
          total: count,
        });
      }
      if (search) {
        const { 0: { count } } = await getAccountTransactionsCount(req);
        const rows = await getAccountTransactions(req);
        const next = rows ? rows[rows.length - 1].createdon : null;
        const current = limit < count ? limit : count;
        const currentCount = lts ? await getCurrentAccountTransactionsCount(req) : current;

        return res.status(200).json({
          status: 200,
          data: rows,
          next,
          currentCount,
          total: count,
        });
      }
      const { 0: { count } } = await getAllAccountTransactionsCount(req);
      const rows = await getAllAccountTransactions(req);
      const next = rows ? rows[rows.length - 1].createdon : null;
      const current = limit < count ? limit : count;
      const currentCount = lts ? await getCurrentAccountTransactionsCount(req) : current;

      return res.status(200).json({
        status: 200,
        data: rows,
        next,
        currentCount,
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
    const {
      query: {
        search, type, limit, lts,
      },
    } = req;
    const staff = Util.checkStaffAccess(req);
    const owner = Util.getInfoFromToken(req);

    if (!staff && !owner.id === req.params.userId) {
      return res.status(403).json({
        status: 401,
        error: 'Unauthorized user',
      });
    }
    try {
      if (type) {
        const { 0: { count } } = await getUserTypeTransactionsCount(req);
        const rows = await getUserTypeTransactions(req);
        const next = rows ? rows[rows.length - 1].createdon : null;
        const current = limit < count ? limit : count;
        const currentCount = lts ? await getCurrentUserTransactionsCount(req) : current;

        return res.status(200).json({
          status: 200,
          data: rows,
          next,
          currentCount,
          total: count,
        });
      }
      if (search) {
        const { 0: { count } } = await getUserTransactionsCount(req);
        const rows = await getUserTransactions(req);
        const next = rows ? rows[rows.length - 1].createdon : null;
        const current = limit < count ? limit : count;
        const currentCount = lts ? await getCurrentUserTransactionsCount(req) : current;

        return res.status(200).json({
          status: 200,
          data: rows,
          next,
          currentCount,
          total: count,
        });
      }

      const { 0: { count } } = await getAllUserTransactionsCount(req);
      const rows = await getAllUserTransactions(req);
      const next = rows ? rows[rows.length - 1].createdon : null;
      const current = limit < count ? limit : count;
      const currentCount = lts ? await getCurrentUserTransactionsCount(req) : current;

      return res.status(200).json({
        status: 200,
        data: rows,
        next,
        currentCount,
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
