require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const app = require('../lib/app');
const Actor = require('../lib/models/ActorSchema');
const Studio = require('../lib/models/StudioSchema');
const Film = require('../lib/models/FilmSchema');

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
        pob: 'Humboldt, CA'
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          name: 'Havard Forestborn',
          dob: '2010-06-06T00:00:00.000Z',
          pob: 'Humboldt, CA'
        });
      });
  });

  it('can GET all actors', async() => {
    const actors = await Actor.create([
      { name: 'Havard Forestborn', dob: '2010-06-06', pob: 'Humboldt, CA' },
      { name: 'Nerd Bomb', dob: '1982-05-14', pob: 'Rochester, NY' },
      { name: 'Maxwell Buttercup Kitty', dob: '2015-08-08', pob: 'Not sure' }
    ]);
    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        const actorsJSON = JSON.parse(JSON.stringify(actors));
        actorsJSON.forEach(actor => {
          expect(res.body).toContainEqual({ name: actor.name, _id: actor._id });
        });
      });
  });

  it('can GET a actor by id', async() => {
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

    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Havard Forestborn',
          dob: '2010-06-06T00:00:00.000Z',
          pob: 'Humboldt, CA',
          films: [{ _id: film._id.toString(), title: film.title, released: film.released }]
        });
      });
  });

  it('can update a studio with PUT', async() => {
    const actor = await Actor.create({
      name: 'Havard Forestborn',
      dob: '2010-06-06',
      pob: 'Humboldt, CA'
    });
    return request(app)
      .put(`/api/v1/actors/${actor._id}`)
      .send({
        name: 'Nerd Bomb',
        dob: '1982-05-14',
        pob: 'Rochester, NY'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Nerd Bomb',
          dob: '1982-05-14T00:00:00.000Z',
          pob: 'Rochester, NY'
        });
      });
  });

  it('can DELETE a actor', async() => {
    const actor = await Actor.create({
      name: 'Nerd Bomb',
      dob: '1982-05-14',
      pob: 'Rochester, NY'
    });
    return request(app)
      .delete(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Nerd Bomb',
          dob: '1982-05-14T00:00:00.000Z',
          pob: 'Rochester, NY'
        });
      });
  });



});


