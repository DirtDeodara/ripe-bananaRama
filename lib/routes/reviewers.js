const { Router } = require('express');
const Reviewer = require('../models/ReviewerSchema');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      company
    } = req.body;

    Reviewer  
      .create({
        name,
        company
      })
      .then(createdReview => {
        res.send(createdReview);
      })
      .catch(next);
  })

  