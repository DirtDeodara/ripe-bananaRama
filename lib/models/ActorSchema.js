const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dob: Date,
  pob: String
});

actorSchema.statics.findByIdWithActors = function(id) {
  return Promise.all([
    this.findById(id).select({ __v: false }),
    this.model('Film').find({ 'cast.actor': id }).select({ _id: true, title: true, released: true })
  ])
    .then(([actor, films]) => {
      return {
        ...actor.toJSON(),
        films
      };
    });
  
};

module.exports = mongoose.model('Actor', actorSchema);
