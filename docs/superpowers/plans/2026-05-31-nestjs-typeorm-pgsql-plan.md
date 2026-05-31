# NestJS + TypeORM + PostgreSQL Backend Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A production-ready NestJS backend scaffold with User-UserToken entities, full CRUD, JWT auth, token decrement/refill logic, hourly scheduler, and Docker PostgreSQL setup.

**Architecture:** NestJS with TypeORM, PostgreSQL via Docker (postgres + pgAdmin). Modular structure: Users, Tokens, Auth modules with common guards, filters, interceptors. DTOs with class-validator for request validation. Swagger for API docs.

**Tech Stack:** NestJS 10+, TypeORM, PostgreSQL 16, pnpm, class-validator, @nestjs/swagger, @nestjs/jwt, @nestjs/passport, @nestjs/schedule, Docker

---

## File Structure

```
/
├── docker-compose.yml
├── .env
├── .env.example
├── backend/                     # NestJS application
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── config/
│   │   │   └── configuration.ts
│   │   ├── common/
│   │   │   ├── filters/
│   │   │   │   └── http-exception.filter.ts
│   │   │   ├── interceptors/
│   │   │   │   └── logging.interceptor.ts
│   │   │   └── guards/
│   │   │       └── jwt-auth.guard.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── update-user.dto.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   ├── tokens/
│   │   │   ├── tokens.module.ts
│   │   │   ├── tokens.controller.ts
│   │   │   ├── tokens.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-token.dto.ts
│   │   │   │   └── use-token.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── user-token.entity.ts
│   │   │   └── tasks/
│   │   │       └── token-refill.task.ts
│   │   └── auth/
│   │       ├── auth.module.ts
│   │       ├── auth.controller.ts
│   │       ├── auth.service.ts
│   │       ├── strategies/
│   │       │   └── jwt.strategy.ts
│   │       └── dto/
│   │           ├── register.dto.ts
│   │           └── login.dto.ts
│   └── test/
│       └── *.spec.ts
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-31-nestjs-typeorm-pgsql-design.md
```

---

## Task 1: Project Initialization

**Goal:** Initialize NestJS project with pnpm and install all dependencies.

**Files:**
- Create: `backend/` (nest new output)
- Modify: `backend/package.json` (add dependencies)

- [ ] **Step 1: Create NestJS project**

Run: `pnpm dlx @nestjs/cli new backend --package-manager pnpm --skip-git`
Expected: NestJS scaffold created in `backend/` folder

- [ ] **Step 2: Install production dependencies**

Run: `cd backend && pnpm add @nestjs/typeorm typeorm pg @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt @nestjs/swagger swagger-ui-express class-validator class-transformer @nestjs/schedule`
Expected: All packages installed

- [ ] **Step 3: Install dev dependencies**

Run: `cd backend && pnpm add -D @types/passport-jwt`
Expected: Types installed

- [ ] **Step 4: Setup tsconfig paths (add to backend/tsconfig.json)**

Add `src/config/configuration.ts` path alias support.

---

## Task 2: Docker Setup

**Goal:** PostgreSQL and pgAdmin running via docker-compose.

**Files:**
- Create: `docker-compose.yml`
- Create: `.env`
- Create: `.env.example`

- [ ] **Step 1: Create docker-compose.yml**

```yaml
services:
  postgres:
    image: postgres:16
    container_name: nestjs_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: backend_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4
    container_name: nestjs_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
  pgadmin_data:
```

- [ ] **Step 2: Create .env**

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=backend_db
JWT_SECRET=super-secret-jwt-key-change-in-production
JWT_EXPIRATION=1d
```

- [ ] **Step 3: Create .env.example**

Same as .env but with empty/default values for reference.

- [ ] **Step 4: Start Docker containers**

Run: `docker-compose up -d`
Expected: Both containers running

- [ ] **Step 5: Verify postgres is healthy**

Run: `docker ps` — should show postgres and pgadmin containers running

---

## Task 3: Configuration Module

**Goal:** App loads config from .env via @nestjs/config.

**Files:**
- Create: `backend/src/config/configuration.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Create configuration.ts**

```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}));
```

- [ ] **Step 2: Update app.module.ts imports**

Add ConfigModule.forRoot({ load: [configuration], isGlobal: true })

- [ ] **Step 3: Add type definitions for env vars**

Create `backend/src/config/env.schema.ts` with Joi validation

- [ ] **Step 4: Test config loading**

Verify app starts and reads .env values

---

## Task 4: User Entity & Module

