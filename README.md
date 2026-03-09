# Event Management Platform

A full-stack monorepo application designed for event management. This project utilizes a modern tech stack focused on performance, type safety, and scalable architecture.

## Tech Stack

### Frontend
- Framework: React with Vite
- Styling: Tailwind CSS
- Language: TypeScript

### Backend
- Framework: NestJS (Node.js 22)
- API Documentation: Swagger UI
- Database: PostgreSQL with Prisma ORM
- Communication: REST API and WebSockets

### Infrastructure
- Containerization: Docker and Docker Compose
- Environment: Node.js 22 Alpine

## Project Structure

- apps/frontend: React client-side application.
- apps/backend: NestJS server-side application.
- docker-compose.yml: Orchestration for all services.

## Getting Started

### Local Development

Prerequisites: Node.js 22 and npm installed.

#### Backend Setup:
1. Navigate to the backend directory: cd apps/backend
2. Install dependencies: npm install
3. Start the development server: npm run start:dev
4. Access Swagger documentation: http://localhost:4000/api

#### Frontend Setup:
1. Navigate to the frontend directory: cd apps/frontend
2. Install dependencies: npm install
3. Start the development server: npm run dev
4. Access the application: http://localhost:5173

### Docker Setup

To build and run the entire environment (Frontend, Backend, and Database):
docker-compose up --build

## Features

- Monorepo architecture for unified development.
- Automated API documentation with Swagger.
- Containerized services for consistent deployment.
- Integrated PostgreSQL database management with Prisma.
- Real-time event updates via WebSockets.

## License
This project is open-source and available under the MIT License.