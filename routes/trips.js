const express = require('express');
const auth = require('./helpers/auth');
const Trip = require('../models/trip');
const Participant = require('../models/participant');
const participants = require('./participants');
const maps = require('../maps/maps.js');
const User = require('../models/user');

const router = express.Router();

// Trips index
router.get('/', (req, res) => {
  Trip.find({users: res.locals.currentUserId}).sort({ date: -1 }).exec(function(err, trips) {
  // Trip.find({}, 'title', (err, trips) => {
    if (err) {
      console.error(err);
    } else {
      res.render('trips/index', { trips: trips });
    }
  });
});

// Trips new
router.get('/new', auth.requireLogin, (req, res, next) => {
  User.findById(req.params.userId, function(err, trip) {
    if(err) { console.error(err);}

    res.render('trips/new');
  });
});

// Trips show
router.get('/:id', auth.requireLogin, (req, res, next) => {
  Trip.findById(req.params.id, function(err, trip) {
    if(err) { console.error(err) };

     Participant.find({ trip: trip }, function(err, participants) {
          if(err) { console.error(err) };

    res.render('trips/show', { trip, participants: participants, maps: maps, testGeometry: maps.getGeometry(maps.geocodes(['1 parklane dr orinda', 'palo alto', 'miramonte high school', 'oakland', 'piedmont', 'berkeley']))});
    });
  });
});

// Trips create
router.post('/', auth.requireLogin, (req, res) => {
  let trip = new Trip(req.body);
  trip.users.push(req.session.userId);

  trip.save((err, trip) => {
    if (err) { console.error(err); }
    return res.redirect(`/trips/${trip._id}`);
  });
});

router.use('/:tripId/participants', participants);

module.exports = router;
