require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const app = require('../lib/app');
const Reviewer = require('../lib/models/ReviewerSchema');

describe('reviewer routes tests', () => {

  beforeAll(() => {
    connect();
  });
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can POST a new studio', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({
        name: 'Mr. Opinion',
        company: 'Talk2Much'
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          name: 'Mr. Opinion',
          company: 'Talk2Much'
        });
      });
  });


});



