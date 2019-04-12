import express from 'express';
import Validate from '../services/signup.service';
import User from '../controllers/signup.controller';
import Signin from '../services/signin.service';
import Util from '../services/util.service';

const router = express.Router();

router.post('/signup', Validate.checkEmptyFields, Validate.checkValidInput, User.create);
router.post('/signin', Signin.checkEmptyFields, Signin.checkExistence, Signin.getId, Util.sendToken);
export default router;
