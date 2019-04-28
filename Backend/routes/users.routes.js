import express from 'express';
import AccountMiddleware from '../middleware/account.middleware';
import AccountController from '../controllers/account.controller';

const router = express.Router();

router.get('/:user_email/accounts', AccountMiddleware.checkAuthorization,
  AccountMiddleware.checkStaffAccess, AccountController.getAllAccounts);

export default router;