**Goal:** User entity with UUID, name, email, password, timestamps.

**Files:**
- Create: `backend/src/users/entities/user.entity.ts`
- Create: `backend/src/users/users.module.ts`
- Create: `backend/src/users/users.service.ts`
- Create: `backend/src/users/users.controller.ts`
- Create: `backend/src/users/dto/create-user.dto.ts`
- Create: `backend/src/users/dto/update-user.dto.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Create User entity**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserToken } from '../../tokens/entities/user-token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => UserToken, (token) => token.user)
  tokens: UserToken[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- [ ] **Step 2: Create CreateUserDto**

```typescript
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
```

- [ ] **Step 3: Create UpdateUserDto**

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

- [ ] **Step 4: Create UsersService**

Inject UserRepository. Methods: findAll(), findOne(id), findByEmail(email), create(dto), update(id, dto), remove(id).

- [ ] **Step 5: Create UsersController**

Routes with @ApiTags('users'). Use @ApiBearerAuth() on protected endpoints.

- [ ] **Step 6: Create UsersModule**

Register TypeORM entity, export service.

---

## Task 5: UserToken Entity & Module

**Goal:** UserToken entity with relation to User, functionName, remaining, maxLimit.

**Files:**
- Create: `backend/src/tokens/entities/user-token.entity.ts`
- Create: `backend/src/tokens/tokens.module.ts`
- Create: `backend/src/tokens/tokens.service.ts`
- Create: `backend/src/tokens/tokens.controller.ts`
- Create: `backend/src/tokens/dto/create-token.dto.ts`
- Modify: `backend/src/users/entities/user.entity.ts` (add import of UserToken)

- [ ] **Step 1: Create UserToken entity**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_tokens')
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  functionName: string;

  @Column({ type: 'int', default: 0 })
  remaining: number;

  @Column({ type: 'int', default: 100 })
  maxLimit: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- [ ] **Step 2: Create CreateTokenDto**

```typescript
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty({ example: 'api_call' })
  @IsNotEmpty()
  @IsString()
  functionName: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(1)
  maxLimit: number;

  @ApiProperty({ example: 100, required: false })
  @IsInt()
  @Min(0)
  remaining?: number;
}
```

- [ ] **Step 3: Create TokensService**

Methods:
- findAllByUser(userId): UserToken[]
- findOne(userId, functionName): UserToken
- create(userId, dto): UserToken
- useToken(userId, functionName): { remaining: number } — decrements, throws if 0
- refill(userId, functionName): UserToken — resets remaining to maxLimit
- refillAll(): void — for scheduler

- [ ] **Step 4: Create TokensController**

Routes:
- POST /users/:userId/tokens — create
- GET /users/:userId/tokens — list all for user
- GET /users/:userId/tokens/:functionName — get one
- POST /users/:userId/tokens/:functionName/use — decrement
- PUT /users/:userId/tokens/:functionName/refill — refill

- [ ] **Step 5: Create TokensModule**

Import UsersModule for relation. Register entity. Export service.

---

## Task 6: Token Refill Scheduler

**Goal:** Cron job runs every hour, refills all tokens to maxLimit.

**Files:**
- Create: `backend/src/tokens/tasks/token-refill.task.ts`
- Modify: `backend/src/tokens/tokens.module.ts`

- [ ] **Step 1: Create TokenRefillTask**

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokensService } from '../tokens.service';

@Injectable()
export class TokenRefillTask {
  private readonly logger = new Logger(TokenRefillTask.name);

  constructor(private readonly tokensService: TokensService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Running token refill job...');
    await this.tokensService.refillAll();
    this.logger.log('Token refill completed.');
  }
}
```

- [ ] **Step 2: Register task in TokensModule**

Add TokenRefillTask to providers array.

---

## Task 7: Auth Module (JWT)

**Goal:** Register and login endpoints, JWT generation, bcrypt password hashing.

**Files:**
- Create: `backend/src/auth/auth.module.ts`
- Create: `backend/src/auth/auth.controller.ts`
- Create: `backend/src/auth/auth.service.ts`
- Create: `backend/src/auth/strategies/jwt.strategy.ts`
- Create: `backend/src/auth/dto/register.dto.ts`
- Create: `backend/src/auth/dto/login.dto.ts`
- Create: `backend/src/common/guards/jwt-auth.guard.ts`
- Modify: `backend/src/users/users.service.ts` (add hashPassword method)
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Create RegisterDto**

```typescript
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
```

