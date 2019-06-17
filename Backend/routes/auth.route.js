import express from 'express';
import SigninMiddleware from '../middleware/signin.middleware';
import Auth from '../controllers/authentication.controller';
import SignupMiddleware from '../middleware/signup.middleware';
import AccountMiddleware from '../middleware/account.middleware';

const router = express.Router();

router.post('/signup', SignupMiddleware.checkValidInput,
  SignupMiddleware.exists, Auth.createUser);

router.post('/signin', SigninMiddleware.checkEmptyFields,
  SigninMiddleware.checkExistence, Auth.sendResponse);

router.post('/admin/create', SignupMiddleware.exists,
  AccountMiddleware.checkAuthorization, Auth.AdmincreateUser);

export default router;
