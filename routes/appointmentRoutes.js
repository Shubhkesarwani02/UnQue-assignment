const express = require('express');
const router = express.Router();
const { 
  bookAppointment, 
  cancelAppointment, 
  getStudentAppointments 
} = require('../controllers/appointmentController');
const { protect, isProfessor, isStudent } = require('../middleware/auth');

router.post('/', protect, isStudent, bookAppointment);
router.put('/:id/cancel', protect, isProfessor, cancelAppointment);
router.get('/student', protect, isStudent, getStudentAppointments);

module.exports = router;