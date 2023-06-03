const bcrypt = require('bcryptjs'); //eslint-disable-line
//import bcrypt from 'bcryptjs';
import { Users } from '../models/Users';

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}
function createUser(req, res) {
  return handleErrors(req)
    .then(async () => {
      let user = null;
      const webUser = new Users();

      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(req.body.password, salt);
      user = await webUser.saveUser(req.body.username, hash);

      return user;
    })
    .catch(err => {
      return res.status(400).json({ status: err.message });
    });
}

function loginRequired(req, res, next) {
  if (!req.user) return res.status(401).json({ status: 'Please log in' });
  return next();
}
async function registerRedirect(req, res, next) {
  const username = req.body['username'];
  const webUser = new Users();
  //const exist_user = await webUser.getUserByUserName(req.body.username);
  const exist_user = await webUser.getUserByUserName(username);
  if (exist_user) {
    return res.status(401).json({ status: 'You are already signed up' });
  }

  return next();
}

function loginRedirect(req, res, next) {
  if (req.user) {
    return res.status(401).json({ status: 'You are already logged in' });
  }

  return next();
}

function handleErrors(req) {
  return new Promise((resolve, reject) => {
    if (req.body.username.length < 6) {
      reject({
        message: 'Username must be longer than 6 characters',
      });
    } else if (req.body.password.length < 6) {
      reject({
        message: 'Password must be longer than 6 characters',
      });
    } else {
      resolve(req);
    }
  });
}
// export default {
//   comparePass,
//   createUser,
//   loginRequired,
//   //  adminRequired,
//   loginRedirect,
//   registerRedirect,
// };

module.exports = {
  comparePass,
  createUser,
  loginRequired,
  //  adminRequired,
  loginRedirect,
  registerRedirect,
};
