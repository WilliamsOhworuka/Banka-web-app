import express from 'express';
import AccountMiddleware from '../middleware/account.middleware';
import transactionMiddleware from '../middleware/transaction.middleware';
import transactionController from '../controllers/account.controller';

const router = express.Router();

router.post('/:accountNumber/credit', AccountMiddleware.checkAuthorization, AccountMiddleware.checkStaffAccess, transactionMiddleware.creditAccount, transactionController.createTransaction);
router.post('/:accountNumber/debit', AccountMiddleware.checkAuthorization, AccountMiddleware.checkStaffAccess, transactionMiddleware.debitAccount, transactionController.createTransaction);
export default router;
