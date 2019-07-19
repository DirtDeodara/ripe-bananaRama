const { Router } = require('express');
const Studio = require('../models/StudioSchema');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      address,
    } = req.body;

    Studio
      .create({
        name,
        address
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
      .findByIdWithFilms(req.params.id)
      .then(studioWithFilms => res.send(studioWithFilms))
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
      .findByIdWithFilms(req.params.id)
      .then(studio => {
        if(studio.films.length === 0) {
          Studio
            .findByIdAndDelete(req.params.id)
            .then(studio => res.send(studio));
        } else {
          const err = new Error('Cannot delete this studio');
          err.status = 409;
          next(err);
        }
      })
      .catch(next);
  });


