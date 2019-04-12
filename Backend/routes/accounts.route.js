import express from 'express';
import AccountService from '../services/account.service';

const router = express.Router();

router.post('/', AccountService.checkEmptyFields, AccountService.checkAuthorization, AccountService.create);
router.delete('/:accountNumber', AccountService.checkAuthorization, AccountService.checkStaffAccess, AccountService.deleteAccount);
export default router;
