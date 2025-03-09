# Enterprise Management App

A full-stack application for enterprise management, featuring a React frontend and NestJS backend with Prisma for database integration.

## Project Structure


## Features

- Authentication and authorization
- Admin dashboard
- Task management
- Employee management
- RESTful API
- JWT authentication
- Database integration with Prisma

## Technology Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Chart.js with React-ChartJS-2
- Axios for API calls

### Backend
- NestJS
- Prisma ORM
- JWT authentication
- TypeScript
- RESTful API architecture

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/MohinShaikh5689/enterprise-management-system.git
cd enterprise-management-app
cd backend
npm install



# Run database migrations
npx prisma migrate dev

# Seed the database (if needed)
npx prisma db seed


cd ../frontend
npm install


cd backend

# Development mode
npm run start:dev

# Production mode
npm run start:prod


cd frontend

# Development mode
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
