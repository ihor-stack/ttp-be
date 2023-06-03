import { Users } from '../models/Users';
import Logzio from '../services/Logzio';

const express = require('express'); //eslint-disable-line
//import express from 'express';
const router = express.Router();

const authHelper = require('../middleware/helpers'); //eslint-disable-line
//import authHelper from '../middleware/helpers';
const passportService = require('../middleware/local'); //eslint-disable-line
//import passportService from '../middleware/local';
const logger = Logzio.getInstance();
// route '/auth/register'
router.post(
  '/register',
  authHelper.registerRedirect,
  async (req, res, next) => {
    authHelper
      .createUser(req, res)
      .then(() => {
        passportService.authenticate('local', (err, user) => {
          if (user) {
            handleResponse(res, 201, 'Success');
          } else {
            handleResponse(res, 401, 'User already logged in');
          }
        })(req, res, next);
      })
      .catch(res => {
        handleResponse(res, 500, 'error');
      });
  }
);
// route '/auth/login'
router.post('/login', authHelper.loginRedirect, (req, res, next) => {
  passportService.authenticate('local', async (err, user) => {
    if (err) {
      return res.status(400).json({ message: 'not found' });
    }
    if (user) {
      res.status(201).json({ message: 'logged in' });
    } else {
      res.status(401).json({ message: 'unauthorized' });
    }
  })(req, res, next);
});

router.get('/getuser/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const users = new Users();
    const getUser = await users.getUserByUserName(username);

    logger.info(`get-user: ${username}`);
    return res.json(getUser);
  } catch (err) {
    logger.error(`get-user: ${err.message}`);
    return res.json({ error: err.message });
  }
});

router.get('/users', async (req, res) => {
  const users = new Users();
  try {
    const getUsers = await users.getUser();
    logger.info(`get-users`);
    return res.status(20).json(getUsers);
  } catch (err) {
    logger.error(`get-users: ${err.message}`);
    return res.status(404).json({ error: err.message });
  }
});

router.get('/logout', authHelper.loginRequired, (req, res) => {
  req.logout();

  return handleResponse(res, 200, 'success');
});

// *** helpers *** //

// function handleLogin(req, user) {
//   return new Promise((resolve, reject) => {
//     req.login(user, err => {
//       if (err) reject(err);
//       resolve(req);
//     });
//   });
// }

function handleResponse(res, code, statusMsg) {
  res.status(code).json({ status: statusMsg });
}
export default router;
