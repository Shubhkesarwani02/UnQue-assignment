# College Appointment System

A backend API system built with Node.js, Express, and MongoDB that enables students to book appointments with professors. This system allows professors to specify their availability, manage bookings, and students to authenticate, view available slots, and book appointments.

## Project Overview

This project implements a RESTful API for a college appointment booking system with the following features:
- User authentication (for both students and professors)
- Professor availability management
- Appointment booking and cancellation
- E2E testing to validate the full user flow

## File Structure

```
college-appointment-system/
├── config/
│   └── db.js                  # Database connection configuration
├── models/
│   ├── User.js                # User model (students and professors)
│   ├── Availability.js        # Professor availability model
│   └── Appointment.js         # Appointment model
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── availabilityController.js  # Availability management
│   └── appointmentController.js   # Appointment management
├── routes/
│   ├── authRoutes.js          # Authentication routes
│   ├── availabilityRoutes.js  # Availability routes
│   └── appointmentRoutes.js   # Appointment routes
├── middleware/
│   └── auth.js                # Authentication middleware
├── tests/
│   └── e2e.test.js            # E2E test for the required flow
├── .env                       # Environment variables
├── app.js                     # Express app setup
├── server.js                  # Server entry point
└── package.json               # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB Atlas account or local MongoDB instance
- Postman or ThunderClient(for manual API testing)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Shubhkesarwani02/UnQue-assignment.git
   cd college-appointment-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=<your_port>
   MONGO_URI=<your_mongodb_uri>
   JWT_SECRET=your_secret_key
   ```

4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- **Register User**
  - `POST /api/auth/register`
  - Body: `{ name, email, password, role }`
  - Role can be either "student" or "professor"

- **Login User**
  - `POST /api/auth/login`
  - Body: `{ email, password }`

### Availability

- **Add Availability (Professor only)**
  - `POST /api/availability`
  - Body: `{ startTime, endTime }`
  - Requires authentication token

- **Get Professor's Available Slots**
  - `GET /api/availability/professor/:professorId`
  - Requires authentication token

### Appointments

- **Book Appointment (Student only)**
  - `POST /api/appointments`
  - Body: `{ availabilityId, professorId }`
  - Requires authentication token

- **Cancel Appointment**
  - `PUT /api/appointments/:appointmentId/cancel`
  - Requires authentication token (Professor or Student)

- **Get Student's Appointments**
  - `GET /api/appointments/student`
  - Requires authentication token (Student)

- **Get Professor's Appointments**
  - `GET /api/appointments/professor`
  - Requires authentication token (Professor)

## Testing

The project includes end-to-end (E2E) tests that validate the entire user flow as described in the requirements.

### Running Tests

```
npm test
```

### Test Flow

The E2E test (`tests/e2e.test.js`) validates the following flow:

1. Student A1 authenticates to access the system
2. Professor P1 authenticates to access the system
3. Professor P1 specifies which time slots he is free for appointments
4. Student A1 views available time slots for Professor P1
5. Student A1 books an appointment with Professor P1 for time T1
6. Student A2 authenticates to access the system
7. Student A2 books an appointment with Professor P1 for time T2
8. Professor P1 cancels the appointment with Student A1
9. Student A1 checks their appointments and realizes they do not have any pending appointments

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Testing**: Jest, Supertest
- **Development**: Nodemon

## Security Notes

- User passwords are hashed using bcryptjs before storing in the database
- API endpoints are protected with JWT authentication
- Environment variables are used to store sensitive information

