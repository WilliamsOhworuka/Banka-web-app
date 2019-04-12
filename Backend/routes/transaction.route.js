import express from 'express';
import Account from '../services/account.service';
import transactionService from '../services/transaction.service';

const router = express.Router();

router.post('/:accountNumber/credit', Account.checkAuthorization, Account.checkStaffAccess, transactionService.creditAccount, transactionService.createTransaction);
router.post('/:accountNumber/debit', Account.checkAuthorization, Account.checkStaffAccess, transactionService.debitAccount, transactionService.createTransaction);
export default router;
