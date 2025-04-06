const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const User = require('../models/User');

const bookAppointment = async (req, res) => {
  try {
    const { availabilityId, professorId } = req.body;
    
    const professor = await User.findById(professorId);
    if (!professor || professor.role !== 'professor') {
      return res.status(404).json({ message: 'Professor not found' });
    }

    const availability = await Availability.findOne({ 
      _id: availabilityId,
      professor: professorId,
      isBooked: false 
    });

    if (!availability) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    const appointment = await Appointment.create({
      student: req.user._id,
      professor: professorId,
      availability: availabilityId
    });

    availability.isBooked = true;
    await availability.save();

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.professor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    const availability = await Availability.findById(appointment.availability);
    if (availability) {
      availability.isBooked = false;
      await availability.save();
    }

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ 
      student: req.user._id,
      status: 'scheduled'
    })
    .populate('professor', 'name email')
    .populate('availability', 'startTime endTime');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookAppointment, cancelAppointment, getStudentAppointments };