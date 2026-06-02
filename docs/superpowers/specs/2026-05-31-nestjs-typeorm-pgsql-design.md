# NestJS + TypeORM + PostgreSQL Backend Scaffold

**Date:** 2026-05-31
**Purpose:** Learning best practices — project structure, NestJS components, TypeORM relations

---

## 1. Overview

A production-ready NestJS backend scaffold with TypeORM and PostgreSQL. Demonstrates module organization, CRUD patterns, entity relations, JWT auth guard skeleton, DTO validation, custom exception filters, schedulers, and Swagger documentation.

---

## 2. Tech Stack

| Technology | Purpose |
|------------|---------|
| NestJS 10+ | Framework |
| TypeORM | ORM |
| PostgreSQL | Database |
| pnpm | Package manager |
| TypeScript | Language |
| class-validator / class-transformer | DTO validation |
| @nestjs/swagger | OpenAPI docs |
| @nestjs/jwt | JWT utilities |
| @nestjs/schedule | Cron jobs |

---

## 3. Data Model

### User Entity

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK, auto-generated |
| name | string | Required |
| email | string | Unique, required |
| password | string | Hashed |
| createdAt | timestamp | Auto |
| updatedAt | timestamp | Auto |

### UserToken Entity

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK → User.id |
| functionName | string | e.g., "api_call", "image_gen" |
| remaining | int | Current token count |
| maxLimit | int | Max tokens (refill target) |
| updatedAt | timestamp | Auto |

**Relation:** User (1) → UserToken (N)

---

## 4. API Endpoints

### Users Module

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /users | Create user |
| GET | /users/:id | Get user by ID (with tokens) |
| GET | /users | List all users |
| PATCH | /users/:id | Update user |
| DELETE | /users/:id | Delete user |

### Tokens Module

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /users/:userId/tokens | Create token for user |
| GET | /users/:userId/tokens | List all tokens for user |
| GET | /users/:userId/tokens/:functionName | Get specific token |
| POST | /users/:userId/tokens/:functionName/use | Decrement remaining, return new value |
| PUT | /users/:userId/tokens/:functionName/refill | Reset remaining to maxLimit |

### Auth Module

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login, return JWT |

---

## 5. NestJS Components (Best Practices)

### Module Structure

```
src/
├── main.ts
├── app.module.ts
├── config/
│   └── configuration.ts
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   └── logging.interceptor.ts
│   └── guards/
│       └── jwt-auth.guard.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
├── tokens/
│   ├── tokens.module.ts
│   ├── tokens.controller.ts
│   ├── tokens.service.ts
│   ├── entities/
│   │   └── user-token.entity.ts
│   ├── dto/
│   │   └── create-token.dto.ts
│   └── tasks/
│       └── token-refill.task.ts
└── auth/
    ├── auth.module.ts
    ├── auth.controller.ts
    ├── auth.service.ts
    └── strategies/
        └── jwt.strategy.ts
```

### DTOs with Validation

- `CreateUserDto` — name, email, password (all validated)
- `UpdateUserDto` — partial updates
- `CreateTokenDto` — functionName, maxLimit
- All use `class-validator` decorators

### Guards

- `JwtAuthGuard` — protects routes, requires valid JWT
- Can be applied globally or per-route

### Exception Filter

- `HttpExceptionFilter` — consistent error response format
- Logs errors, returns structured JSON

### Interceptors

- `LoggingInterceptor` — logs method, url, status code, duration

### Scheduler

- `TokenRefillTask` — cron job: `0 * * * *` (every hour)
- Refills all tokens to their maxLimit

---

## 6. Configuration

Environment via `.env`:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=backend_db
JWT_SECRET=your-secret-key
```

Loaded via `@nestjs/config` with `configuration.ts`.

---

## 7. Project Setup Commands

```bash
# Initialize NestJS project
nest new backend --package-manager pnpm --skip-git

# Install dependencies
pnpm add @nestjs/typeorm typeorm pg @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt @nestjs/swagger swagger-ui-express class-validator class-transformer @nestjs/schedule

# Install dev dependencies
pnpm add -D @types/passport-jwt

# Generate scaffolding
nest g resource users
nest g resource tokens
nest g resource auth
nest g module config
nest g guard common/guards/jwt-auth
nest g filter common/filters/http-exception
nest g interceptor common/interceptors/logging
nest g task tokens/tasks/token-refill
```

---

## 8. What This Teaches

| Concept | Where Demonstrated |
|---------|-------------------|
| Modules & Dependency Injection | Every module |
| Controllers & Routing | users.controller.ts |
| Services & Business Logic | users.service.ts |
| TypeORM Entities & Relations | user.entity.ts, user-token.entity.ts |
| DTO Validation | create-*.dto.ts |
| Guards (Auth) | jwt-auth.guard.ts |
| Interceptors (Logging) | logging.interceptor.ts |
| Exception Filters | http-exception.filter.ts |
| Cron Jobs | token-refill.task.ts |
| Config Management | config/configuration.ts |
| Swagger Docs | main.ts |

---

## 9. Success Criteria

- [x] Project scaffold with clean module structure
- [x] User and UserToken entities with one-to-many relation
- [x] Full CRUD for users and tokens
- [x] Token decrement on use, block when depleted
- [x] Hourly scheduler refills all tokens
- [x] JWT auth skeleton
- [x] DTO validation on all endpoints
- [x] Swagger UI at `/api/docs`
- [x] Global exception filter
- [x] Logging interceptor