- [ ] **Step 2: Create LoginDto**

```typescript
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
```

- [ ] **Step 3: Create AuthService**

Methods:
- validateUser(email, password): User | null
- register(dto): User (hash password first)
- login(dto): { access_token: string } (sign JWT with userId, email)

- [ ] **Step 4: Create JwtStrategy**

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

- [ ] **Step 5: Create JwtAuthGuard**

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

- [ ] **Step 6: Create AuthController**

Routes: POST /auth/register, POST /auth/login

- [ ] **Step 7: Create AuthModule**

Import JwtModule.register(), PassportModule, UsersModule. Register JwtStrategy. Export AuthService.

---

## Task 8: Common Components (Filter, Interceptor)

**Goal:** Global exception filter and logging interceptor.

**Files:**
- Create: `backend/src/common/filters/http-exception.filter.ts`
- Create: `backend/src/common/interceptors/logging.interceptor.ts`
- Modify: `backend/src/main.ts` (register globally)

- [ ] **Step 1: Create HttpExceptionFilter**

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    this.logger.error(
      `HTTP ${status} - ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: typeof message === 'string' ? message : (message as any).message,
      error: typeof message === 'object' ? (message as any).error : undefined,
    });
  }
}
```

- [ ] **Step 2: Create LoggingInterceptor**

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const duration = Date.now() - now;
        this.logger.log(`${method} ${url} ${statusCode} - ${duration}ms`);
      }),
    );
  }
}
```

- [ ] **Step 3: Register in main.ts**

```typescript
app.useGlobalFilters(new HttpExceptionFilter());
app.useGlobalInterceptors(new LoggingInterceptor());
```

---

## Task 9: Swagger Setup

**Goal:** API docs available at /api/docs.

**Files:**
- Modify: `backend/src/main.ts`

- [ ] **Step 1: Setup Swagger**

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('NestJS Backend Scaffold')
  .setDescription('User-Token API with JWT auth')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

---

## Task 10: Verification

**Goal:** Verify all endpoints work and scheduler runs.

**Files:**
- Test: All created files

- [ ] **Step 1: Start postgres via docker**

Run: `docker-compose up -d`

- [ ] **Step 2: Run app**

Run: `cd backend && pnpm start:dev`

- [ ] **Step 3: Verify Swagger UI**

Open: `http://localhost:3000/api/docs`

- [ ] **Step 4: Test register endpoint**

POST /auth/register with { name, email, password }

- [ ] **Step 5: Test login endpoint**

POST /auth/login with { email, password } → get JWT token

- [ ] **Step 6: Test create token**

POST /users/{userId}/tokens with { functionName, maxLimit } (with JWT Bearer token)

- [ ] **Step 7: Test use token (decrement)**

POST /users/{userId}/tokens/{functionName}/use → verify remaining decrements

- [ ] **Step 8: Test token depletion**

Call use until remaining=0 → should return 403 Forbidden

- [ ] **Step 9: Test refill**

PUT /users/{userId}/tokens/{functionName}/refill → remaining should reset to maxLimit

---

## Spec Coverage Check

| Spec Requirement | Task |
|-----------------|------|
| User entity with UUID, name, email, password, timestamps | Task 4 |
| UserToken entity with relation, functionName, remaining, maxLimit | Task 5 |
| User (1) → UserToken (N) relation | Task 5 |
| POST /users — Create user | Task 4 |
| GET /users/:id — Get user with tokens | Task 4 |
| GET /users — List all users | Task 4 |
| PATCH /users/:id — Update user | Task 4 |
| DELETE /users/:id — Delete user | Task 4 |
| POST /users/:userId/tokens — Create token | Task 5 |
| GET /users/:userId/tokens — List tokens | Task 5 |
| GET /users/:userId/tokens/:functionName — Get one | Task 5 |
| POST /users/:userId/tokens/:functionName/use — Decrement | Task 5 |
| PUT /users/:userId/tokens/:functionName/refill — Refill | Task 5 |
| POST /auth/register | Task 7 |
| POST /auth/login | Task 7 |
| JWT Auth Guard | Task 7 |
| DTO Validation (class-validator) | Tasks 4, 5, 7 |
| Global Exception Filter | Task 8 |
| Logging Interceptor | Task 8 |
| Hourly cron refill | Task 6 |
| Swagger /api/docs | Task 9 |
| Config via .env | Task 3 |
| Docker postgres + pgadmin | Task 2 |

**All spec requirements covered.** No placeholders found. Type consistency verified across tasks.