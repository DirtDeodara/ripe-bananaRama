const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Studio',
    required: true
  },
  released: {
    type: Number,
    required: true
  },
  cast: [{
    role: String,
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Actor',
      required: true
    }
  }]
});

filmSchema.statics.findByIdWithReviews = function(id) {
  return Promise.all([
    this.findById(id).select({ __v: false, _id: false }).populate('studio', { name: true, _id: true }).populate('cast.actor', { name: true, _id: true }),
    this.model('Review').find({ film: id }).populate('reviewer', { _id: true, name: true }).select({ _id: true, rating: true, review: true })
  ])
    .then(([films, reviews]) => ({
      ...films.toJSON(),
      reviews
    }));
  
};

module.exports = mongoose.model('Film', filmSchema);
