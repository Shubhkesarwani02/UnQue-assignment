Here’s a clean and informative `README.md` for your project:

````markdown
# 🎓 College Appointment Booking System

A backend API built with **Node.js**, **Express**, and **MongoDB** that enables students to book appointments with professors. The system allows authentication, slot management, and appointment handling. Includes an automated end-to-end (E2E) test case.

## 📁 Repository

[GitHub Repository](https://github.com/Shubhkesarwani02/UnQue-assignment)

---

## 📌 Features

- User Authentication (Students & Professors)
- Professor availability management
- Appointment booking & cancellation
- View available slots
- E2E test case simulating full appointment flow

---

## 📖 User Flow

1. **Student A1** logs in to access the system.
2. **Professor P1** logs in to access the system.
3. **Professor P1** sets available time slots.
4. **Student A1** views available slots for **Professor P1**.
5. **Student A1** books an appointment for time **T1**.
6. **Student A2** logs in.
7. **Student A2** books an appointment for time **T2**.
8. **Professor P1** cancels the appointment with **Student A1**.
9. **Student A1** checks appointments and sees none are pending.

---

## 🗃️ Database Schema

- **Users Collection**

  - Roles: Student, Professor
  - Fields: Name, Email, Password, Role

- **Availability Collection**

  - Professor reference
  - Available time slots

- **Appointments Collection**
  - Student & Professor references
  - Booked time
  - Status (booked/cancelled)

---

## 🧪 Testing

Includes an **E2E test case** (`tests/e2e.test.js`) using **Jest** and **Supertest**, with **mongodb-memory-server** for in-memory test DB.

Run tests:

```bash
npm test
```
````

---

## 🚀 Getting Started

### 📦 Install Dependencies

```bash
npm install
```

### ⚙️ Setup Environment

Create a `.env` file:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=your_jwt_secret_key
```

### ▶️ Start Server

```bash
npm run dev
```

---

## 📂 Project Structure

```
college-appointment-system/
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   ├── Availability.js
│   └── Appointment.js
├── controllers/
│   ├── authController.js
│   ├── availabilityController.js
│   └── appointmentController.js
├── routes/
│   ├── authRoutes.js
│   ├── availabilityRoutes.js
│   └── appointmentRoutes.js
├── middleware/
│   └── auth.js
├── tests/
│   └── e2e.test.js
├── .env
├── app.js
├── server.js
└── package.json
```

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Auth**: JWT + bcrypt
- **Testing**: Jest, Supertest, mongodb-memory-server

---

## 📃 License

This project is licensed for educational and evaluation use.

---

## ✍️ Author

**Shubh Kesarwani**  
🔗 [GitHub](https://github.com/Shubhkesarwani02)

```

Let me know if you'd like to add API documentation (like sample requests/responses), or deploy instructions.
```
