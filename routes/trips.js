const express = require('express');
const auth = require('./helpers/auth');
const Trip = require('../models/trip');

const router = express.Router();

// Trips index
router.get('/', (req, res) => {
  Trip.find({}, 'title', (err, trips) => {
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
  // TODO
});

// Trips create
router.post('/', auth.requireLogin, (req, res) => {
  let trip = new Trip(req.body);

  trip.save((err, folder) => {
    if (err) { console.error(err); }
    return res.redirect('/trips');
  });
});

module.exports = router;
