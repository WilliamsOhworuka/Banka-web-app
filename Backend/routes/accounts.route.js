import express from 'express';
import AccountMiddleware from '../middleware/account.middleware';
import AccountController from '../controllers/account.controller';

const router = express.Router();

router.post('/', AccountMiddleware.checkEmptyFields, AccountMiddleware.checkAuthorization, AccountMiddleware.checkTokenOwner, AccountController.createAccount);
router.delete('/:accountNumber', AccountMiddleware.checkAuthorization, AccountMiddleware.checkStaffAccess, AccountController.deleteAccount);
export default router;
