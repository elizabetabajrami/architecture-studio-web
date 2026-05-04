# Alkos Group Architecture Studio

## Project Overview

Alkos Group Architecture Studio is a full-stack web application built for an architecture and interior design studio. The platform allows users to explore portfolio projects, view detailed project information, save favorite projects, submit contact/project requests, and manage their profile. Admin users can manage portfolio projects, users, and contact messages through a dedicated dashboard.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- NextAuth
- React Hook Form

## Main Features

### User Features

- Register and login
- Profile page with edit profile functionality
- Save and remove favorite projects
- Browse portfolio projects by category
- View project details
- Submit contact/project request form

### Admin Features

- Admin dashboard
- View users, messages, and projects
- Add new portfolio projects
- Edit portfolio projects
- Delete portfolio projects
- View and delete contact messages
- Role-based access control

## Authentication

The project uses custom JWT authentication for the main application flow, including login, register, profile, favorites, and admin dashboard protection.

NextAuth is also included with a Credentials Provider to satisfy the course requirement. It uses the existing MongoDB users collection and supports user/admin role data in the session and JWT token.

The system supports user and admin roles with protected routes and role-based access control.

## Data Fetching

The project includes multiple Next.js data fetching methods:

- SSR with `getServerSideProps`
- SSG with `getStaticProps`
- ISR using `revalidate`
- Dynamic project detail pages with `getStaticPaths`

## Environment Variables

Required environment variables:

```env
MONGODB_URI=mongodb://localhost:27017/architectureDB
JWT_SECRET=your-jwt-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
PORT=5000
```

## How to Run Locally

MongoDB must be running locally before starting the backend.

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
node server.js
```

## Screenshots

![Home Page](./screenshots/home.png)

![Portfolio Page](./screenshots/portfolio.png)

![Project Details Page](./screenshots/project-details.png)

![Profile Page](./screenshots/profile.png)

![Admin Dashboard](./screenshots/admin-dashboard.png)

![Contact Messages](./screenshots/contact-messages.png)

## Deployment

Live Demo: coming soon

Deployment is planned on Vercel.

## Team Members and Roles

- Elizabeta Bajrami – Frontend Development, UI Design, Portfolio Pages
- Laura Geci – Authentication, Profile, User Features
- Vlere Shabiu – Database, Backend, Project Management Features
- Blenda Abdullahu – Admin Panel, Contact Messages, Forms

## Notes

- The application includes both frontend and backend.
- MongoDB is used as the database.
- The backend runs locally on port 5000.
- The frontend runs locally on port 3000.
