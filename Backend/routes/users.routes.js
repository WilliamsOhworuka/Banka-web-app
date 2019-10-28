import express from 'express';
import AccountMiddleware from '../middleware/account.middleware';
import AccountController from '../controllers/account.controller';
import TransactionController from '../controllers/transaction.controller';

const router = express.Router();

router.get('/:user_email/accounts', AccountMiddleware.checkAuthorization,
  AccountController.getAllAccounts);
router.get('/:userId/transactions', AccountMiddleware.checkAuthorization,
  TransactionController.getUserTransactions);

export default router;
