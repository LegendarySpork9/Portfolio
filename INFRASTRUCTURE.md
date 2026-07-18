# Portfolio - Infrastructure Document

## Overview

Portfolio is a self-hosted web application for showcasing software projects. It consists of a React single-page application for the frontend and a Node.js/Express proxy server that sits between the frontend and a backend API. The site displays project cards with summaries, GitHub CI status, issue breakdowns, build history, media carousels, LLM usage tracking, and supports admin features for managing portfolio items and filters.

- **Author:** Hunter Industries / Toby Hunter
- **Repository:** https://github.com/LegendarySpork9/Portfolio

## Technology Stack

### Frontend (Portfolio)

| Component | Technology | Version |
|---|---|---|
| Framework | React | 19.1.1 |
| Language | TypeScript | 4.9.5 |
| Build Tool | Create React App (react-scripts) | 5.0.1 |
| Routing | react-router-dom | 7.9.6 |
| UI Library | Material UI (@mui/material) | 7.3.5 |
| Charts | MUI X Charts (@mui/x-charts) | 9.8.0 |
| Data Fetching | TanStack React Query | 5.101.2 |
| HTTP Client | Axios | 1.18.1 |
| Markdown Rendering | markdown-to-jsx | 9.8.2 |
| Testing | React Testing Library | 16.3.0 |

### Backend (Portfolio.Proxy)

| Component | Technology | Version |
|---|---|---|
| Runtime | Node.js | - |
| Language | TypeScript | 6.0.3 |
| Framework | Express | 5.2.1 |
| HTTP Client | Axios | 1.18.1 |
| Session Management | express-session | 1.19.0 |
| CORS | cors | 2.8.6 |
| File Upload | Multer | 2.2.0 |
| Environment Config | dotenv | 17.4.2 |
| TypeScript Runner | ts-node | 10.9.2 |

## Project Structure

```
Portfolio/
+-- Portfolio/                          # React frontend (Create React App)
|   +-- public/                         # Static assets (index.html, icons, images)
|   +-- src/
|   |   +-- API/                        # API client, endpoints, and service modules
|   |   +-- Components/                 # Reusable UI components
|   |   |   +-- Cards/                  # Portfolio, item, filter, and detail cards
|   |   |   |   +-- Filters/            # Filter card
|   |   |   |   +-- Items/              # Portfolio card, item card, detail cards (view/create)
|   |   |   +-- Carousel/              # Image carousel
|   |   |   +-- Dialogs/               # Login form, summary box, upcoming projects, filter form
|   |   |   +-- Dropdowns/             # Custom and MUI dropdowns
|   |   |   +-- Navbar/                # Top navigation bar
|   |   |   +-- Sidebars/              # Left (admin nav) and right (filters) sidebars
|   |   |   +-- Snackbar/              # Alert notifications
|   |   |   +-- Tables/                # Build history, image, GitHub, and LLM usage tables
|   |   +-- Contexts/                   # Auth context provider
|   |   +-- Hooks/                      # React Query hooks per domain
|   |   +-- Lib/                        # Query client configuration and cache keys
|   |   +-- Pages/                      # Route-level page components
|   |   |   +-- Home/                   # Main portfolio grid with filters
|   |   |   +-- Filters/               # Admin filter management
|   |   |   +-- Items/                  # Item detail view and item list
|   |   +-- Types/                      # TypeScript type definitions
+-- Portfolio.Proxy/                    # Express proxy server
|   +-- src/
|   |   +-- Types/                      # TypeScript type definitions
|   +-- dist/                           # Compiled output
```

## Application Architecture

### Two-Tier Proxy Pattern

```
Browser ──► React App (SPA) ──► Portfolio.Proxy (Express) ──► Hunter Industries API
                                       │
                                       ├── Session management
                                       ├── Service account auth
                                       ├── Media file storage
                                       └── User validation
```

The proxy server handles authentication, session management, and media file storage, keeping API credentials and service account details out of the browser.

### Frontend Architecture

#### Rendering Model

The application is a **React SPA** bootstrapped with Create React App. It uses client-side routing via React Router v7 and server-state management via TanStack React Query.

