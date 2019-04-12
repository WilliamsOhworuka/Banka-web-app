import express from 'express';
import AccountService from '../services/account.service';

const router = express.Router();

router.post('/', AccountService.checkEmptyFields, AccountService.checkAuthorization, AccountService.create);

export default router;
