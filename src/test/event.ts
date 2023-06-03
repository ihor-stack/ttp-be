const request = require('supertest');
const assert = require('assert');
const express = require('express');
import 'dotenv/config';
const app = require('../../server');

const data = {
  "id": "event1",
  "title": "Josie and Jared’s Wedding Rehearsal, Ceremony and Reception",
  "roomName": "Ballro",
  "roomWidth": 17,
  "roomLength": 20,
  "floorplan": "upper",
  "furniture": "table",
  "addedBy": "user1",
  "timezone": "PST",
  "favourite": true,
  "startDate": "2022-06-16 00:45:00.000 +0200",
  "endDate": "2022-06-16 00:45:00.000 +0200",
  "createdDate": "2022-06-16 00:45:00.000 +0200",
  "updatedDate": "2022-06-16 00:45:00.000 +0200"
};
const dataId = "event1";
describe('event routes', () => {
  it('save event', async () => {
    const res =  await request(app).post('/event/save-event').send(data).expect(201);
  });
  it('update-room-dimensions', async () => {
    const res = await request(app).post('/event/update-room-dimensions/:id' + dataId).send(data).expect(200);
  });
  it('update event', async () => {
    const res = await request(app).put('/event/update-event/:id' + dataId).send(data).expect(201);
  });
  it('duplicate event', async () => {
    const res = await request(app).post('/event/duplicate-event:id' + dataId).send(data).expect(200);
  });
  it('delete event', async () => {
    const res = await request(app).delete('/event/delete-event:id' + dataId).expect(200);
  });
  it('favorite event', async () => {
    const res = await request(app).put('/event/favorite-event/:id' + dataId).send(data).expect(201);
  });
  it('unfavorite', async () => {
    const res = await request(app).put('/event/unfavorite-event/:id' + dataId).send(data).expect(201);
  });
  it('get events', async () => {
    const res = await request(app).get('/event/get-events').expect(200);
  });
});