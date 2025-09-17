# MERN Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in this directory with the following content:
   ```env
   MONGO_URI=mongodb://localhost:27017/mern
   PORT=5000
   ```

## Running the Server

- For development (with auto-reload):
  ```bash
  npm run dev
  ```
- For production:
  ```bash
  npm start
  ```

## Authentication API

### Signup
- Endpoint: `POST /api/auth/signup`
- Body: `{ "name": "User Name", "email": "user@example.com", "password": "password" }`
- Success: `201 Created` with message
- Error: `409 Conflict` if email exists

### Login
- Endpoint: `POST /api/auth/login`
- Body: `{ "email": "user@example.com", "password": "password" }`
- Success: `200 OK` with JWT token
- Error: `401 Unauthorized` if credentials are invalid 