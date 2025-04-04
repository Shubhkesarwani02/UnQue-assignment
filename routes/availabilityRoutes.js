const express = require('express');
const router = express.Router();
const { createAvailability, getProfessorAvailabilities } = require('../controllers/availabilityController');
const { protect, isProfessor } = require('../middleware/auth');

router.post('/', protect, isProfessor, createAvailability);
router.get('/professor/:id', protect, getProfessorAvailabilities);

module.exports = router;