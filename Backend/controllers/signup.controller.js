import bcrypt from 'bcrypt';
import { Client, Staff } from '../models/user.model';
import users from '../models/storage.model';
import Signup from '../services/signup.service';

export default class User {
  static generateId(req) {
    const id = users.length + 1;
    req.body.id = id;
  }

  static create(req, res, next) {
    User.generateId(req);
    const hashPassword = bcrypt.hashSync(req.body.password, 8);

    if (req.body.type === 'client') {
      users.push(new Client(req.body.id, req.body.email, req.body.firstName, req.body.lastName, hashPassword, 'client'));
    } else {
      users.push(new Staff(req.body.id, req.body.email, req.body.firstName, req.body.lastName, hashPassword, 'staff', req.body.isAdmin));
    }

    Signup.sendToken(req, res);
    next();
  }
}
