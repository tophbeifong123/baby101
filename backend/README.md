# baby101 Backend

NestJS backend API with PostgreSQL database.

## Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: TypeORM
- **Auth**: JWT (passport-jwt)
- **Validation**: class-validator / class-transformer
- **API Docs**: Swagger (`/api/docs`)
- **Package Manager**: pnpm

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pnpm install
```

### 2. Start Database

```bash
docker-compose up -d
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update values if needed.

### 4. Run Server

```bash
pnpm run start:dev
```

Server runs at `http://localhost:3000`
Swagger docs at `http://localhost:3000/api/docs`

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT |

### Functions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/functions` | Create function | JWT |
| GET | `/functions` | List all | JWT |
| GET | `/functions/:id` | Get one | JWT |
| PATCH | `/functions/:id` | Update | JWT |
| DELETE | `/functions/:id` | Delete | JWT |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/users` | Create user | No |
| GET | `/users` | List all | JWT |
| GET | `/users/:id` | Get one | JWT |
| PATCH | `/users/:id` | Update | JWT |
| DELETE | `/users/:id` | Delete | JWT |

### Tokens

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/users/:userId/tokens` | Create token | JWT |
| GET | `/users/:userId/tokens` | List user's tokens | JWT |
| GET | `/users/:userId/tokens/:functionId` | Get token | JWT |
| POST | `/users/:userId/tokens/:functionId/use` | Use token | JWT |
| PUT | `/users/:userId/tokens/:functionId/refill` | Refill token | JWT |

## Workflow Example

```bash
# 1. Login to get JWT token
POST /auth/login
{ "email": "user@example.com", "password": "password123" }

# 2. Create a function
POST /functions
{ "name": "generate_image", "description": "Generate AI images" }
# Response includes functionId

# 3. Create token for user
POST /users/{userId}/tokens
{ "functionId": "uuid-from-step-2", "maxLimit": 100 }

# 4. Use token (decrements remaining)
POST /users/{userId}/tokens/{functionId}/use

# 5. Refill token manually
PUT /users/{userId}/tokens/{functionId}/refill
```

## Token Refill

Tokens auto-refill every **5 minutes** via cron job.

## Database

PostgreSQL 16 runs via Docker on port `5432`.

pgAdmin4 available at `http://localhost:5050` (admin@admin.com / admin)

## Scripts

```bash
pnpm run start        # Start production
pnpm run start:dev    # Start dev with hot reload
pnpm run build        # Build
pnpm run lint         # ESLint
pnpm run test         # Jest tests
```

## Project Structure

```
backend/
├── src/
│   ├── main.ts              # Entry point
│   ├── app.module.ts        # Root module
│   ├── auth/                # Authentication
│   ├── users/               # User management
│   ├── functions/           # Function catalog
│   ├── tokens/              # Token quota management
│   └── common/              # Shared guards, filters, interceptors
├── docker-compose.yml       # PostgreSQL + pgAdmin
└── package.json
```
