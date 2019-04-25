import database from '../db/index';

export default class {
  static async getTransactions(req, res) {
    const text = 'SELECT id AS transactionId, createdon, type, accountnumber, amount, oldbalance, newbalance FROM transactions WHERE accountnumber = $1';
    try {
      const { rows } = await database.query(text, [req.params.accountNumber]);
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }
  }

  static async getTransaction(req, res) {
    const text = 'SELECT id AS transactionId, createdon, type, accountnumber, amount, oldbalance, newbalance FROM transactions WHERE id = $1';
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
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }
  }
}
