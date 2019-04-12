import express from 'express';
import Account from '../services/account.service';

const router = express.Router();

router.patch('/:accountNumber', Account.checkAuthorization, Account.checkStaffAccess, Account.changeAccountStatus);
export default router;
