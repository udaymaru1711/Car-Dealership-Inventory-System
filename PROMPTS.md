# AI Tooling Prompt History

## Feature 1: Authentication - User Registration (`POST /api/auth/register`)

### Prompt 1: Project Setup & Architecture
> "Build the project incrementally starting with Phase 1: Authentication - Registration. Explain the architecture, files, and request flow before implementation."

**AI Action**:
- Designed backend structure using Express, Node.js, and PostgreSQL.
- Created `backend/package.json`, `src/config/db.js`, `src/models/schema.sql`, `src/config/dbWrapper.js`.

### Prompt 2: Registration Endpoint & TDD Test Suite
> "Implement POST /api/auth/register with bcrypt password hashing and write Jest integration tests."

**AI Action**:
- Implemented `src/controllers/authController.js` (`register`).
- Created route handler `src/routes/authRoutes.js`.
- Created integration test suite `backend/tests/auth.test.js`.
- Verified test suite execution: 3/3 passed.

---

## Feature 1.3: Authentication - User Login (`POST /api/auth/login`)

### Prompt 3: Login Endpoint & JWT Generation
> "Implement POST /api/auth/login with password validation and JWT token issuance."

**AI Action**:
- Added `login` method to `src/controllers/authController.js`.
- Added route handler to `src/routes/authRoutes.js`.
- Expanded integration tests in `backend/tests/auth.test.js`.
- Verified test suite execution: 7/7 total passed.

---

## Feature 1.4: JWT Authentication & Authorization Middleware

### Prompt 4: Security Middlewares & Role Verification
> "Implement verifyToken and requireAdmin middleware and write unit/integration tests."

**AI Action**:
- Created `src/middleware/authMiddleware.js` exporting `verifyToken` and `requireAdmin`.
- Created TDD integration test suite `backend/tests/middleware.test.js`.
- Verified test suite execution: 13/13 total passed.

---

## Phase 2: Vehicle CRUD (`/api/vehicles`)

### Prompt 5: Vehicle CRUD Endpoints & Tests
> "Implement POST, GET, PUT, DELETE /api/vehicles endpoints with verifyToken and requireAdmin authorization, and create Jest test suite."

**AI Action**:
- Created `src/controllers/vehicleController.js` handling `createVehicle`, `getAllVehicles`, `updateVehicle`, `deleteVehicle`.
- Created `src/routes/vehicleRoutes.js` and attached endpoints.
- Created TDD integration test suite `backend/tests/vehicles.test.js`.
- Verified test suite execution: 20/20 total passed.

---

## Phase 3: Search & Filtering (`GET /api/vehicles/search`)

### Prompt 6: Search & Filtering Implementation
> "Implement GET /api/vehicles/search by make, model, category, and price range, with TDD integration tests."

**AI Action**:
- Added `searchVehicles` controller method in `src/controllers/vehicleController.js`.
- Mounted `GET /api/vehicles/search` in `src/routes/vehicleRoutes.js`.
- Created TDD integration test suite `backend/tests/search.test.js`.
- Verified test suite execution: 24/24 total passed.
