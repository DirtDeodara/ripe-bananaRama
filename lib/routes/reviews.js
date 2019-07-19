const { Router } = require('express');
const Review = require('../models/ReviewSchema');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      rating,
      reviewer,
      review,
      film
    } = req.body;

    Review
      .create({
        rating,
        reviewer,
        review,
        film
      })
      .then(createdReview => {
        res.send(createdReview);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Review  
      .find()
      .limit(100)
      .then(review => res.send(review))
      .catch(next);
  })

  