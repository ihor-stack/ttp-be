const passport = require('passport'); //eslint-disable-line
//import passport from 'passport';
const knex = require('knex'); //eslint-disable-line
//import knex from 'knex';

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.user_name);
  });

  passport.deserializeUser((username, done) => {
    knex('users')
      .where({ user_name: username })
      .first()
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
};
