const { Router } = require('express');
const Studio = require('../models/StudioSchema');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      address: {
        city,
        state,
        country
      }
    } = req.body;

    Studio
      .create({
        name,
        address: {
          city,
          state,
          country
        }
      })
      .then(createdStudio => {
        res.send(createdStudio);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Studio
      .find()
      .then(studios => res.send(studios))
      .catch(next);
  })



