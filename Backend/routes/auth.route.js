import express from 'express';
import Validate from '../services/signup.service';
import User from '../controllers/signup.controller';
import Signin from '../services/signin.service';
import Token from '../services/token.service';

const router = express.Router();

router.post('/signup', Validate.checkEmptyFields, Validate.checkValidInput, User.create);
router.post('/signin', Signin.checkEmptyFields, Signin.checkExistence, Signin.getId, Token.sendToken);
export default router;
