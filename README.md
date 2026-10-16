# NexusCareer — Job Portal & Placement Preparation Platform

A full-stack platform that combines a **job portal** (recruiters post jobs, candidates search,
apply and track applications) with a **placement preparation hub** (Aptitude, DSA, Technical and
HR practice, quizzes, company hiring guides and progress tracking).

Three roles: **User (candidate)**, **Recruiter**, and **Admin**.

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| Backend | Node.js, Express 4, TypeScript |
| Auth | Clerk (session tokens + webhooks) |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Cache | Redis (optional; falls back to direct DB mode) |
| Storage | Supabase Storage (resumes, avatars, company logos) |
| Validation | Zod |
| API Style | REST (`/api/v1`) |

## Repository Layout

```
.
├── backend/                 # Express REST API
│   ├── prisma/
│   │   ├── schema.prisma    # Data model
│   │   ├── migrations/      # SQL migrations
│   │   └── seed.ts          # Starter data
│   └── src/
│       ├── routes/          # URL definitions
│       ├── controllers/     # Request/response handling
│       ├── services/        # Business logic
│       ├── middleware/      # auth, RBAC, validation, errors, rate limiting
│       ├── validators/      # Zod schemas
│       ├── lib/             # prisma.ts, redis.ts, supabase.ts
│       ├── app.ts           # Express app + global middleware
│       └── server.ts        # Bootstrap + graceful shutdown
├── frontend/                # Next.js app
│   ├── app/                 # Routes (jobs, prep, dashboard, recruiter, admin, auth)
│   ├── components/          # JobCard, JobFilters, QuizEngine, ...
│   ├── lib/                 # api.ts, utils.ts
│   ├── types/
│   └── middleware.ts        # Clerk route protection
└── postman/                 # API test collection
```

## Prerequisites

- Node.js 18+
- A PostgreSQL database (Supabase recommended)
- A Clerk application
- Redis (optional)
- A Supabase project for Storage (optional)

## Getting Started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # then fill in your credentials
npx prisma generate
npx prisma migrate dev    # creates tables
npm run prisma:seed       # loads starter data
npm run dev               # http://localhost:5000
```

Health check: `GET http://localhost:5000/api/v1/health`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # then fill in your credentials
npm run dev                        # http://localhost:3000
```

### Environment Variables

**`backend/.env`**

| Variable | Purpose |
|---|---|
| `PORT` | API port (default `5000`) |
| `NODE_ENV` | `development` / `production` / `test` |
| `FRONTEND_URL` | Allowed CORS origin |
| `DATABASE_URL` | Supabase pooled connection string |
| `DIRECT_URL` | Direct connection, used by migrations |
| `CLERK_SECRET_KEY` | Verifies session tokens |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_WEBHOOK_SECRET` | Verifies Clerk webhook signatures |
| `REDIS_URL` | Optional. Omit to run in direct-DB mode |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Storage access |

**`frontend/.env.local`**

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL, e.g. `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` |

> Never commit real `.env` files. They are already listed in `.gitignore`.

### Local Auth Without Clerk

`backend/src/middleware/auth.middleware.ts` contains a development fallback: if
`CLERK_SECRET_KEY` is **not** set, the bearer token is treated directly as the `clerkId`.
This lets you exercise protected API routes locally using the seeded users:

```bash
# Candidate
curl http://localhost:5000/api/v1/applications/me \
  -H "Authorization: Bearer user_candidate_mock_789"

# Recruiter
curl http://localhost:5000/api/v1/recruiter/stats \
  -H "Authorization: Bearer user_recruiter_mock_456"

# Admin
curl http://localhost:5000/api/v1/admin/stats \
  -H "Authorization: Bearer user_admin_mock_123"
```

This fallback is for local development only — always set a real `CLERK_SECRET_KEY` in production.

### Development Auth Shim (frontend, local only)

The browser flow needs real Clerk keys, because Clerk's client script and
dev-browser handshake are served from the publishable key's domain. To browse the UI
locally without a Clerk account, the frontend ships an opt-in shim:

- `frontend/lib/dev-auth/clerk-client.tsx` — replaces `@clerk/nextjs`
- `frontend/lib/dev-auth/clerk-server.ts` — replaces `@clerk/nextjs/server`
- `frontend/next.config.js` — aliases those packages to the shims when `AUTH_SHIM=true`

The shim's `getToken()` returns a seeded `clerkId`, which the backend accepts via the
development fallback above, so the UI exercises the real API and database. The
signed-in persona can be switched at runtime from the avatar menu in the navbar
(Candidate / Recruiter / Admin), matching the seeded users.

Enable it in `frontend/.env.local`:

