# Event Platform

Full-stack event management application with authentication, public event listing, calendar view, and event CRUD operations.


## Gallery

<div style="display: flex; flex-wrap: wrap; gap:1px;">
  <img src="./apps/frontend/src/assets/form.jpg" width="25%" height="125px" alt="Sign In Form"/>
  <img src="./apps/frontend/src/assets/welcom.jpg" width="25%" height="125px" alt="Welcome Screen"/>
  <img src="./apps/frontend/src/assets/edit.jpg" width="25%" height="125px" alt="Edit Event"/>
  <img src="./apps/frontend/src/assets/calendar.jpg" width="25%" height="125px" alt="Events Calendar"/>
  
  <img src="./apps/frontend/src/assets/join.jpg" width="25%" height="125px" alt="Join Event"/>
  <img src="./apps/frontend/src/assets/create.jpg" width="25%" height="125px" alt="Create Event"/>
  <img src="./apps/frontend/src/assets/scedule.jpg" width="25%" height="125px" alt="Schedule View"/>
  <img src="./apps/frontend/src/assets/swager.jpg" width="25%" height="125px" alt="Swagger"/>
  <img src="./apps/frontend/src/assets/error.jpg" width="25%" height="125px" alt="Swagger"/>
</div>


## Tech Stack

### Frontend
- React 19 + Vite + TypeScript
- MUI (Material UI)
- Redux Toolkit (RTK Query)
- React Hook Form + Yup
- React Big Calendar
- React Router

### Backend
- NestJS 11
- Prisma + PostgreSQL 
- JWT Authentication
- Swagger API Documentation

### Infrastructure
- Docker Compose

## Project Structure

```
application/
├── apps/
│   ├── frontend/    # React SPA
│   └── backend/     # NestJS API
├── docker-compose.yml
└── README.md
```

## Setup

### Prerequisites
- Node.js 22
- npm

### 1. Environment Variables

**Backend** (`apps/backend/.env`):

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host/database?sslmode=require"

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

Copy from `apps/backend/.env.example` and fill in your Neon database credentials.

**Frontend** (`apps/frontend/.env`) — optional for local Docker (default `http://localhost:4000`):

```env
VITE_API_URL=http://localhost:4000
```

For production deploy, set `VITE_API_URL` to your backend URL (e.g. `https://api.yourdomain.com`).

### 2. Database

```bash
cd apps/backend
npm install
npx prisma db push          # sync schema to Neon DB (or: prisma migrate deploy if migrations exist)
npx prisma db seed          # optional: seed test data
```

### 3. Run Application

**Option A: Docker (recommended)**

From the `application` root:

```bash
npm run dev
# or
docker-compose up --build
```

**Option B: Local development**

Terminal 1 (Backend):
```bash
cd apps/backend
npm install
npm run start:dev
```

Terminal 2 (Frontend):
```bash
cd apps/frontend
npm install
npm run dev
```

### 4. Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Swagger Docs**: http://localhost:4000/api-docs

## Seed Data

After running `npm run seed`:

- **Users**: alice@example.com, bob@example.com (password: `Password123!`)
- **Events**: 3 public events
- **Participant**: Bob joined one of Alice's events

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login |
| GET | /auth/me | Current user (JWT) |
| GET | /events | Public events list |
| GET | /events/:id | Event details |
| POST | /events | Create event (JWT) |
| PATCH | /events/:id | Edit event (organizer) |
| DELETE | /events/:id | Delete event (organizer) |
| POST | /events/:id/join | Join event (JWT) |
| POST | /events/:id/leave | Leave event (JWT) |
| GET | /users/me/events | User's events for calendar (JWT) |

## Deployment

### Branch `prod` (technical spec requirement)

If deployment must use branch `prod`:

1. Create and push the branch:
   ```bash
   git checkout -b prod
   git push -u origin prod
   ```
2. For your own repo you don't need a PR — merge directly:
   ```bash
   git checkout main
   git merge prod
   git push origin main
   ```
3. Or use `prod` as the main deployment branch and always push there for releases.

### Docker deploy

1. Build images:
   ```bash
   cd application
   docker-compose build
   ```
2. For production, pass `VITE_API_URL` for frontend:
   ```bash
   docker-compose build --build-arg VITE_API_URL=https://your-api-domain.com
   docker-compose up -d
   ```
3. Ensure backend `.env` has valid `DATABASE_URL` and `JWT_SECRET` for Neon.

### Prisma schema before first run

Run once before starting backend (creates tables in Neon):

```bash
cd apps/backend
npx prisma db push
```

## Features

- **Authentication**: Sign up, login, JWT sessions
- **Events List**: Public events with Join/Leave
- **Event Details**: Full info, participants, Edit/Delete for organizer
- **Create Event**: Title, description, date/time, location, capacity, visibility
- **My Events**: Calendar view (month/week) of user's events
- **Responsive UI**: MUI components, mobile-friendly

## License

ISC
