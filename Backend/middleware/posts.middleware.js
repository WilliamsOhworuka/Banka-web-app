import Util from '../helper/util.helper';

const trimPostRequests = (req, res, next) => {
  Util.trimValues(req, req.body);
  next();
};

export default trimPostRequests;
