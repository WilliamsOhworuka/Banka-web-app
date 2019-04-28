import database from '../db/index';

export default class Validate {
  static checkValidInput(req, res, next) {
    const valid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validMail = valid.test(req.body.email.toLowerCase());

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

  static async exists(req, res, next) {
    const text = 'SELECT * FROM users WHERE email = $1';
    const value = [req.body.email];

    try {
      const { rows } = await database.query(text, value);
      if (rows[0]) {
        return res.status(409).json({
          status: 409,
          error: 'Email already exists',
        });
      }
      return next();
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Something went wrong',
      });
    }
  }
}
