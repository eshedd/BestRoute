const express = require('express');
const auth = require('./helpers/auth');
const Room = require('../models/trip');

const router = express.Router();

// Trips new
router.get('/new', auth.requireLogin, (req, res, next) => {
  res.render('trips/new');
});

// Trips show
router.get('/:id', auth.requireLogin, (req, res, next) => {
  // TODO
});

// // Trips create
// router.post('/', auth.requireLogin, (req, res, next) => {
//   let trip = new Trip(req.body);
//
//   trip.save(function(err, trip) {
//     if(err) { console.error(err) };
//
//     return res.redirect('/');
//   });
// });

// Trips create
router.post('/', auth.requireLogin, (req, res, next) => {
  let trip = new Trip(req.body);

  trip.save(function(err, trip) {
    if(err) console.log(err);
    return res.redirect('/new');
  });
})

module.exports = router;
