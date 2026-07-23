# Car Dealership Inventory System

A full-stack RESTful Car Dealership Inventory System built with Node.js, Express, PostgreSQL, Jest, React, and Tailwind CSS.

## Feature Implementation Progress

### Phase 1: Authentication & Authorization
- [x] **Feature 1.1**: Project setup & database pool connection configuration.
- [x] **Feature 1.2**: User Registration (`POST /api/auth/register` with bcrypt password hashing).
- [x] **Feature 1.3**: User Login (`POST /api/auth/login` returning JWT token).
- [x] **Feature 1.4**: JWT Authentication & Authorization Middleware (`verifyToken`, `requireAdmin`).

### Phase 2: Vehicle CRUD
- [x] **Feature 2.1**: Add Vehicle (`POST /api/vehicles`).
- [x] **Feature 2.2**: List All Vehicles (`GET /api/vehicles`).
- [x] **Feature 2.3**: Update Vehicle (`PUT /api/vehicles/:id`).
- [x] **Feature 2.4**: Delete Vehicle (`DELETE /api/vehicles/:id` - Admin only).

### Phase 3: Search & Filtering
- [x] **Feature 3.1**: Vehicle Search (`GET /api/vehicles/search` by make, model, category, price range).

### Phase 4: Purchase Workflow
- [ ] **Feature 4.1**: Purchase Vehicle (`POST /api/vehicles/:id/purchase` - stock decrement & record transaction).

---

## Test Execution Report
- `POST /api/auth/register`: PASS (3/3 tests passed)
- `POST /api/auth/login`: PASS (4/4 tests passed)
- Auth & Authorization Middleware (`verifyToken`, `requireAdmin`): PASS (6/6 tests passed)
- Vehicle CRUD API (`POST`, `GET`, `PUT`, `DELETE /api/vehicles`): PASS (7/7 tests passed)
- Vehicle Search & Filter (`GET /api/vehicles/search`): PASS (4/4 tests passed)
- **Total Test Pass Rate**: 24/24 passed (100%)

---

## My AI Usage

### AI Tools Used
- **Antigravity AI Assistant** (powered by Gemini 3.6 Flash)

### How AI Was Utilized
- Generated Express controllers and routes for User Auth, Vehicle CRUD, and Vehicle Search.
- Implemented PostgreSQL dynamic multi-criteria SQL query builder with fallback memory layer.
- Built Jest + Supertest integration tests for Search & Filtering adhering to TDD patterns.

### Reflection on AI Impact
AI significantly accelerated boilerplate creation, database query handling, authentication flows, middleware security, search algorithms, and test-driven development cycles.
