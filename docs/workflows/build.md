# Build Workflow

**File:** `.github/workflows/build.yml`  
**Purpose:** Verify that the application builds successfully using Vite. This ensures build-time errors are caught before merging changes into `main`.

## When it runs

- On `push` to `main`
- On `pull_request` targeting `main`

## Job Overview

### Build

**Purpose:** Run the production build to ensure the project compiles correctly.

**Steps:**

1. **Checkout code**  
   Uses `actions/checkout@v6` to fetch the repository code.

2. **Set up Node.js**  
   Uses `actions/setup-node@v6` with Node.js version `24`.

3. **Install dependencies**  
   Runs `npm ci` for a clean, reproducible dependency installation.

4. **Build project**  
   Runs `npm run build`, which executes `vite build`.

## Status Checks

- Adds a **status check named `build`** to pull requests targeting `main`.
- Can be required in branch protection rules.
- Prevents merging if the application fails to build.
