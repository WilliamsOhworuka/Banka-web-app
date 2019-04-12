/* eslint-disable no-trailing-spaces */
import bcrypt from 'bcrypt';
import users from '../models/storage.model';

export default class {
  static getId(req, res, next) { 
    const { id } = users.find(item => item.email === req.body.email);
    req.body.id = id;
    next();
  }

  static checkEmptyFields(req, res, next) {
    if (!req.body.email) {
      res.status(400);
      return res.json({
        status: 400,
        error: 'Enter your email',
      });
    }
    if (!req.body.password) {
      res.status(400);
      return res.json({
        status: 400,
        error: 'Enter your password',
      });
    }
    return next();
  }

  static checkExistence(req, res, next) {
    const check = users.find(item => req.body.email === item.email);
    
    if (check) {
      const resp = bcrypt.compareSync('brock', check.password);
      if (!resp) {
        res.status(401);
        return res.json({
          status: 401,
          error: 'Invalid email or password',
        });
      }
      req.body.firstName = check.firstName;
      req.body.lastName = check.lastName;
      return next();
    }
    
    res.status(401);
    return res.json({
      status: 401,
      error: 'Invalid email or password',
    });
  }
}
