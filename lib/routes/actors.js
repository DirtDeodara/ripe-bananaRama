const { Router } = require('express');
const Actor = require('../models/ActorSchema');


module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      dob,
      pob
    } = req.body;

    Actor
      .create({
        name,
        dob,
        pob
      })
      .then(createdActor => {
        res.send(createdActor);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Actor
      .find()
      .select({ _id: true, name: true })
      .then(actors => res.send(actors))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Actor  
      .findById(req.params.id)
      .select({ __v: false })
      .then(actor => res.send(actor))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    Actor
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .select({ __v: false })
      .then(updatedActor => res.send(updatedActor))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Actor
      .findByIdAndDelete(req.params.id)
      .select({ __v: false })
      .then(actor => res.send(actor))
      .catch(next);
  });

