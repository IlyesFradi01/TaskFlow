# TaskFlow – Project & Task Management Platform

A full-stack project management application built with the MERN stack. TaskFlow helps users organize projects, manage tasks, track progress, and collaborate through a clean and responsive interface.

##  Features

### Authentication & Authorization
- User registration and login
- Secure password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- User-specific project and task management

### Project Management
- Create, read, update, and delete projects
- Organize projects by category
- Track project status (Active / Completed)
- Manage project visibility (Public / Private)
- View project details and associated tasks

### Task Management
- Create, update, and delete tasks
- Assign tasks to projects
- Set task priorities (Low / Medium / High)
- Track task status (Todo / In Progress / Done)
- Set task deadlines

### Dashboard
- Overview of projects and tasks
- Task and project statistics
- Progress tracking

### Public Access
- Browse publicly available projects
- View public project details
- Read-only access for visitors

##  Tech Stack

**Frontend**
- React.js
- Vite
- Redux Toolkit
- React Router
- Axios
- Bootstrap
- React Icons

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

**Deployment**
- MongoDB Atlas
- Render (Backend)
- Vercel (Frontend)

##  Project Structure

```text
TaskFlow/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

##  Getting Started

Follow these instructions to run TaskFlow locally.

### Prerequisites

Make sure you have installed:

- Node.js (LTS version recommended)
- npm
- MongoDB database or a MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd TaskFlow
```

### 2. Backend Setup

Navigate to the server directory:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The backend should run at:

`http://localhost:5000`

### 3. Frontend Setup

Open another terminal and navigate to the client directory:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the application at:

`http://localhost:5173`

##  API Endpoints

All API routes use the `/api` prefix.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Get authenticated user |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | Get user's projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Get project details |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get user's tasks |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/:id` | Get task details |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Get dashboard statistics |

### Public Projects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/public/projects` | Browse public projects |
| GET | `/api/public/projects/:id` | View public project details |

**Note:** Protected endpoints require a valid JWT access token in the Authorization header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

##  Security

TaskFlow implements several security practices:

- Password hashing using bcrypt
- JWT authentication
- Protected routes and middleware
- Ownership checks to prevent unauthorized resource access
- Environment variables for sensitive configuration

##  License

This project is licensed under the MIT License.

---

*TaskFlow – Organize your projects. Manage your tasks. Track your progress.*