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
        name: 'Mr. Wrong',
        company: 'jerk inc.'
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          name: 'Mr. Wrong',
          company: 'jerk inc.'
        });
      });
  });

  it('can GET all reviewers', async() => {
    const reviewers = await Reviewer.create([
      { name: 'Mr. Wrong', company: ' jerk inc.' },
      { name: 'Ted', company: 'OpinionaTED' },
      { name: 'Y', company: 'Y Do I Care' }
    ]);
    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        const reviewersJSON = JSON.parse(JSON.stringify(reviewers));
        reviewersJSON.forEach(reviewer => {
          expect(res.body).toContainEqual({ name: reviewer.name, company: reviewer.company, _id: reviewer._id });
        }); 
      });
  });

  it('can GET a reviewer by id', async() => {
    const reviewer = await Reviewer.create({ 
      name: 'Mr. Wrong',
      company: 'jerk inc.' 
    });
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Mr. Wrong',
          company: 'jerk inc.'
        });
      });
  });

  it('can update with PUT', async() => {
    const reviewer = await Reviewer.create({ 
      name: 'Mr. Wrong',
      company: 'jerk inc.' 
    });
    return request(app)
      .put(`/api/v1/reviewers/${reviewer._id}`)
      .send({ name: 'Ted', company: 'OpinionaTED' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Ted',
          company: 'OpinionaTED'
        });
      });
  });




});



