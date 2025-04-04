const Availability = require('../models/Availability');
const User = require('../models/User');

// @desc    Create a new availability slot
// @route   POST /api/availability
// @access  Private/Professor
const createAvailability = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    
    // Validate times
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const availability = await Availability.create({
      professor: req.user._id,
      startTime: start,
      endTime: end
    });

    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get professor's availabilities
// @route   GET /api/availability/professor/:id
// @access  Private
const getProfessorAvailabilities = async (req, res) => {
  try {
    const professorId = req.params.id;
    
    // Check if professor exists
    const professor = await User.findById(professorId);
    if (!professor || professor.role !== 'professor') {
      return res.status(404).json({ message: 'Professor not found' });
    }

    // Get available slots
    const availabilities = await Availability.find({ 
      professor: professorId,
      isBooked: false,
      startTime: { $gt: new Date() } // Only future slots
    }).sort('startTime');

    res.json(availabilities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAvailability, getProfessorAvailabilities };