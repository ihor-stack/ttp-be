import 'dotenv/config';
import cors from 'cors';
const request = require('supertest');

import prePlannerRouter from '../routes/event';

describe('Preplanner', function () {
  it('responds with expected JSON structure', function (done) {
    request('https://jsonplaceholder.typicode.com/preplanner/')
      // .get('/preplanner')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});
