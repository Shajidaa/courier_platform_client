# CourierPro — Client

Frontend for the CourierPro logistics platform. Built with Next.js 16, React 19, Tailwind CSS v4, and shadcn/ui.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Icons | Lucide React |
| Theme | next-themes (light / dark / system) |
| Language | TypeScript 5 (strict mode) |
| Package manager | pnpm |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- The [server](../courier_platform_server_side) running on port `5000`

### Install

```bash
pnpm install
```

### Environment

Create a `.env.local` file in this directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Run

```bash
pnpm dev       # development server → http://localhost:3000
pnpm build     # production build
pnpm start     # serve production build
pnpm typecheck # TypeScript check
pnpm lint      # ESLint
pnpm format    # Prettier
```

---

## Project Structure

```
courier_platform_client/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth pages — uses AuthLayout (split panel)
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   └── forgot-password/
│   ├── (public)/               # Public landing page — uses Nav
│   └── (dashboard)/            # Protected — uses AuthGuard + DashboardShell
│       └── dashboard/
│           ├── page.tsx        # Redirects to role home
│           ├── sender/         # SENDER dashboard
│           ├── rider/          # RIDER dashboard
│           ├── hub-manager/    # HUB_MANAGER dashboard
│           ├── ops-manager/    # OPS_MANAGER dashboard
│           ├── support/        # SUPPORT_AGENT dashboard
│           ├── admin/          # ADMIN / SUPER_ADMIN dashboard
│           ├── hubs/[id]/      # Hub detail (all read roles)
│           └── profile/        # Account settings (all roles)
├── api/                        # API call functions (fetch wrappers)
│   ├── auth.api.ts
│   ├── user.api.ts
│   └── hub.api.ts
├── components/
│   ├── auth/                   # Login, register, verify-email, forgot-password forms
│   ├── dashboard/              # Profile page, stat card
│   ├── hubs/                   # Hub list, hub detail, hub form, assign manager
│   ├── layout/                 # AuthGuard, RoleGuard, DashboardShell, DashboardNav
│   ├── shared/                 # Nav, Footer
│   └── ui/                     # Button, Input, Modal, ThemeToggle
├── config/
│   └── nav.config.ts           # Per-role sidebar nav items
├── hooks/
│   ├── use-auth.ts             # Login, register, verify, logout
│   ├── use-profile.ts          # GET/PATCH /user/me, change-password
│   └── use-hubs.ts             # Hub CRUD + pagination
├── lib/
│   ├── api-client.ts           # Base fetch wrapper (credentials: include)
│   ├── token.ts                # JWT parse + localStorage helpers
│   └── utils.ts                # cn()
└── types/
    ├── auth.types.ts           # Auth payloads and responses
    ├── user.types.ts           # User, Profile, update payloads
    ├── hub.types.ts            # Hub, area, CRUD payloads
    └── roles.ts                # Role enum, ROLE_HOME map
```

---

## Authentication Flow

```
POST /auth/login
  → stores accessToken in localStorage
  → parses JWT to get role
  → redirects to role-specific dashboard

POST /user/register
  → redirects to /verify-email?email=...

POST /user/verify-email  (OTP)
  → stores accessToken
  → redirects to role-specific dashboard

POST /auth/logout
  → clears token
  → redirects to /login

POST /user/forgot-password  → sends OTP to email
POST /user/reset-password   → verifies OTP, sets new password
```

---

## Role-Based Access

Each role has its own dashboard route. Attempting to access another role's route redirects silently to your own dashboard.

| Role | Dashboard |
|---|---|
| `SENDER` | `/dashboard/sender` |
| `RIDER` | `/dashboard/rider` |
| `HUB_MANAGER` | `/dashboard/hub-manager` |
| `OPS_MANAGER` | `/dashboard/ops-manager` |
| `SUPPORT_AGENT` | `/dashboard/support` |
| `ADMIN` | `/dashboard/admin` |
| `SUPER_ADMIN` | `/dashboard/admin` |

Hub routes access by role:

| Route | Allowed roles |
|---|---|
| `GET /hubs` | ADMIN, SUPER_ADMIN, OPS_MANAGER, HUB_MANAGER |
| `POST /hubs` | ADMIN, SUPER_ADMIN |
| `PATCH /hubs/:id` | ADMIN, SUPER_ADMIN |
| `PATCH /hubs/:id/assign-manager` | ADMIN, SUPER_ADMIN |
| `DELETE /hubs/:id` | ADMIN, SUPER_ADMIN |

---

## API Client

All API calls use `credentials: "include"` so the server's httpOnly cookies (`accessToken`, `refreshToken`) are sent automatically. The access token is also stored in `localStorage` for client-side JWT parsing (role, name, email).

Protected endpoints additionally send `Authorization: Bearer <token>` from localStorage.

---

## Theme

Supports light, dark, and system themes via `next-themes`. Toggle with:
- The sun/moon button in the navbar or dashboard topbar
- Keyboard shortcut `D`
