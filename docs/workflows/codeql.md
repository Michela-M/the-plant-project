# CodeQL Workflow

**File:** `.github/workflows/codeql.yml`  
**Purpose:** Perform advanced static code analysis using GitHub CodeQL to detect security vulnerabilities and code quality issues.

## When it runs

- On `push` to `main`
- On `pull_request` targeting `main`
- On a scheduled run:
  - Every Thursday at 08:28 UTC (`cron: '28 8 * * 4'`)

## Job Overview

### Analyze

This workflow runs a **matrix-based analysis**, scanning multiple languages independently.

**Analyzed languages:**

- `actions` (GitHub Actions workflows)
- `javascript-typescript` (JavaScript & TypeScript source code)

Each language is analyzed in a separate job run.

## Permissions

The workflow uses the following permissions:

- `security-events: write` – required to upload CodeQL results
- `packages: read` – required to access CodeQL packs
- `actions: read` – required for workflow execution
- `contents: read` – required to read repository contents

## Steps

1. **Checkout repository**  
   Uses `actions/checkout@v4` to fetch the code.

2. **Initialize CodeQL**  
   Uses `github/codeql-action/init@v4` with:
   - Language defined by the job matrix
   - Build mode defined by the job matrix

3. **Manual build (optional)**  
   Runs only if `build-mode` is set to `manual`.  
   Currently included as a placeholder and exits with an error if triggered.

4. **Perform CodeQL analysis**  
   Uses `github/codeql-action/analyze@v4` to run the analysis and upload results to GitHub.

## Status Checks

- Adds CodeQL status checks to pull requests:
  - One check per analyzed language
- These checks can be **required in branch protection rules**
- Merging is blocked until CodeQL analysis completes successfully
