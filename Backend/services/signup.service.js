/* eslint-disable max-len */
import jwt from 'jsonwebtoken';
import users from '../models/storage.model';

export default class Validate {
  // eslint-disable-next-line no-unused-vars
  static checkValidInput(req, res, next) {
    const checkName = users.find(user => user.firstName + user.lastName === req.body.firstName + req.body.lastName);
    const checkMail = users.find(user => user.email === req.body.email);
    const valid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validMail = valid.test(req.body.email.toLowerCase());

    if (checkName) {
      res.status(400);
      return res.json({
        status: 400,
        error: 'Name already exists',
      });
    }

    if (checkMail) {
      res.status(400);
      return res.json({
        status: 400,
        error: 'email already exists',
      });
    }

    if (!validMail) {
      res.status(400);
      return res.json({
        status: 400,
        error: 'email is not valid',
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      res.status(400);
      return res.json({
        status: 400,
        error: 'password does not match',
      });
    }

    if (req.body.password.length < 6) {
      res.status(400);
      return res.json({
        status: 400,
        error: 'password should be at least 6 letters long',
      });
    }
    return next();
  }

  static checkEmptyFields(req, res, next) {
    if (!req.body.lastName) {
      res.status(400);
      return res.json({
        status: 400,
        error: 'Last name is required',
      });
    }

    if (!req.body.firstName) {
      res.status(400);
      return res.json({
        status: 400,
        error: 'First name is required',
      });
    }

    if (!req.body.email) {
      res.status(400);
      return res.json({
        status: 400,
        error: 'email is required',
      });
    }
    return next();
  }

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
}
