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
