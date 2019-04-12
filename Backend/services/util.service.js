import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import users from '../models/storage.model';

export default class Util {
  static sendToken(req, res) {
    const secret = 'bufallo';
    jwt.sign(
      {
        id: req.body.id,
        isAdmin: req.body.isAdmin,
        type: req.body.type,
      },
      secret,
      (err, token) => {
        res.status(200);
        res.json({
          status: 200,
          data: {
            token,
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
          },
        });
      },
    );
  }

  static generateId(req, array) {
    const id = array.length + 1;
    req.body.id = id;
  }

  static getToken(req) {
    const bearer = req.headers.authorization.split(' ');
    return bearer[1];
  }

  static getInfoFromToken(req) {
    const token = Util.getToken(req);
    const content = jwtDecode(token);
    return content;
  }

  static ownerInfo(req, res) {
    const ownerId = Util.getInfoFromToken(req, res).id;
    const owner = users.find(item => item.id === ownerId);
    return {
      id: owner.id, firstName: owner.firstName, lastName: owner.lastName, email: owner.email,
    };
  }
}
