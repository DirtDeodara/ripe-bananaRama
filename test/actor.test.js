require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const app = require('../lib/app');
const Actor = require('../lib/models/ActorSchema');

describe('actor route tests', () => {

  beforeAll(() => {
    connect();
  });
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can POST a new actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({
        name: 'Havard Forestborn',
        dob: '2010-06-06',
        pob: 'Humbolt, CA'
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          name: 'Havard Forestborn',
          dob: '2010-06-06T00:00:00.000Z',
          pob: 'Humbolt, CA'
        });
      });
  });




});


