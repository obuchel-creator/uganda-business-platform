# Uganda Business Platform

An independent business-services platform intended to help Ugandan businesses build an online presence, discover services and opportunities, and connect with other businesses. No government partnership, registration service, or business verification is represented by the current application.

## Current state

The project has a React + TypeScript frontend and an Express + TypeScript API foundation. The API provides a landing page, a liveness endpoint, and a database readiness endpoint. PostgreSQL models and an initial migration are prepared, but the migration has not been applied. Authentication, business directory endpoints, and user workflows are not implemented yet.

## Architecture

- `frontend/`: React, TypeScript, and Vite. Development requests to `/api` are proxied to the backend.
- `backend/`: Express API, Zod environment validation, Helmet, explicit-origin CORS, Sequelize models, PostgreSQL migrations, and Vitest/Supertest.
- PostgreSQL is the primary data store. The initial schema covers users, business categories, businesses, and category assignments.

The initial architecture is a modular monolith. Authentication, business records, directory search, inquiries, moderation, and subscriptions remain planned modules, not existing features.

## Prerequisites

- Node.js 22 or a compatible current LTS release.
- npm 11 or compatible.
- PostgreSQL 16 or 17 for local database work, or a Supabase PostgreSQL project.

## Windows 11 setup

From the project root, install each application’s dependencies:

```powershell
cd backend
npm ci
Copy-Item .env.example .env
npm run dev
```

Open a second PowerShell terminal at the project root:

```powershell
cd frontend
npm ci
npm run dev
```

Open the Vite URL printed by the frontend command. The default API URL is `http://localhost:3001`; `GET /api/health` returns the API status. The frontend development server proxies `/api` requests to that backend URL.

## Environment configuration

`backend/.env.example` lists backend settings for local PostgreSQL and a blank `DATABASE_URL` for hosted PostgreSQL. Copy it to `backend/.env` and set the connection details for the database you choose. The example password is a placeholder and will not authenticate unless you set it yourself. The backend validates environment values at startup and does not expose database credentials to the frontend. Never commit a populated `.env` file.

Edit `backend/.env` with credentials for a local development database. The example password is a placeholder and will not authenticate unless you set it yourself. The API can start without PostgreSQL; `GET /api/ready` returns `503` until the configured database is reachable, while `GET /api/health` reports API liveness only.

If PostgreSQL is installed as a Windows service, inspect it with `Get-Service *postgres*`, start the intended local instance, and create the database named in `DB_NAME` using pgAdmin or your PostgreSQL tools.

Supabase is also supported because it provides PostgreSQL. In the Supabase dashboard, choose **Connect** and copy a PostgreSQL connection string into `DATABASE_URL`. For a persistent backend on an IPv4-only network, Supabase recommends its **Session pooler** connection; its transaction pooler does not support prepared statements used by many ORMs. The backend enforces TLS and certificate validation for `DATABASE_URL` connections. Percent-encode special characters in the password as required by the connection-string format. Keep this URL only in `backend/.env` or the deployment secret store; never place it in `frontend` environment variables or source code. [Supabase connection guidance](https://supabase.com/docs/guides/database/connecting-to-postgres)

## Database migrations

`backend/src/database/migrations/` contains versioned, reversible migrations. `npm run db:migrate` connects to the configured database and applies pending migrations in a PostgreSQL transaction. It creates the `ubp_schema_migrations` tracking table, serializes concurrent migration runs with a PostgreSQL advisory lock, and records each migration after it succeeds. Migrations are never run automatically when the API starts.

Before running `npm run db:migrate`, confirm the connection settings point to the intended development database. The initial migration creates users, categories, businesses, and category assignments; it does not seed fictitious records. Its `down` migration drops those tables and their data, so rollback tooling is intentionally not exposed as a routine command.

For a compiled deployment artifact, run `npm run build` and then `npm run db:migrate:compiled` against the explicitly configured target database.

## Verification commands

Run from `backend/`:

```powershell
npm run typecheck
npm test
npm run build
npm audit
```

Run from `frontend/`:

```powershell
npm run build
```

## Development plan

1. Complete project foundation and local setup.
2. Verify local PostgreSQL access and review/apply the initial schema migration.
3. Implement authentication and authorization.
4. Build business categories, profiles, directory search, and publication states.
5. Add listings, inquiries, notifications, and audit events.
6. Add protected administration and moderation workflows.
7. Integrate the frontend with completed API workflows and prepare deployment.

## Current limitations

- The migration has not been run; database connectivity remains unverified until a local or Supabase database is configured.
- The UI is a foundation screen with API connection status, not the public directory or business dashboard.
- There are no user accounts, business records, listings, inquiries, or administrative roles yet.
- No production deployment, payment integration, legal review, or verification process is configured.
