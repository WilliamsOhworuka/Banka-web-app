import bcrypt from 'bcrypt';
import Util from '../helper/util.helper';

export default async (req, res, next) => {
  const { body: { email, password }, params: { id } } = req;
  const user = await Util.getUserById(res, id);
  const valid = Util.check(res, { password, email }, 'editEmailSchema');

  if (!valid) {
    return undefined;
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(403).json({
      error: 'The password entered is invalid',
    });
  }
  return next();
};
