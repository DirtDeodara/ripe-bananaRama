const { Router } = require('express');
const Film = require('../models/FilmSchema');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      title,
      studio,
      released,
      cast
    } = req.body;

    Film
      .create({
        title,
        studio,
        released,
        cast
      })
      .then(createdFilm => {
        res.send(createdFilm);
      })
      .catch(next);
  });

