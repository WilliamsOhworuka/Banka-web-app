import express from 'express';
import SigninMiddleware from '../middleware/signin.middleware';
import Auth from '../controllers/authentication.controller';
import SignupMiddleware from '../middleware/signup.middleware';

const router = express.Router();

router.post('/signup', SignupMiddleware.checkEmptyFields, SignupMiddleware.checkValidInput, Auth.createUser);
router.post('/signin', SigninMiddleware.checkEmptyFields, SigninMiddleware.checkExistence, SigninMiddleware.getId, Auth.sendResponce);
export default router;
