# System Architecture Design
> Case Study — All names, brands, and identifiers have been anonymized.

---

## 1. Overview

**Application**: Flight Crew Galley Management System (FCGMS)

A mobile-first web and native iOS application designed for airline cabin crew to manage onboard galley (kitchen) operations and inventory during flights. The system supports multiple airlines as independent tenants.

### Core Capabilities
- Select and track active flight details (aircraft, route, schedule)
- Browse product catalogs (food, beverages, supplies)
- Visualize galley layouts specific to aircraft type and flight duration
- Count and submit onboard inventory consumption
- Report operational issues (damage, missing items, misplacements)
- Manage user profiles and airline-specific configuration

---

## 2. Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 3 + custom design tokens |
| State Management | React Context API |
| Form Validation | React Hook Form + Zod |
| Database | PostgreSQL (managed via Supabase) |
| Auth | Supabase Auth (email/password + JWT) |
| Backend API | Next.js API Routes (serverless proxy layer) |
| Edge Functions | Supabase Edge Functions (Deno runtime) |
| Mobile Wrapper | Capacitor 7 (iOS native app) |
| Testing | Jest + React Testing Library |

---

## 3. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       iOS Native App                            │
│              (Capacitor WebView Wrapper)                        │
│                                                                 │
│   ┌───────────────────────┐   ┌────────────────────────────┐   │
│   │   Next.js Web App     │   │  Native Plugins            │   │
│   │   (Static Export)     │   │  Camera / Network /        │   │
│   │                       │   │  Filesystem / StatusBar    │   │
│   └──────────┬────────────┘   └────────────────────────────┘   │
└──────────────┼─────────────────────────────────────────────────┘
               │ HTTPS
               │
┌──────────────▼────────────────────────────────────────────────┐
│                React Frontend (Next.js App Router)            │
│                                                               │
│   ┌────────────────────────────────────────────────────────┐  │
│   │  Context Providers (global state)                      │  │
│   │  AuthContext  │  FlightContext  │  InventoryContext     │  │
│   └────────────────────────────────────────────────────────┘  │
│                                                               │
│   Pages: Home │ Galley │ Items │ Inventory │ Issues │ Profile │
│   Shared: Header, BottomNav, ProtectedRoute                   │
└──────────────┬──────────────────────────────┬────────────────┘
               │                              │
               │ REST (proxied)               │ Supabase SDK
               │                              │
