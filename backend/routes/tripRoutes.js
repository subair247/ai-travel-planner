const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateNewTrip, getUserTrips, updateTrip } = require('../controllers/tripController');

router.post('/', auth, generateNewTrip);
router.get('/', auth, getUserTrips);
router.put('/:id', auth, updateTrip);

module.exports = router;