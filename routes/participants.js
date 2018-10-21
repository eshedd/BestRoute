const express = require('express');
const auth = require('./helpers/auth');
const Trip = require('../models/trip');
const Participant = require('../models/participant');
const participant = require('./participants');

const router = express.Router({ mergeParams: true });

//GET new
router.get('/new', auth.requireLogin, (req, res, next) => {
  Trip.findById(req.params.tripId, function(err, trip) {
    if(err) { console.error(err) };

    res.render('participants/new', { trip: trip });
  });
});

//POST create
router.post('/', auth.requireLogin, (req, res, next) => {
  Trip.findById(req.params.tripId, function(err, trip) {
    if(err) { console.error(err) };

    let participant = new Participant(req.body);
    participant.trip = trip;

    participant.save(function(err, participant) {
      if(err) { console.error(err) };
      return res.redirect(`/trips/${trip._id}`);
    });
  });
});

module.exports = router;
