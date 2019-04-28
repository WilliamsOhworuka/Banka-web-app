import express from 'express';
import Account from '../controllers/account.controller';
import AccountMiddleware from '../middleware/account.middleware';

const router = express.Router();

router.patch('/:accountNumber', AccountMiddleware.checkAuthorization, AccountMiddleware.checkTokenOwner,
  AccountMiddleware.checkStaffAccess, Account.changeAccountStatus);

export default router;