┌──────────────▼──────────────┐  ┌────────────▼──────────────────┐
│  Next.js API Routes         │  │  Supabase                     │
│  /api/airline-ops/*         │  │                               │
│  /api/delete-account        │  │  ┌──────────────────────────┐ │
│                             │  │  │  PostgreSQL Database      │ │
│  - Proxy + JWT validation   │  │  │  (Multi-tenant, RLS)      │ │
│  - Airline credential       │  │  └──────────────────────────┘ │
│    injection                │  │                               │
└──────────────┬──────────────┘  │  ┌──────────────────────────┐ │
               │                  │  │  Supabase Auth           │ │
               │ Bearer token     │  │  (JWT, sessions)         │ │
               │                  │  └──────────────────────────┘ │
┌──────────────▼──────────────┐  │                               │
│  External Airline Ops API   │  │  ┌──────────────────────────┐ │
│  (Third-party, per airline) │  │  │  Edge Functions (Deno)   │ │
│                             │  │  │  delete-account          │ │
│  - Aircraft catalog         │  │  └──────────────────────────┘ │
│  - Flight schedules         │  └───────────────────────────────┘
│  - Galley profiles          │
│  - Item catalogs            │
│  - Inventory submission     │
└─────────────────────────────┘
```

---

## 4. Multi-Tenancy Model

The system is designed for multiple airlines operating independently as isolated tenants.

### Tenant Isolation

```
airlines (tenant root)
    │
    ├── profiles (users)
    ├── aircraft_types
    ├── item_categories
    ├── items
    ├── galley_configurations
    ├── trolley_configurations
    ├── item_positions
    ├── flights
    ├── flight_inventory
    └── issues
```

- Every domain table has an `airline_id` foreign key
- **Row-Level Security (RLS)** on all tables enforces tenant isolation at the database level
- Users can only see and modify data belonging to their own airline
- Each airline stores its own External Airline Ops API credentials in a settings JSON column

### Example Tenants (anonymized)

| Tenant | Notes |
|--------|-------|
| Airline 1 | Primary operator; UAT integration with External Ops API |
| Airline 2 | Secondary operator (schema supports additional tenants) |

---

## 5. Authentication & Authorization

### Authentication Flow

```
User                   Frontend                  Supabase Auth        DB (profiles)
 │                        │                           │                    │
 │──── email + pass ──────►│                           │                    │
 │                        │──── signIn() ─────────────►│                    │
 │                        │                           │── validate ────────►│
 │                        │◄────── JWT session ────────│                    │
 │                        │──── fetch profile ─────────────────────────────►│
 │                        │◄──── profile (role, airline) ───────────────────│
 │◄─── redirect home ─────│                           │                    │
```

### JWT & Session Management
- JWT tokens expire every 1 hour with refresh token rotation
- Session managed by Supabase Auth SDK, persisted in browser storage
- `authFetch` utility auto-attaches `Authorization: Bearer <token>` on all API calls

### Role-Based Authorization

| Role | Capabilities |
|------|-------------|
| `flight_attendant` | View data, create flights, submit inventory, create issues |
| `manager` | + Resolve issues, manage flight attendants |
| `admin` | Full control over all airline data |

### Row-Level Security Policies (RLS)

Two helper SQL functions underpin all policies:

```sql
auth.user_airline_id()   -- Returns airline_id from the user's profile
auth.user_has_role(role) -- Returns true if user has the specified role
```

Policy examples:
- **Airlines**: `SELECT` only the user's own airline
- **Items**: All authenticated users can `SELECT`; only admins can `INSERT/UPDATE/DELETE`
- **Flights**: All authenticated users can `SELECT/INSERT`; admins can delete
- **Issues**: All authenticated users can `SELECT`; flight attendants can `INSERT`; managers/admins can `UPDATE`

---

## 6. Database Schema

### Core Tables

```
┌──────────────┐         ┌──────────────┐
│   airlines   │◄────────│   profiles   │
│──────────────│  1:N    │──────────────│
│ id (PK)      │         │ id (PK)      │
│ name         │         │ auth_user_id │
│ code         │         │ airline_id   │
│ settings     │         │ first_name   │
│   (JSONB)    │         │ last_name    │
└──────────────┘         │ employee_id  │
                         │ position     │
                         │ role         │
                         └──────────────┘

┌──────────────────┐      ┌───────────────────┐
│  aircraft_types  │      │  item_categories  │
│──────────────────│      │───────────────────│
│ id               │      │ id                │
│ airline_id       │      │ airline_id        │
│ code             │      │ name              │
│ description      │      │ parent_id (→self) │
│ registration     │      └───────────────────┘
│ metadata (JSONB) │
└──────────────────┘      ┌───────────────┐
                          │     items     │
                          │───────────────│
                          │ id            │
                          │ airline_id    │
                          │ code          │
                          │ description   │
                          │ category_id   │
                          │ uom           │
                          │ is_common     │
                          │ is_alcoholic  │
                          └───────────────┘

┌─────────────────────────┐    ┌──────────────────────┐
│  galley_configurations  │    │  trolley_configurations│
│─────────────────────────│    │──────────────────────│
│ id                      │    │ id                   │
│ airline_id              │    │ galley_config_id     │
│ aircraft_type_id        │    │ layout_data (JSONB)  │
│ name                    │    └──────────────────────┘
│ position_data (JSONB)   │
└─────────────────────────┘

┌──────────────────┐       ┌────────────────────┐
│    flights       │       │  flight_inventory  │
│──────────────────│  1:N  │────────────────────│
│ id               │◄──────│ id                 │
│ airline_id       │       │ flight_id          │
│ flight_number    │       │ item_id            │
│ aircraft         │       │ starting_qty       │
│ origin           │       │ consumed           │
│ destination      │       │ remaining          │
│ departure_date   │       │ pct_remaining      │
│ status           │       │ bottle_levels(JSON)│
└──────────────────┘       │ checked            │
                           │ notes              │
                           └────────────────────┘

┌──────────────────┐       ┌──────────────────────┐
│     issues       │       │    audit_logs        │
│──────────────────│       │──────────────────────│
│ id               │       │ id                   │
│ airline_id       │       │ airline_id           │
│ flight_id        │       │ table_name           │
│ type (enum)      │       │ record_id            │
│ severity         │       │ action               │
│ status           │       │ old_data (JSONB)     │
│ pax_affected     │       │ new_data (JSONB)     │
│ resolved_by      │       │ performed_by         │
│ resolved_at      │       └──────────────────────┘
└──────────────────┘
```

### Schema Design Principles
- UUID primary keys via `pgcrypto`
- JSONB columns for flexible metadata (galley layouts, integration credentials, bottle levels)
- Cascading deletes on `airline_id` FK ensures clean tenant removal
- Indexes on `airline_id`, `flight_id`, `departure_date` for query performance
- Enum check constraints for status, role, issue type

---

## 7. API Layer

### Next.js API Routes (Proxy Layer)

All routes require `Authorization: Bearer <JWT>` and use `getAirlineCredentials()` to:
1. Decode JWT to get `user_id`
2. Look up the user's `airline_id` and settings
3. Inject the airline's External Ops API credentials into the proxied request

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/airline-ops/aircraft` | List aircraft types for this airline |
| `GET` | `/api/airline-ops/items` | List product catalog items |
| `GET` | `/api/airline-ops/flights/[year]/[month]` | Get published flights for date range |
| `GET` | `/api/airline-ops/galley/[aircraft]?duration=<min>` | Get galley profiles for aircraft type |
| `POST` | `/api/airline-ops/inventory` | Submit final inventory count to airline system |
| `POST` | `/api/delete-account` | Delete user account (auth + profile) |

### External Airline Ops API (Third-party)

The External Ops API is a per-airline third-party system that provides master data and receives inventory submissions. Credentials (base URL + token) are stored per-airline in `airlines.settings`.

**Key Data Types**

```
Aircraft
  code, description, type, economy_seats, business_seats

Item
  code, item_type, description, category, sub_category

GalleyProfile
  id, aircraft, profile_name, duration_minutes
  rooms[]: { room_id, name, boxes }
  boxes: { type, title, cart_type, display_text }

Flight
  flight_number, aircraft, origin, destination,
  departure_datetime, arrival_datetime, duration_minutes

InventorySubmission
  flight_number, aircraft, origin, destination,
  flight_date, galley_profile_id, submitted_at, submitted_by
  items[]: { item_code, room_id, box_id,
             qty_loaded, qty_consumed, qty_remaining }
```

### Galley Profile Matching Logic

Galley profiles are tied to flight duration tiers (minutes):
`200 | 240 | 300 | 480 | 720 | 900`

The system selects the closest matching tier profile for the active flight duration using `matchDurationTier()` → `pickGalleyProfile()`.

---

## 8. Frontend Architecture

### Page Map

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login/Signup | Email + password auth; role + airline selection on signup |
| `/` | Home/Dashboard | Flight search, active flight banner, quick-action shortcuts |
| `/galley` | Galley View | Visual layout of galleys and trolley boxes by aircraft |
| `/items` | Product Catalog | Searchable/filterable item browser |
| `/inventory` | Inventory Count | Per-item quantity tracking + submission to airline system |
| `/issues` | Issue Reporting | Log damage, misplacement, missing items with severity |
| `/profile` | User Profile | Edit personal details; account deletion |

### State Management (React Context)

```
RootLayout
  └── AuthContextProvider          ← session, profile, sign in/out
        └── FlightContextProvider  ← active flight selection
              └── InventoryContextProvider  ← item catalog + consumption
                    └── Page Components
```

**AuthContext**
- Initializes from Supabase session on mount
- Listens to `onAuthStateChange` events
- Exposes: `user`, `session`, `profile`, `signIn()`, `signUp()`, `signOut()`

**FlightContext**
- Holds the currently selected flight (React state, not persisted to DB)
- Populated from External Ops API flight search on Home page
- Consumed by Galley and Inventory pages for context

**InventoryContext**
- Manages item consumption data
- Persists counts to `flight_inventory` table via Supabase client
- Exposes: `items`, `updateConsumption()`, `toggleChecked()`, `getItemTotals()`

### Protected Route Pattern

```tsx
<ProtectedRoute>
  {/* Redirects to /login if no active session */}
  <PageContent />
