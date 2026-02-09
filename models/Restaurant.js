const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema(
  {},
  {
    collection: 'restaurants',
    strict: false,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

RestaurantSchema.virtual('id').get(function () {
  return this._id ? this._id.toString() : undefined;
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
