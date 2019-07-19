require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const app = require('../lib/app');
const Film = require('../lib/models/FilmSchema');
const Actor = require('../lib/models/ActorSchema');
const Studio = require('../lib/models/StudioSchema');
const Reviewer = require('../lib/models/ReviewerSchema');


describe('review routes tests', () => {
  
  beforeAll(() => {
    connect();
  });
  
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let actor = null;
  let film = null;
  let studio = null;
  let reviewer = null;

  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Ursa Major', address: { city: 'Portland', state: 'Oregon', country: 'USA' } })));
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Havard Forestborn', dob: '2010-06-06', pob: 'Humboldt, CA'  })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Life of Harvey', studio: studio._id, released: 2020, cast: { role: 'The Dog', actor: actor._id } })));
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'Mr. Wrong', company: ' jerk inc.' })));
  });
  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can POST a new review', () => {
    return request(app)
      .post('/api/v1/reviews')
      .send({
        rating: 1,
        reviewer: reviewer._id.toString(),
        review: 'Worst movie ever',
        film: film._id.toString()
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          rating: 1,
          reviewer: expect.any(String),
          review: 'Worst movie ever',
          film: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        });
      });
  });

});

