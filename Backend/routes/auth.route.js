import express from 'express';
import SigninMiddleware from '../middleware/signin.middleware';
import signupController from '../controllers/signup.controller';
import SignupMiddleware from '../middleware/signup.middleware';
import Util from '../helper/util.helper';

const router = express.Router();

router.post('/signup', SignupMiddleware.checkEmptyFields, SignupMiddleware.checkValidInput, signupController.createUser);
router.post('/signin', SigninMiddleware.checkEmptyFields, SigninMiddleware.checkExistence, SigninMiddleware.getId, Util.sendToken);
export default router;
