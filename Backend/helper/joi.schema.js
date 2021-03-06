import joi from '@hapi/joi';

export default {
  signinSchema: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  }),

  signupSchema: joi.object().keys({
    'first name': joi.string().alphanum().regex(/^\S*$/).regex(/^[^0-9]*$/)
      .required(),
    'last name': joi.string().alphanum().regex(/^\S*$/).regex(/^[^0-9]*$/)
      .required(),
    email: joi.string().email().required(),
    'confirm password': joi.string().min(6).valid(joi.ref('password')).required(),
    password: joi.string().min(6).required(),
  }),

  transactionSchema: joi.object().keys({
    amount: joi.number().min(0.1).required(),
    remark: joi.string().regex(/(?!^\d.+$)^[a-z0-9]*[a-z0-9].+$/i).required(),
    'account number': joi.number().integer().min(30772001).max(30999999),
  }),

  createUserSchema: joi.object().keys({
    'first name': joi.string().regex(/^\S*$/).required(),
    'last name': joi.string().regex(/^\S*$/).required(),
    email: joi.string().email().required(),
    'user type': joi.string().valid(['staff']).insensitive().required(),
    isAdmin: joi.string().valid(['true', 'false']).insensitive().required(),
  }),

  statusChangeSchema: joi.object().keys({
    status: joi.string().valid(['activate', 'deactivate']).insensitive().required(),
    'account number': joi.number().integer().min(30772001),
  }),

  generalSchema: joi.object().keys({
    'account number': joi.number().integer().min(30772001).max(30999999),
    'account type': joi.string().valid(['savings', 'current']).insensitive(),
    'transaction id': joi.number(),
    email: joi.string().email(),
  }),

  editFullnameSchema: joi.object().keys({
    firstname: joi.string().regex(/^\S*$/).required(),
    lastname: joi.string().regex(/^\S*$/).required(),
  }),

  editEmailSchema: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  }),

  changePasswordSchema: joi.object().keys({
    newPassword: joi.string().min(6).required(),
    oldPassword: joi.string().min(6).required(),
  }),

  createAccountSchema: joi.object().keys({
    'account type': joi.string().valid(['savings', 'current']).insensitive().required(),
    'account name': joi.string().regex(/^[a-zA-Z][-\sa-zA-Z]+$/).required(),
  }),
};
