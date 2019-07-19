require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const app = require('../lib/app');
const Studio = require('../lib/models/StudioSchema');
const Film = require('../lib/models/FilmSchema');

describe('studio routes tests', () => {

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
      .post('/api/v1/studios')
      .send({
        name: 'Ursa Major',
        address: {
          city: 'Portland',
          state: 'Oregon',
          country: 'USA'
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          name: 'Ursa Major',
          address: {
            city: 'Portland',
            state: 'Oregon',
            country: 'USA'
          }
        });
      });
  });

  it('can GET all studios', async() => {
    const studios = await Studio.create([
      { name: 'Ursa Major', address: { city: 'Portland', state: 'Oregon', country: 'USA' } },
      { name: 'Snore Studios', address: { city: 'Sleepyville', state: 'Pillowtonia', country: 'Snore' } },
      { name: 'Studio Infinity', address: { city: 'here', state: 'there', country: 'everywhere' } }
    ]);
    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        const studiosJSON = JSON.parse(JSON.stringify(studios));
        studiosJSON.forEach(studio => {
          expect(res.body).toContainEqual({ name: studio.name, _id: studio._id });
        });
      });
  });

  it('can GET a studio by id', async() => {
    const studio = await Studio.create({ name: 'Ursa Major', address: { city: 'Portland', state: 'Oregon', country: 'USA' } });
    const film = await Film.create({ title: 'Life of Harvey', studio, released: 2020 });
    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Ursa Major',
          address: {
            city: 'Portland',
            state: 'Oregon',
            country: 'USA'
          },
          films: [{ _id: film._id.toString(), title: film.title }]
        });
      });
  });

  it('can DELETE a studio', async() => {
    const studio = await Studio.create({
      name: 'Ursa Minor',
      address: {
        city: 'Rochester',
        state: 'NY',
        country: 'USA'
      }
    });
    return request(app)
      .delete(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          name: 'Ursa Minor',
          address: {
            city: 'Rochester',
            state: 'NY',
            country: 'USA'
          }
        });
      });
  });


});