```
AUTH_SHIM=true
NEXT_PUBLIC_AUTH_SHIM=true
NEXT_PUBLIC_DEV_AUTH_DEFAULT=user_candidate_mock_789
```

> **Security:** the shim trusts the browser and bypasses authentication. It is gated
> behind an explicit env flag and is intended for local development only. Remove
> `AUTH_SHIM` (or set it to `false`) and configure real Clerk keys before deploying.

### Known Behaviour: Demo Fallback Data

`app/admin/page.tsx` starts from zeros and a loading state, so the governance dashboard
never displays fabricated figures. `app/jobs/page.tsx` still uses `FALLBACK_JOBS` (three
sample postings) for an instant landing preview; on API failure those samples remain on
screen, so verify real data is loading if you see suspiciously round numbers.

### `POST /recruiter/company` and Multiple Companies

`RecruiterService.createOrUpdateCompany` resolves the recruiter's company
deterministically (`orderBy: createdAt`):

- **0 companies** → creates one (`isApproved: false`, pending admin review), responds `201`.
- **1 company** → updates it, responds `200`.
- **2+ companies** → responds `409` with the list of conflicting companies instead of
  silently overwriting one.

The `409` guard matters because the seed data assigns all three companies (Google,
Amazon, Microsoft) to the single seeded recruiter, and a recruiter is meant to own one
company. Rather than arbitrarily picking one and renaming it, the endpoint now refuses
and names the conflict. To exercise the create/update path as intended, give each
company its own recruiter in `prisma/seed.ts`.

## Available Scripts

**Backend**

| Script | Description |
|---|---|
| `npm run dev` | Start with hot reload (`ts-node-dev`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |
| `npm run prisma:generate` | Regenerate the Prisma client |
| `npm run prisma:migrate` | Create/apply a dev migration |
| `npm run prisma:deploy` | Apply migrations in production |
| `npm run prisma:seed` | Seed starter data |

**Frontend**

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js in development |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## API Overview

Base URL: `/api/v1`. Responses follow `{ success, data, message }` or
`{ success, message, errors }`.

| Area | Endpoints |
|---|---|
| Auth/Users | `POST /webhooks/clerk`, `GET /users/me`, `PUT /users/me`, `POST /users/me/resume` |
| Jobs | `GET /jobs`, `GET /jobs/:id`, `POST /jobs`, `PUT /jobs/:id`, `DELETE /jobs/:id`, `POST /jobs/:id/save` |
| Applications | `POST /jobs/:id/apply`, `GET /applications/me`, `GET /recruiter/jobs/:id/applications`, `PATCH /applications/:id/status` |
| Preparation | `GET /topics`, `GET /topics/:id/questions`, `GET /questions/:id`, `GET /topics/:id/notes`, `GET /companies`, `GET /companies/:slug`, `POST /questions/:id/bookmark` |
| Quiz | `GET /quizzes`, `GET /quizzes/:id`, `POST /quizzes/:id/submit`, `GET /quizzes/attempts/me` |
| Progress | `PUT /progress/questions/:id`, `GET /progress/me` |
| Recruiter | `GET /recruiter/stats`, `GET /recruiter/jobs`, `POST /recruiter/company` |
| Admin | `GET /admin/stats`, `GET /admin/users`, `PATCH /admin/users/:id/role`, `PATCH /admin/recruiters/:id/approve`, admin content CRUD |

Import `postman/job-portal-collection.json` into Postman to explore these.

## Data Model

- **Users & Profiles**: `User`, `Profile`, `Company`
- **Job portal**: `Job`, `Application`, `SavedJob`
- **Preparation**: `Topic`, `Question`, `Note`, `CompanyGuide`, `Quiz`, `QuizQuestion`, `QuizAttempt`
- **Progress**: `UserProgress`, `BookmarkedQuestion`

Application status flow:

```
APPLIED -> UNDER_REVIEW -> SHORTLISTED -> INTERVIEW -> HIRED
                                     \-> REJECTED
```

## Security Notes

- Clerk tokens are verified on every protected route; roles are checked server-side (never trust the frontend).
- Ownership is enforced (recruiters can only manage their own jobs).
- All input is validated with Zod; Prisma parameterizes queries.
- CORS is restricted to `FRONTEND_URL`, plus Helmet security headers and Redis-backed rate limiting.
- Resumes live in a private bucket and are served via signed URLs.

## Deployment

| Part | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render / Railway (`npm run build` + `npm start`) |
| Database | Supabase (`npx prisma migrate deploy`) |
| Cache | Upstash / Railway Redis |

## Notes

- Redis is optional. Without `REDIS_URL` the API logs
  `[Redis] No REDIS_URL provided. Operating in direct database mode.` and skips caching.
- `npx prisma migrate dev` requires the ability to create a shadow database, so use `DIRECT_URL`.
