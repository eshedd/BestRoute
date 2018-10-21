const express = require('express');
const auth = require('./helpers/auth');
const Trip = require('../models/trip');
const Participant = require('../models/participant');
const participants = require('./participants');

const router = express.Router();

// Trips index
router.get('/', (req, res) => {
  Trip.find({users: res.locals.currentUserId}).sort({ date: -1 }).exec(function(err, trips) {

    if (err) {
      console.error(err);
    } else {
      res.render('trips/index', { trips: trips });
    }
  });
});

// Trips new
router.get('/new', auth.requireLogin, (req, res, next) => {
  res.render('trips/new');
});

// Trips show
router.get('/:id', auth.requireLogin, (req, res, next) => {
  Trip.findById(req.params.id, function(err, trip) {
    if(err) { console.error(err) };

    console.log("HERE")
     Participant.find({ trip: trip }, function(err, participants) {
          if(err) { console.error(err) };
          console.log("HELLO")
          let locations = [];
          participants.forEach(participant => {
            locations.push(participant.address);
            console.log("CHECK")
          })
          console.log(locations);


    res.render('trips/show', { trip, participants: participants, maps: maps, testGeometry: JSON.stringify(maps.getGeometry(maps.geocodes(locations)))});

    });
  });
});

// Trips create
router.post('/', auth.requireLogin, (req, res) => {
  let trip = new Trip(req.body);

  trip.save((err, trip) => {
    if (err) { console.error(err); }
    return res.redirect(`/trips/${trip._id}`);
  });
});

router.use('/:tripId/participants', participants);

module.exports = router;
