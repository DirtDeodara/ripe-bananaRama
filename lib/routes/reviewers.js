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

  .get('/', (req, res, next) => {
    Reviewer
      .find()
      .select({ __v: false })
      .then(reviewers => res.send(reviewers))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Reviewer
      .findById(req.params.id)
      .select({ __v: false })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })
