const Availability = require("../models/Availability");
const User = require("../models/User");
const createAvailability = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }

    const availability = await Availability.create({
      professor: req.user._id,
      startTime: start,
      endTime: end,
    });

    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getProfessorAvailabilities = async (req, res) => {
  try {
    const professorId = req.params.id;

    const professor = await User.findById(professorId);
    if (!professor || professor.role !== "professor") {
      return res.status(404).json({ message: "Professor not found" });
    }

    const availabilities = await Availability.find({
      professor: professorId,
      isBooked: false,
      startTime: { $gt: new Date() },
    }).sort("startTime");

    res.json(availabilities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAvailability, getProfessorAvailabilities };
