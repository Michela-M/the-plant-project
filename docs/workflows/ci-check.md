# CI Check Workflow

**File:** `.github/workflows/ci-check.yml`  
**Purpose:** Run linting and unit tests on the project to ensure code quality and correctness before merging changes.

## When it runs

- On `push` to `main`
- On `pull_request` targeting `main`

## Jobs

### 1. Lint

**Purpose:** Check code style and potential errors using ESLint.

**Steps:**

1. **Checkout code** – Uses `actions/checkout@v6` to get the repository code.
2. **Set up Node.js** – Uses `actions/setup-node@v6` with Node.js version `24`.
3. **Install dependencies** – Runs `npm install`.
4. **Run ESLint** – Runs `npx eslint . --ext .js,.jsx,.ts,.tsx` to lint JavaScript and TypeScript files.

### 2. Test

**Purpose:** Run unit tests to verify functionality using Vitest.

**Steps:**

1. **Checkout code** – Uses `actions/checkout@v6`.
2. **Set up Node.js** – Uses `actions/setup-node@v6` with Node.js version `24`.
3. **Install dependencies** – Runs `npm install`.
4. **Run tests** – Runs `npx vitest run` to execute tests in headless mode.

## Status Checks

- Adds **two status checks** to PRs targeting `main`:
  - `lint` – passes if ESLint finds no errors
  - `test` – passes if all Vitest tests succeed

- These are **required in branch protection rules**, ensuring no broken code is merged into `main`.
