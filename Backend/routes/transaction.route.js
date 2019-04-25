import express from 'express';
import AccountMiddleware from '../middleware/account.middleware';
import TransactionMiddleware from '../middleware/transaction.middleware';
import AccountTransactionController from '../controllers/account.controller';
import TransactionControllers from '../controllers/transaction.controller';


const router = express.Router();

router.post('/:accountNumber/credit', AccountMiddleware.checkAuthorization, AccountMiddleware.checkStaffAccess, TransactionMiddleware.creditAccount, AccountTransactionController.createTransaction);
router.post('/:accountNumber/debit', AccountMiddleware.checkAuthorization, AccountMiddleware.checkStaffAccess, TransactionMiddleware.debitAccount, AccountTransactionController.createTransaction);
router.get('/:transaction_id', AccountMiddleware.checkAuthorization, TransactionMiddleware.checkTransactionOwner, TransactionControllers.getTransaction);
export default router;
