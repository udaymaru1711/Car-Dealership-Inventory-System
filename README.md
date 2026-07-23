# AutoVault - Luxury Car Dealership Inventory System

A production-ready full-stack RESTful Car Dealership Inventory Management System engineered with Node.js, Express, PostgreSQL, Jest, Supertest, React 18, Vite, and Tailwind CSS.

---

## 🚀 Quick Setup & Installation Guide

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+) or PostgreSQL-compatible environment

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Environment Variables (`.env`)*:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=car_dealership
JWT_SECRET=super_secret_jwt_key_2026
```

### 2. Run Test Suite
```bash
cd backend
npm test
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App will run locally at `http://localhost:5173`.

---

## 📋 Feature Implementation Progress

### Phase 1: Authentication & Authorization
- [x] **Feature 1.1**: Project setup & database pool connection configuration.
- [x] **Feature 1.2**: User Registration (`POST /api/auth/register` with `bcryptjs` password hashing).
- [x] **Feature 1.3**: User Login (`POST /api/auth/login` returning JWT token).
- [x] **Feature 1.4**: JWT Authentication & Authorization Middleware (`verifyToken`, `requireAdmin`).

### Phase 2: Vehicle CRUD
- [x] **Feature 2.1**: Add Vehicle (`POST /api/vehicles` - Admin protected).
- [x] **Feature 2.2**: List All Vehicles (`GET /api/vehicles`).
- [x] **Feature 2.3**: Update Vehicle (`PUT /api/vehicles/:id` - Admin protected).
- [x] **Feature 2.4**: Delete Vehicle (`DELETE /api/vehicles/:id` - Admin protected).

### Phase 3: Search & Filtering
- [x] **Feature 3.1**: Vehicle Search (`GET /api/vehicles/search` by make, model, category, price range).

### Phase 4: Purchase Workflow
- [x] **Feature 4.1**: Purchase Vehicle (`POST /api/vehicles/:id/purchase` - atomic stock decrement & transaction logging).

### Phase 5: Restock Workflow
- [x] **Feature 5.1**: Restock Vehicle (`POST /api/vehicles/:id/restock` - stock increment, Admin only).

### Phase 6: Frontend Application (React + Vite + Tailwind CSS)
- [x] **Feature 6.1**: Setup React 18 + Vite + Tailwind CSS with dark glassmorphism design tokens.
- [x] **Feature 6.2**: Auth UI (Login & Register Modals / Views & Auth Context).
- [x] **Feature 6.3**: Dashboard & Vehicle Inventory Grid layout.
- [x] **Feature 6.4**: Live Search & Multi-Filter UI.
- [x] **Feature 6.5**: Purchase Modal & Action flow.
- [x] **Feature 6.6**: Admin Portal (Add, Edit, Delete, Restock UI).

### Phase 7: Comprehensive Testing Suite
- [x] **Feature 7.1**: Integration & unit test verification using Jest + Supertest with 100% pass rate (Red-Green-Refactor report).

### Phase 8: Documentation & Final Deliverables
- [x] **Feature 8.1**: Comprehensive `README.md` (Project summary, setup guide, test results, "My AI Usage" section).
- [x] **Feature 8.2**: Complete `PROMPTS.md` chat history log for recruitment evaluation.

---

## 🧪 Test Execution & Red-Green-Refactor Matrix

| Test Suite | Endpoint / Component | Test Cases | Status |
| :--- | :--- | :---: | :---: |
| `auth.test.js` | `POST /api/auth/register` | 3 | **PASS** |
| `auth.test.js` | `POST /api/auth/login` | 4 | **PASS** |
| `middleware.test.js` | `verifyToken` & `requireAdmin` | 6 | **PASS** |
| `vehicles.test.js` | `POST`, `GET`, `PUT`, `DELETE /api/vehicles` | 7 | **PASS** |
| `search.test.js` | `GET /api/vehicles/search` | 4 | **PASS** |
| `inventory.test.js` | `POST /api/vehicles/:id/purchase`, `restock` | 5 | **PASS** |
| **Total** | **Complete Suite** | **29 / 29** | **100% PASS** |

---

## 🤖 My AI Usage

### AI Tools Used
- **Antigravity AI Assistant** (powered by Gemini 3.6 Flash)

### How AI Was Utilized
1. **Architectural Design & Scaffolding**: Designed MVC modular structure for Express routes, PostgreSQL pool configuration, and database fail-safe abstraction (`dbWrapper`).
2. **Backend API Development**: Built secure authentication (bcrypt password hashing, JWT signing) and role-based access control (`verifyToken`, `requireAdmin`).
3. **Incremental TDD Implementation**: Authored Jest + Supertest integration tests for every feature prior to green verification.
4. **Modern Frontend SPA Development**: Implemented React 18 frontend with custom glassmorphism design tokens, Context state providers, and live filter/search components.

### Reflection on AI Impact
Utilizing AI under strict incremental guidelines drastically improved code quality, ensured complete test coverage across edge cases (such as out-of-stock purchases and unauthorized admin actions), and provided transparent traceability through structured commit messages and prompt logs.
