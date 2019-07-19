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

  it('can POST a new film', () => {
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

  it('can GET all films', async() => {
    const films = await Film.create([
      { title: 'Life of Harvey', studio: studio._id, released: 2020, cast: { role: 'The Dog', actor: actors[0]._id } },
      { title: 'Life of Harvey 2', studio: studio._id, released: 2023, cast: { role: 'The Dog', actor: actors[0]._id } }
    ]);
    return request(app)
      .get('/api/v1/films')
      .then(res => {
        const filmsJSON = JSON.parse(JSON.stringify(films));
        filmsJSON.forEach(film => {
          expect(res.body).toContainEqual({ _id: expect.any(String), title: film.title, studio: { _id: studio._id, name: studio.name }, released: film.released });
        });
      });
  });

  it('can GET a film by id', async() => {
    const film = await Film.create({ title: 'Life of Harvey', studio: studio._id, released: 2020, cast: { role: 'The Dog', actor: actors[0]._id } });
    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body).toEqual({ 
          title: 'Life of Harvey', 
          studio: { _id: studio._id, name: studio.name },
          released: 2020, 
          cast: [{ _id: expect.any(String), role: 'The Dog', actor: { _id: actors[0]._id.toString(), name: actors[0].name } }] });
      });
  });

  it('can DELETE a film', async() => {
    const film = await Film.create({ title: 'Life of Harvey', studio: studio._id, released: 2020, cast: { role: 'The Dog', actor: actors[0]._id } });
    return request(app)
      .delete(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body.title).toEqual('Life of Harvey');
      });
  });
  

});
