require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const app = require('../lib/app');
const Film = require('../lib/models/FilmSchema');
const Actor = require('../lib/models/ActorSchema');
const Studio = require('../lib/models/StudioSchema');

describe('film routes tests', () =>  {

  beforeAll(() => {
    connect();
  });
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let actors = null;
  let studio = null;
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Ursa Major', address: { city: 'Portland', state: 'Oregon', country: 'USA' } })));
    actors = await Actor.create([
      { name: 'Havard Forestborn', dob: '2010-06-06', pob: 'Humboldt, CA' },
      { name: 'Nerd Bomb', dob: '1982-05-14', pob: 'Rochester, NY' },
      { name: 'Maxwell Buttercup Kitty', dob: '2015-08-08', pob: 'Not sure' }
    ]);
    actors.forEach(actor => {
      JSON.parse(JSON.stringify(actor));
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('POST a new film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({ 
        title: 'Life of Harvey',
        studio: studio._id, 
        released: 2020,
        cast: [{ role: 'The Dog', actor: actors[0]._id }] 
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          title: 'Life of Harvey',
          studio: expect.any(String),
          released: 2020,
          cast: [{ role: 'The Dog', actor: expect.any(String), _id: expect.any(String) }]
        });
      });
  });

  

});