#### Routes

| Route | Page | Access | Purpose |
|---|---|---|---|
| `/` | Home | Public | Portfolio grid with filter sidebar |
| `/filters` | Filters | Admin | Create, update, and delete filters |
| `/items` | ListItem | Admin | List all portfolio items (including deleted) |
| `/item?mode=create` | Item | Admin | Create a new portfolio item |
| `/item/:id?mode=view` | Item | Public | View portfolio item details |
| `/item/:id?mode=update` | Item | Admin | Edit an existing portfolio item |

#### React Query Configuration

| Setting | Value |
|---|---|
| Stale Time | 3 minutes |
| Refetch on Window Focus | Disabled |
| Query Retries | 2 (with exponential backoff, capped at 80 seconds) |
| Mutation Retries | 1 (1-second delay) |
| 4xx Error Retries | Disabled |

#### Key UI Components

| Component | Purpose |
|---|---|
| `Navbar` | Top bar with title, GitHub link, upcoming projects button, login/logout |
| `LeftSidebar` | Collapsible admin navigation (Home, Edit Items, Edit Filters, Logout) |
| `RightSidebar` | Collapsible filter controls with type-specific inputs |
| `PortfolioCard` | Project card with icon, name, GitHub status indicator, last release date |
| `SummaryBox` | Modal dialog with project summary, tags, CI status, and pie chart |
| `ViewItemDetailCard` | Full read-only project detail with charts, tables, carousel, and metadata |
| `CreateItemDetailCard` | Form for creating/updating items with media upload |
| `Carousel` | Image carousel with navigation controls |
| `LoginForm` | Username/password dialog with SHA-512 client-side hashing |
| `UpcomingProjects` | Dialog rendering a markdown file fetched from GitHub |

#### Filter System

The frontend implements six filter types with client-side matching:

| Type | Operators | Purpose |
|---|---|---|
| `tag` | Contains | Multi-select matching against array fields (frameworks, languages, environments) |
| `numeric` | Equals, Not Equals, Greater Than, Less Than, Between | Numeric field comparison |
| `text` | Contains, Not Contains, Equals, Not Equals, Starts With, Ends With | String field matching |
| `boolean` | Is True, Is False | Boolean field checks |
| `null` | Has Value, Has No Value | Null/empty checks |
| `comparison` | All numeric operators | Compare two numeric fields against each other |

#### Data Visualisation

| Chart | Library | Purpose |
|---|---|---|
| Pie Chart | @mui/x-charts | Bug vs New Feature issue ratio |
| Horizontal Bar Chart | @mui/x-charts | Issue count per assignee |

### Backend Architecture (Proxy)

#### Middleware Stack

1. `express.json()` — JSON body parsing
2. `cors()` — Cross-origin requests from the frontend origin with credentials
3. `express-session()` — Server-side session with httpOnly cookies (1-hour TTL)
4. `express.static()` — Serve uploaded media files

#### Service Account Authentication

The proxy authenticates with the backend API using a dedicated service account:

1. Sends Basic Auth credentials to `/auth/token` with an authentication phrase
2. Receives a JWT bearer token with expiration time
3. Caches the token in memory and refreshes 60 seconds before expiry
4. All proxied requests include the bearer token in the Authorization header

#### Route Groups

| Group | Auth Required | Routes |
|---|---|---|
| Authentication | No | `POST /auth/login`, `POST /auth/logout`, `GET /auth/status` |
| Read | No | `GET /filter`, `GET /item`, `GET /item/:id`, `GET /media/:id` |
| Metrics | No | `POST /metric` |
| Filter Management | Yes | `POST /filter`, `PATCH /filter/:id`, `DELETE /filter/:id` |
| Item Management | Yes | `POST /item`, `PATCH /item/:id`, `DELETE /item/:id` |
| Media Management | Yes | `POST /media/upload/:id`, `POST /media/:id`, `PATCH /media/:id`, `DELETE /media/:id` |

#### Media Handling

- **Upload:** Files received via `multer` (memory storage), written to `MEDIA_PATH`, then registered with the backend API
- **Serving:** Static files served from `MEDIA_PATH` via Express static middleware
- **Deletion:** Optionally removes files from disk and deletes the API record

