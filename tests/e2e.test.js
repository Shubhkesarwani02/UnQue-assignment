const mongoose = require("mongoose");
const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const User = require("../models/User");

// Create request object
const request = supertest(app);

// In-memory MongoDB instance
let mongoServer;

// Test user data
const studentA1 = {
  name: "Student A1",
  email: "student1@example.com",
  password: "password123",
  role: "student",
};

const studentA2 = {
  name: "Student A2",
  email: "student2@example.com",
  password: "password123",
  role: "student",
};

const professorP1 = {
  name: "Professor P1",
  email: "professor1@example.com",
  password: "password123",
  role: "professor",
};

describe("College Appointment System E2E Test", () => {
  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect to in-memory database
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Disconnect and stop MongoDB server
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Clear data between tests
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("End-to-End Appointment Flow", async () => {
    // 1. Student A1 authenticates to access the system
    console.log("1. Student A1 authenticates");
    const registerA1 = await request.post("/api/auth/register").send(studentA1);
    expect(registerA1.status).toBe(201);
    expect(registerA1.body).toHaveProperty("token");

    const tokenA1 = registerA1.body.token;

    // 2. Professor P1 authenticates to access the system
    console.log("2. Professor P1 authenticates");
    const registerP1 = await request
      .post("/api/auth/register")
      .send(professorP1);
    expect(registerP1.status).toBe(201);
    expect(registerP1.body).toHaveProperty("token");

    const tokenP1 = registerP1.body.token;
    const professorId = registerP1.body._id;

    // 3. Professor P1 specifies availability
    console.log("3. Professor P1 specifies availability");
    // Create two time slots: T1 and T2
    const slot1 = {
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(Date.now() + 25 * 60 * 60 * 1000), // Tomorrow + 1 hour
    };

    const availabilityT1 = await request
      .post("/api/availability")
      .set("Authorization", `Bearer ${tokenP1}`)
      .send(slot1);
    expect(availabilityT1.status).toBe(201);

    const slot2 = {
      startTime: new Date(Date.now() + 26 * 60 * 60 * 1000), // Tomorrow + 2 hours
      endTime: new Date(Date.now() + 27 * 60 * 60 * 1000), // Tomorrow + 3 hours
    };

    const availabilityT2 = await request
      .post("/api/availability")
      .set("Authorization", `Bearer ${tokenP1}`)
      .send(slot2);
    expect(availabilityT2.status).toBe(201);

    // 4. Student A1 views available time slots for Professor P1
    console.log("4. Student A1 views available slots");
    const availableSlots = await request
      .get(`/api/availability/professor/${professorId}`)
      .set("Authorization", `Bearer ${tokenA1}`);
    expect(availableSlots.status).toBe(200);
    expect(availableSlots.body.length).toBe(2);

    // 5. Student A1 books an appointment with Professor P1 for time T1
    console.log("5. Student A1 books appointment at T1");
    const bookingA1 = await request
      .post("/api/appointments")
      .set("Authorization", `Bearer ${tokenA1}`)
      .send({
        availabilityId: availabilityT1.body._id,
        professorId: professorId,
      });
    expect(bookingA1.status).toBe(201);

    // 6. Student A2 authenticates to access the system
    console.log("6. Student A2 authenticates");
    const registerA2 = await request.post("/api/auth/register").send(studentA2);
    expect(registerA2.status).toBe(201);
    expect(registerA2.body).toHaveProperty("token");

    const tokenA2 = registerA2.body.token;

    // 7. Student A2 books an appointment with Professor P1 for time T2
    console.log("7. Student A2 books appointment at T2");
    const bookingA2 = await request
      .post("/api/appointments")
      .set("Authorization", `Bearer ${tokenA2}`)
      .send({
        availabilityId: availabilityT2.body._id,
        professorId: professorId,
      });
    expect(bookingA2.status).toBe(201);

    // Student A1 checks appointments (should see one)
    const appointmentsBeforeCancel = await request
      .get("/api/appointments/student")
      .set("Authorization", `Bearer ${tokenA1}`);
    expect(appointmentsBeforeCancel.status).toBe(200);
    expect(appointmentsBeforeCancel.body.length).toBe(1);

    // 8. Professor P1 cancels the appointment with Student A1
    console.log("8. Professor P1 cancels appointment with A1");
    const cancelAppointment = await request
      .put(`/api/appointments/${bookingA1.body._id}/cancel`)
      .set("Authorization", `Bearer ${tokenP1}`);
    expect(cancelAppointment.status).toBe(200);

    // 9. Student A1 checks appointments (should see none)
    console.log("9. Student A1 verifies no pending appointments");
    const appointmentsAfterCancel = await request
      .get("/api/appointments/student")
      .set("Authorization", `Bearer ${tokenA1}`);
    expect(appointmentsAfterCancel.status).toBe(200);
    expect(appointmentsAfterCancel.body.length).toBe(0);

    console.log("End-to-End test completed successfully!");
  }, 30000); // Increased timeout for the complete flow
});