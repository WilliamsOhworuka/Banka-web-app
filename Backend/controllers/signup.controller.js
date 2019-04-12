import bcrypt from 'bcrypt';
import { Client, Staff } from '../models/user.model';
import users from '../models/storage.model';
import Util from '../services/util.service';

export default class User {
  static create(req, res, next) {
    Util.generateId(req, users);
    const hashPassword = bcrypt.hashSync(req.body.password, 8);

    if (req.body.type === 'client') {
      users.push(new Client(req.body.id, req.body.email, req.body.firstName, req.body.lastName, hashPassword, 'client'));
    } else {
      users.push(new Staff(req.body.id, req.body.email, req.body.firstName, req.body.lastName, hashPassword, 'staff', req.body.isAdmin));
    }

    Util.sendToken(req, res);
    next();
  }
}