## Authentication and Security

### User Authentication Flow

1. User enters credentials in the `LoginForm` dialog
2. Password is hashed with **SHA-512** on the client before transmission
3. Proxy validates the user against the backend API (checks existence, deletion status, and "Portfolio API" scope)
4. Session is created with `authenticated=true` and `username` stored
5. Browser receives an `httpOnly` session cookie (`connect.sid`)
6. Protected routes check `req.session.authenticated` via `requireAuth` middleware

### Session Configuration

| Setting | Value |
|---|---|
| Cookie Name | `connect.sid` |
| HTTP Only | Yes |
| SameSite | Lax |
| Max Age | 1 hour |
| Resave | No |
| Save Uninitialized | No |

### CORS Configuration

- **Allowed Origin:** Configured via `CLIENT_ORIGIN` environment variable
- **Credentials:** Enabled (cookies and Authorization headers)

## Configuration

### Frontend Environment Variables

| Variable | Dev Value | Production Value | Purpose |
|---|---|---|---|
| `BROWSER` | `none` | - | Prevent browser auto-open on start |
| `REACT_APP_API_URL` | `http://localhost:3001` | `/api` | Proxy server base URL |
| `REACT_APP_GITHUB_OWNER` | `LegendarySpork9` | `LegendarySpork9` | GitHub owner for upcoming projects |
| `REACT_APP_GITHUB_REPO` | `UpcomingProjects` | `UpcomingProjects` | GitHub repo for upcoming projects |
| `REACT_APP_GITHUB_FILE_PATH` | `README.md` | `README.md` | Markdown file to fetch |

### Backend Environment Variables

| Variable | Purpose |
|---|---|
| `API_URL` | Backend API base URL |
| `API_USERNAME` | Service account username |
| `API_PASSWORD` | Service account password |
| `API_PHRASE` | Authentication phrase for token request |
| `SESSION_SECRET` | Session encryption key |
| `CLIENT_ORIGIN` | Allowed CORS origin |
| `PORT` | Express server port |
| `MEDIA_PATH` | Local path for media file storage |
| `MEDIA_DOMAIN` | Public domain for media URL construction |
| `MEDIA_SITE_PATH` | Site-specific media path |

## External Integrations

### Hunter Industries API

- **Protocol:** REST over HTTPS
- **Authentication:** Bearer token (obtained via Basic auth + phrase)
- **Proxied Endpoints:** Auth, users, portfolio items, filters, media, metrics

### GitHub

- **Integration:** Raw content fetch from `raw.githubusercontent.com`
- **Purpose:** Fetch the "Upcoming Projects" README.md for display in a dialog
- **Repository:** `LegendarySpork9/UpcomingProjects`

## Theming

The application uses a **dark theme** defined in `Colours.css`:

| Variable | Value | Purpose |
|---|---|---|
| `--colour-text` | `white` | Primary text colour |
| `--colour-body` | `#313131` | Page background |
| `--colour-object` | `#3E3E3E` | Card and component backgrounds |
| `--colour-object-child` | `#4A4A4A` | Nested component backgrounds |
| `--colour-object-input` | `#3a3a3a` | Input field backgrounds |
| `--colour-sidebar` | `#4E4E4E` | Sidebar background |
| `--colour-sidebar-border` | `#2f2f2f` | Sidebar border |

## CI/CD

No GitHub Actions workflows are configured for this project.

## Hosting Requirements

### Frontend

- Node.js (for building via `react-scripts build`)
- Static file hosting for the production build output
- Font: Nunito (loaded from Google Fonts CDN)

### Backend (Proxy)

- Node.js runtime
- Windows (if using `C:/inetpub/wwwroot` for media storage) or configurable via `MEDIA_PATH`
- Outbound HTTPS to the backend API URL
- Outbound HTTPS to `raw.githubusercontent.com` (via frontend)

### Development Ports

| Component | URL |
|---|---|
| React Frontend | `http://localhost:3000` |
| Express Proxy | `http://localhost:3001` |
