const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParticipantSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  trip: { type: Schema.Types.ObjectId, ref: 'Trip'}
});

module.exports = mongoose.model('Participant', ParticipantSchema);
