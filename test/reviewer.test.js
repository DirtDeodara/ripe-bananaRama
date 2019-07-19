require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const app = require('../lib/app');
const Reviewer = require('../lib/models/ReviewerSchema');
const Review = require('../lib/models/ReviewSchema');
const Actor = require('../lib/models/ActorSchema');
const Studio = require('../lib/models/StudioSchema');
const Film = require('../lib/models/FilmSchema');

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
    
    const actor = await Actor.create({
      name: 'Havard Forestborn',
      dob: '2010-06-06',
      pob: 'Humboldt, CA'
    });
    
    const studio = await Studio.create({
      name: 'Ursa Major',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'USA'
      }
    });

    const film = await Film.create({
      title: 'Life of Harvey',
      studio: studio._id,
      released: 2020,
      cast: [{
        role: 'The Dog',
        actor: actor._id
      }]
    });

    const review = await Review.create({
      rating: 3,
      reviewer: reviewer._id,
      review: 'this shit was lit. i mean litter. like garbage.',
      film: film._id
    });



    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Mr. Wrong',
          company: 'jerk inc.',
          reviews: [{
            _id: review._id.toString(),
            rating: review.rating,
            review: review.review,
            film: {
              _id: film._id.toString(),
              title: film.title
            }
          }]
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



