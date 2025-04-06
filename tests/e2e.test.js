const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/User");

const request = supertest(app);

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
    const testDbUri = process.env.MONGO_URI.replace("?", "test?");
    await mongoose.connect(testDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  });

  test("End-to-End Appointment Flow", async () => {
    console.log("1. Student A1 authenticates");
    const registerA1 = await request.post("/api/auth/register").send(studentA1);
    expect(registerA1.status).toBe(201);
    expect(registerA1.body).toHaveProperty("token");

    const tokenA1 = registerA1.body.token;

    console.log("2. Professor P1 authenticates");
    const registerP1 = await request
      .post("/api/auth/register")
      .send(professorP1);
    expect(registerP1.status).toBe(201);
    expect(registerP1.body).toHaveProperty("token");

    const tokenP1 = registerP1.body.token;
    const professorId = registerP1.body._id;

    console.log("3. Professor P1 specifies availability");
    const slot1 = {
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
    };

    const availabilityT1 = await request
      .post("/api/availability")
      .set("Authorization", `Bearer ${tokenP1}`)
      .send(slot1);
    expect(availabilityT1.status).toBe(201);

    const slot2 = {
      startTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 27 * 60 * 60 * 1000),
    };

    const availabilityT2 = await request
      .post("/api/availability")
      .set("Authorization", `Bearer ${tokenP1}`)
      .send(slot2);
    expect(availabilityT2.status).toBe(201);

    console.log("4. Student A1 views available slots");
    const availableSlots = await request
      .get(`/api/availability/professor/${professorId}`)
      .set("Authorization", `Bearer ${tokenA1}`);
    expect(availableSlots.status).toBe(200);
    expect(availableSlots.body.length).toBe(2);

    console.log("5. Student A1 books appointment at T1");
    const bookingA1 = await request
      .post("/api/appointments")
      .set("Authorization", `Bearer ${tokenA1}`)
      .send({
        availabilityId: availabilityT1.body._id,
        professorId: professorId,
      });
    expect(bookingA1.status).toBe(201);

    console.log("6. Student A2 authenticates");
    const registerA2 = await request.post("/api/auth/register").send(studentA2);
    expect(registerA2.status).toBe(201);
    expect(registerA2.body).toHaveProperty("token");

    const tokenA2 = registerA2.body.token;

    console.log("7. Student A2 books appointment at T2");
    const bookingA2 = await request
      .post("/api/appointments")
      .set("Authorization", `Bearer ${tokenA2}`)
      .send({
        availabilityId: availabilityT2.body._id,
        professorId: professorId,
      });
    expect(bookingA2.status).toBe(201);

    const appointmentsBeforeCancel = await request
      .get("/api/appointments/student")
      .set("Authorization", `Bearer ${tokenA1}`);
    expect(appointmentsBeforeCancel.status).toBe(200);
    expect(appointmentsBeforeCancel.body.length).toBe(1);

    console.log("8. Professor P1 cancels appointment with A1");
    const cancelAppointment = await request
      .put(`/api/appointments/${bookingA1.body._id}/cancel`)
      .set("Authorization", `Bearer ${tokenP1}`);
    expect(cancelAppointment.status).toBe(200);

    console.log("9. Student A1 verifies no pending appointments");
    const appointmentsAfterCancel = await request
      .get("/api/appointments/student")
      .set("Authorization", `Bearer ${tokenA1}`);
    expect(appointmentsAfterCancel.status).toBe(200);
    expect(appointmentsAfterCancel.body.length).toBe(0);

    console.log("End-to-End test completed successfully!");
  }, 30000);
});
