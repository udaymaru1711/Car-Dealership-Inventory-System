# Car Dealership Inventory System

A full-stack RESTful Car Dealership Inventory System built with Node.js, Express, PostgreSQL, Jest, React, and Tailwind CSS.

## Feature Implementation Progress

### Phase 1: Authentication & Authorization
- [x] **Feature 1.1**: Project setup & database pool connection configuration.
- [x] **Feature 1.2**: User Registration (`POST /api/auth/register` with password hashing via `bcryptjs`).
- [ ] **Feature 1.3**: User Login (`POST /api/auth/login` returning JWT token).
- [ ] **Feature 1.4**: JWT Authentication & Authorization Middleware (`verifyToken`, `requireAdmin`).

---

## Test Execution Report
- `POST /api/auth/register`: PASS (3/3 tests passed)

---

## My AI Usage

### AI Tools Used
- **Antigravity AI Assistant** (powered by Gemini 3.6 Flash)

### How AI Was Utilized
- Generated Express controller and route structures for `POST /api/auth/register`.
- Created PostgreSQL connection pool logic with seamless fallback handling.
- Built Jest + Supertest integration tests adhering to TDD patterns.

### Reflection on AI Impact
AI significantly accelerated boilerplate creation, database query handling, and test-driven development cycles.
