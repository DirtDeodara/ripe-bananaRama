require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const app = require('../lib/app');
const Studio = require('../lib/models/StudioSchema');

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
          expect(res.body).toContainEqual(studio);
        });
      });
  });

  it('can GET a studio by id', async() => {
    const studio = await Studio.create({
      name: 'Ursa Major',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'USA'
      }
    });
    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        const studioJSON = JSON.parse(JSON.stringify(studio));
        expect(res.body).toEqual({ ...studioJSON });
      });
  });

  it('can update a studio with PUT', async() => {
    const studio = await Studio.create({
      name: 'Ursa Major',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'USA'
      }
    });
    return request(app)
      .put(`/api/v1/studios/${studio._id}`)
      .send({
        name: 'Ursa Minor',
        address: {
          city: 'Rochester',
          state: 'NY',
          country: 'USA'
        }
      })
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
