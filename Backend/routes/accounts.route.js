import express from 'express';
import AccountMiddleware from '../middleware/account.middleware';
import AccountController from '../controllers/account.controller';
import TransactionMiddleware from '../middleware/transaction.middleware';
import TransactionController from '../controllers/transaction.controller';

const router = express.Router();

router.post('/', AccountMiddleware.checkEmptyFields, AccountMiddleware.checkAuthorization, AccountMiddleware.checkTokenOwner, AccountController.createAccount);
router.delete('/:accountNumber', AccountMiddleware.checkAuthorization, AccountMiddleware.checkStaffAccess, AccountController.deleteAccount);
router.get('/:accountNumber/transactions', AccountMiddleware.checkAuthorization, AccountMiddleware.checkTokenOwner, TransactionMiddleware.checkOwner, TransactionController.getTransactions);
export default router;
