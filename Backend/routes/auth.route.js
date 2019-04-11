import express from 'express';
import Validate from '../services/signup.service';
import User from '../controllers/signup.controller';

const router = express.Router();

router.post('/signup', Validate.checkEmptyFields, Validate.checkValidInput, User.create);
router.post('/signin', (req,res,next) => {});
export default router;
