import bcrypt from 'bcrypt';
import { Client } from '../models/user.model';
import users from '../models/storage.model';
import Util from '../helper/util.helper';

export default class User {
  static createUser(req, res) {
    Util.generateId(req, users);
    const hashPassword = bcrypt.hashSync(req.body.password, 8);

    users.push(new Client(req.body.id, req.body.email, req.body.firstName, req.body.lastName, hashPassword, 'client'));
    Util.sendToken(req, res);
  }

  static sendResponce(req, res) {
    Util.sendToken(req, res, 'signin');
  }
}
