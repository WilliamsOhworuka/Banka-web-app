import express from 'express';
import AccountMiddleware from '../middleware/account.middleware';
import SigninMiddleware from '../middleware/signin.middleware';
import AccountController from '../controllers/account.controller';
import SignupMiddleware from '../middleware/signup.middleware';
import TransactionController from '../controllers/transaction.controller';
import UserContoller from '../controllers/user.controller';
import passwordCheck from '../middleware/user.middleware';

const router = express.Router();
const { editUsername, editPassword, editEmail } = UserContoller;
const { checkPassword } = SigninMiddleware;
const { exists } = SignupMiddleware;

router.get('/:user_email/accounts', AccountMiddleware.checkAuthorization,
  AccountController.getAllAccounts);
router.get('/:userId/transactions', AccountMiddleware.checkAuthorization,
  TransactionController.getUserTransactions);
router.patch('/edit-name/:id', AccountMiddleware.checkAuthorization, AccountMiddleware.checkTokenOwner, editUsername);
router.patch('/edit-password/:id', AccountMiddleware.checkAuthorization, AccountMiddleware.checkTokenOwner, checkPassword, editPassword);
router.patch('/edit-email/:id', AccountMiddleware.checkAuthorization, AccountMiddleware.checkTokenOwner, passwordCheck, exists, editEmail);
export default router;