</ProtectedRoute>
```

---

## 9. Mobile (iOS) Integration

### Build & Deployment Pipeline

```
Next.js Source
    │
    │  npm run build
    ▼
/out (static HTML/JS/CSS export)
    │
    │  npx cap sync
    ▼
ios/App/ (Xcode project with Capacitor bridge)
    │
    │  Xcode build
    ▼
iOS App (.ipa)
```

### Capacitor Configuration

| Setting | Value |
|---------|-------|
| App ID | `com.[airline].app` (anonymized) |
| Web Dir | `out` |
| Platform | iOS (+ Android-ready) |
| Splash | Auto-hide, 0ms, brand blue background |
| StatusBar | Light style, brand blue |

### Native Plugins Used

| Plugin | Purpose |
|--------|---------|
| Camera | Photo capture (issue attachments, future use) |
| Filesystem | Local file read/write (caching, exports) |
| Network | Detect online/offline status |
| StatusBar | Control iOS status bar appearance |
| App | Handle app lifecycle events |

### Platform Detection

API calls check `window.Capacitor?.isNativePlatform()` to route to native-specific endpoints where needed (e.g., account deletion calls a Supabase Edge Function URL directly on native vs. the `/api` proxy on web).

---

## 10. Edge Functions

### `delete-account` (Deno / Supabase Edge)

```
Client (with Bearer JWT)
    │
    ▼
