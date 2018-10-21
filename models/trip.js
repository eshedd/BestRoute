const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  title: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User'}],
});

const Trip = mongoose.model('Trip', TripSchema);
module.exports = Trip;
