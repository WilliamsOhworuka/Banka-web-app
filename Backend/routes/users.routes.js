import express from 'express';
import AccountMiddleware from '../middleware/account.middleware';
import AccountController from '../controllers/account.controller';
import TransactionController from '../controllers/transaction.controller';
import UserContoller from '../controllers/user.controller';

const router = express.Router();
const { editUsername } = UserContoller;
router.get('/:user_email/accounts', AccountMiddleware.checkAuthorization,
  AccountController.getAllAccounts);
router.get('/:userId/transactions', AccountMiddleware.checkAuthorization,
  TransactionController.getUserTransactions);
router.patch('/edit-name/:id', AccountMiddleware.checkAuthorization, AccountMiddleware.checkTokenOwner, editUsername);
export default router;