Edge Function: delete-account
    ├── Validate JWT (Supabase service role)
    ├── DELETE FROM profiles WHERE auth_user_id = user_id
    └── supabase.auth.admin.deleteUser(user_id)
```

Used for GDPR-style account removal. Called directly on native (bypasses Next.js) and via `/api/delete-account` proxy on web.

---

## 11. Key Data Flows

### Flight Selection Flow

```
Home Page
  │
  ├─ User enters flight number
  │
  ├─ GET /api/airline-ops/flights/[year]/[month]
  │    └── Returns flights from External Ops API
  │
  ├─ User selects flight from list
  │
  └─ FlightContext.setActiveFlight(flight)
       └── Active flight propagates to all pages via context
```

### Inventory Count & Submission Flow

```
Inventory Page
  │
  ├─ Reads active flight from FlightContext
  │
  ├─ GET /api/airline-ops/galley/[aircraft]?duration=<min>
  │    └── matchDurationTier() picks closest profile
  │
  ├─ GET /api/airline-ops/items
  │    └── Populates item list per galley room/box
  │
  ├─ User enters consumed quantities per item
  │    └── InventoryContext.updateConsumption() → upsert flight_inventory
  │
  └─ User submits
       └─ POST /api/airline-ops/inventory
            └── Payload: flight + galley profile + item counts
```

### Issue Reporting Flow

```
Issues Page
  │
  ├─ User selects type (damage / missing / misplaced / customer)
  ├─ User selects severity
  ├─ User enters description + passengers affected
  │
  └─ INSERT INTO issues (airline_id, flight_id, type, severity, ...)
       └── RLS ensures only flight_attendants can INSERT
```

---

## 12. Security Model Summary

| Concern | Approach |
|---------|----------|
| Authentication | Supabase Auth JWT (email/password) |
| API Authorization | Bearer token required on all API routes |
| Data Isolation | PostgreSQL RLS — all queries filtered by `airline_id` |
| Tenant Credentials | Stored in `airlines.settings` JSONB, never exposed to client |
| Admin Operations | Service role key only used server-side (Edge Functions) |
| Role Enforcement | DB-level RLS policies check `user_has_role()` |
| External API Proxy | Next.js routes inject credentials server-side; client never sees them |

---

## 13. Deployment Summary

| Environment | Component | Hosting |
|-------------|-----------|---------|
| Frontend | Next.js web app | Vercel (or equivalent) |
| Database | PostgreSQL | Supabase managed cloud |
| Auth | Supabase Auth | Supabase managed cloud |
| Edge Functions | Deno runtime | Supabase Edge |
| iOS App | Native wrapper | App Store distribution |
| External Ops API | Third-party | Airline 1's own infrastructure |

---

*This document is anonymized for case study purposes. All airline names, API endpoints, credentials, and identifiers have been replaced with generic references.*
