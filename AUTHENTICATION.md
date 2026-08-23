# Vidya AI Authentication

The application now starts with four protected portals:

- Admin Dashboard
- Teacher Dashboard
- Student Dashboard
- Parent Dashboard

## Demo credentials

### Admin
- Admin ID: `admin001`
- Password: `Admin@123`

### Teacher
- Teacher ID: `teacher001`
- Password: `Vidya@123`

### Student
- Roll Number: `SNIST10A042`
- Password: `Student@123`

### Parent
Parent authentication remains the existing flow:
- Student Roll Number: `SNIST10A042`
- Parent Mobile Number: `9876543210`
- Demo OTP: `123456`

## Run

```bash
npm install
npm run dev:backend
```

In a second terminal:

```bash
npm run dev
```

Open the Vite URL shown by the terminal, normally `http://localhost:5173`.

For production-style serving:

```bash
npm run build
npm start
```

Then open `http://localhost:4000`.
