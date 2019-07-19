const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    city: String,
    state: String,
    country: String
  }
});

studioSchema.statics.findByIdWithFilms = function(id) {
  return Promise.all([
    this.findById(id).select({ name: true, address: true }),
    this.model('Film').find({ studio: id }).select({ _id: true, title: true })
  ])
    .then(([studio, films]) => ({
      ...studio.toJSON(),
      films
    }));
  
};

module.exports = mongoose.model('Studio', studioSchema);
