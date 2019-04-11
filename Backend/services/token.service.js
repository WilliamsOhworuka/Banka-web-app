import jwt from 'jsonwebtoken';

export default class Token {
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
