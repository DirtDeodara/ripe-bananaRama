const mongoose = require('mongoose');

const reviewerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  }
});

reviewerSchema.statics.findByIdWithReviewer = function(id) {
  return Promise.all([
    this.findById(id).select({ __v: false }),
    this.model('Review').find({ reviewer: id }).populate('film', { _id: true, title: true }).select({ _id: true, rating: true, review: true, film: true })
  ])
    .then(([reviewer, reviews]) => ({
      ...reviewer.toJSON(),
      reviews
    }));
  
};

module.exports = mongoose.model('Reviewer', reviewerSchema);
