# Subscription API - AI Coding Agent Instructions

## Project Overview

This is a NestJS subscription management API with JWT authentication, Drizzle ORM (PostgreSQL), and Arcjet security middleware. The application tracks user subscriptions with fields like price, frequency, category, and renewal dates.

## Architecture & Key Patterns

### Database Layer (Drizzle ORM)

- **Schema location**: `src/drizzle/schema/` - schemas split by entity (user, subscription)
- **Schema exports**: `src/drizzle/schema.ts` aggregates all schemas
- **Dependency injection**: Database connection uses token `DB_CONNECTION` from `DrizzleModule`
- **Type inference**: Use `$inferSelect` and `$inferInsert` for type safety (see `user.schema.ts`)
- **Relations**: Defined separately using `relations()` from `drizzle-orm` (one-to-many: users → subscriptions)

```typescript
// Inject database in services
constructor(@Inject('DB_CONNECTION') private readonly db: any) {}
```

### Middleware Chain (Order Matters!)

Defined in `app.module.ts`, applied in this sequence:

1. **ArcjetMiddleware** (`*` routes) - Rate limiting, bot detection, shield protection
2. **AuthMiddleware** (all routes except sign-up/sign-in) - JWT verification

### Authentication Pattern

- **JWT Strategy**: Global JWT module configured in `AuthModule` with async config
- **Token format**: Bearer token in Authorization header
- **User context**: Middleware attaches `req['user']` with payload `{ sub: userId, email }`
- **Excluded routes**: Sign-up and sign-in explicitly excluded via `.exclude()` in middleware

### Global Configuration

- **API prefix**: All routes prefixed with `api/v1` (see `main.ts`)
- **Validation**: Global ValidationPipe with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- **Config**: Uses NestJS ConfigModule (global) loading from `src/config/configuration.ts`
- **Environment**: Loads `.env.development.local` in dev (see `drizzle.config.ts`)
- **Key env vars**: `DATABASE_URL`, `JWT_SECRET`, `ARCJET_KEY`, `PORT` (accessed via ConfigService or process.env)

## Development Workflows

### Essential Commands

```bash
# Development with watch mode (most common)
pnpm run start:dev

# Database migrations (Drizzle Kit)
npx drizzle-kit generate    # Generate migrations from schema
npx drizzle-kit migrate     # Apply migrations
npx drizzle-kit push        # Push schema directly (dev only)

# Testing
pnpm run test               # Unit tests
pnpm run test:e2e           # End-to-end tests
pnpm run test:cov           # Coverage report
```

### Creating New Modules

Follow the established pattern:

1. Generate scaffold: `nest g resource <name>` (choose REST, generate CRUD)
2. Import `DrizzleModule` if database access needed
3. Add module to `AppModule` imports
4. DTOs use `class-validator` decorators (see `signup-auth.dto.ts`)
5. Use `PartialType` from `@nestjs/mapped-types` for update DTOs

## Critical Conventions

### DTOs & Validation

- **Naming**: `{Action}{Entity}Dto` (e.g., `SignUpAuthDto`, `CreateSubscriptionDto`)
- **Location**: `<module>/dto/` directory
- **Validation**: Always use class-validator decorators (`@IsEmail()`, `@IsNotEmpty()`, `@MinLength()`)

### Database Schemas (Drizzle)

- **Primary keys**: Use `uuid('id').primaryKey().defaultRandom()`
- **Timestamps**: Include `createdAt` and `updatedAt` with `.defaultNow()`
- **Enums**: Define with `pgEnum()` before table definition (see `subscription.schema.ts`)
- **Foreign keys**: Use `.references()` with `onDelete: 'cascade'` for cleanup
- **Indexes**: Add via second argument to `pgTable()` for performance

### Error Handling

- **Service layer**: Throw NestJS exceptions (`ConflictException`, `UnauthorizedException`, etc.)
- **Standard response**: Wrap responses in `{ success: boolean, message: string, data?: any }`
- **Auth errors**: Always use `UnauthorizedException` for auth failures

### Security (Arcjet)

- **Configuration**: `src/config/arcjet.ts` defines rules (shield, bot detection, rate limiting)
- **Rate limit**: 100 requests per 60-second window (fixed window algorithm)
- **Bot policy**: Blocks all bots except search engines
- **Mode**: `LIVE` in production, use `DRY_RUN` for testing

## Integration Points

### Database Connection

- **Provider**: Neon serverless PostgreSQL (`@neondatabase/serverless`)
- **Pool config**: SSL enabled for remote, disabled for localhost
- **Connection test**: Module initialization queries `SELECT NOW()` to verify

### JWT Configuration

- **Secret**: Read from `JWT_SECRET` env var (fallback: 'your-secret-key')
- **Expiration**: 1 day (`expiresIn: '1d'`)
- **Payload structure**: `{ sub: userId, email: userEmail }`

### Module Dependencies

- `AuthModule` → exports `AuthService` for potential use in other modules
- `DrizzleModule` → exports `DB_CONNECTION` provider
- All modules import global `ConfigModule`

## Common Pitfalls

1. **Middleware exclusion**: Use `.exclude({ path: 'api/v1/...', method: RequestMethod.POST })` - include full path with prefix
2. **Drizzle queries**: Results are always arrays - use `[0]` or check `.length` for existence
3. **Password hashing**: Always await `bcrypt.hash()` and `bcrypt.compare()` - async operations
4. **Schema exports**: Export both the table and relations from schema files
5. **Environment variables**: Access via `ConfigService` in services, or direct `process.env` where ConfigService isn't available (like config files)

## File References

- Middleware setup: `src/app.module.ts` (lines 30-39)
- Database injection pattern: `src/auth/auth.service.ts` (lines 18-20)
- Schema pattern: `src/drizzle/schema/user.schema.ts`, `subscription.schema.ts`
- JWT payload creation: `src/auth/auth.service.ts` (signup: lines 49-52, signin: lines 101-104)
