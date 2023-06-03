const request = require('supertest');
const assert = require('assert');
const express = require('express');
import 'dotenv/config';
const app = require('../../server');

const user =
{
  username: 'ABCDEF',
  password: '12345678',
};

describe('auth routes', () => {
  it('register', async () => {
    const res = await request(app).post('/auth/register').send(user)
    .expect(201).expect({"status":"Success"});
  });

  it('login', async () => {
    const res = await request(app).post('/auth/login').send(user)
    .expect(201).expect({"message": "logged in"});
  });
  it('get-user', async () => {
         const res = await request(app).get('/auth/getuser/:username')
         .expect(200);
       });
});
