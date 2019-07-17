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
      .select({ _id: true, name: true })
      .then(studios => res.send(studios))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Studio  
      .findById(req.params.id)
      .select({ name: true, address: true })
      .then(studio => res.send(studio))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    Studio
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedStudio => res.send(updatedStudio))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Studio
      .findByIdAndDelete(req.params.id)
      .then(studio => res.send(studio))
      .catch(next);
  });


