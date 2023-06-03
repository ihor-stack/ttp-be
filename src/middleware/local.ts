const Passport = require('passport'); //eslint-disable-line
//import Passport from 'passport';
const LocalStrategy = require('passport-local').Strategy; //eslint-disable-line
//import LocalStrategy from 'passport-local';
import { Users } from '../models/Users';
const init = require('./passport'); //eslint-disable-line
const authHelpers = require('./helpers'); //eslint-disable-line
//import authHelpers from './helpers';

//const options = {};

init();

Passport.use(
  new LocalStrategy(function verify(username, password, done) {
    // check to see if the username exists
    const user = new Users();
    user
      .getUserByUserName(username)
      .then(user => {
        if (!user) return done(null, false);
        if (!authHelpers.comparePass(password, user['password'])) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      })
      .catch(e => {
        return done(e);
      });
  })
);

module.exports = Passport;
