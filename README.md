# Car Dealership Inventory System

A full-stack RESTful Car Dealership Inventory System built with Node.js, Express, PostgreSQL, Jest, React, and Tailwind CSS.

## Feature Implementation Progress

### Phase 1: Authentication & Authorization
- [x] **Feature 1.1**: Project setup & database pool connection configuration.
- [x] **Feature 1.2**: User Registration (`POST /api/auth/register` with bcrypt password hashing).
- [x] **Feature 1.3**: User Login (`POST /api/auth/login` returning JWT token).
- [x] **Feature 1.4**: JWT Authentication & Authorization Middleware (`verifyToken`, `requireAdmin`).

### Phase 2: Vehicle CRUD
- [ ] **Feature 2.1**: Add Vehicle (`POST /api/vehicles`).
- [ ] **Feature 2.2**: List All Vehicles (`GET /api/vehicles`).
- [ ] **Feature 2.3**: Update Vehicle (`PUT /api/vehicles/:id`).
- [ ] **Feature 2.4**: Delete Vehicle (`DELETE /api/vehicles/:id` - Admin only).

---

## Test Execution Report
- `POST /api/auth/register`: PASS (3/3 tests passed)
- `POST /api/auth/login`: PASS (4/4 tests passed)
- Auth & Authorization Middleware (`verifyToken`, `requireAdmin`): PASS (6/6 tests passed)
- **Total Test Pass Rate**: 13/13 passed (100%)

---

## My AI Usage

### AI Tools Used
- **Antigravity AI Assistant** (powered by Gemini 3.6 Flash)

### How AI Was Utilized
- Generated Express controller and route structures for `POST /api/auth/register` and `POST /api/auth/login`.
- Created PostgreSQL connection pool logic with seamless fallback handling.
- Implemented JWT token generation with `jsonwebtoken`.
- Designed `verifyToken` and `requireAdmin` security middleware.
- Built Jest + Supertest integration tests adhering to TDD patterns.

### Reflection on AI Impact
AI significantly accelerated boilerplate creation, database query handling, authentication flows, middleware security, and test-driven development cycles.
