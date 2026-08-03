---
name: tester-downloader
description: >-
  Installs full Playwright (npm package + browser binaries) when missing.
  Use when the user needs a tester they don't have, Playwright is not installed,
  browsers are missing, `playwright test` / `npm run check` / `npm test` fails
  with missing @playwright/test or browser executable errors, or when asked to
  download/install Playwright or testers.
---

# Tester downloader

When a Playwright tester is needed but missing, install the **full** stack: the `@playwright/test` package **and** browser binaries. Do not ask the user to install manually unless install fails after retry.

## When to run

Apply if any of these are true:

- User asks for a tester / Playwright / to download or install browsers
- Tests or `npm run check` fail because Playwright or browsers are missing
- Error text matches missing package or browser binaries (examples below)

## Approval rules

Lifecycle scripts (`npm install` / `npm ci` / equivalents) and Playwright browser downloads (`playwright install`, including `--with-deps`) are trust boundaries. Gate them:

- **Ask for confirmation first** before **every** command that changes dependencies or `node_modules` (`npm install`, `npm ci`, `pnpm add`, `pnpm install`, `yarn add`, `yarn install`, and equivalents), and before **any** `playwright install` (browser-only or `--with-deps`).
- Do **not** treat `CI=true`, provider labels, or similar env flags as proof of disposable/isolated execution — those alone never skip confirmation.
- Auto-run package restores or any `playwright install` **only** when the execution layer itself has already verified trusted isolation (for example this repo’s GitHub Actions workflow installing deps on `ubuntu-latest`). The agent must not infer that from env vars.
- If the user already asked to install Playwright/testers/browsers, treat that as approval for the needed steps.
- The same gates apply to **retry** installs after a failure — do not bypass confirmation on retry.
- Prefer the smallest install that unblocks tests (browsers only if the package is already present).

## Detect what is missing

From the project root:

1. **Package** — `@playwright/test` missing from `node_modules` or `package.json` `devDependencies` / `dependencies`, or errors like:
   - `Cannot find module '@playwright/test'`
   - `playwright: command not found` / similar
2. **Browsers** — package present but browsers missing, or errors like:
   - `Executable doesn't exist`
   - `browserType.launch`
   - messages pointing at a missing path under `.cache/ms-playwright` (or OS equivalent)

**Trust check:** If `@playwright/test` is not already declared in both `package.json` and the project lockfile, **stop**. Report that the package is not pinned in the repo; do not add or install an unpinned Playwright dependency.

If both package restore and browsers are missing, install package first (after approval), then browsers.

## Install steps

Run from the project root. Prefer the package manager already used by the repo (`package-lock.json` → npm, `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn). Default to npm.

Always run Playwright through the **local** package (no `npx` fallback that can download another version):

- npm: `npm exec --no -- playwright …`
- pnpm: `pnpm exec playwright …`
- yarn: `yarn playwright …`

### 1. Package (if needed)

**Require user confirmation** before running any dependency / `node_modules` restore or install command.

Use the **repository-pinned** version from `package.json` / the lockfile. Do **not** install unpinned `@playwright/test` (latest).

If `package.json` lists a version (e.g. `"@playwright/test": "^1.62.0"`), install that range:

```bash
npm install -D @playwright/test@^1.62.0
```

(Substitute the exact version/range from this repo’s `package.json`. Prefer restoring via the lockfile with `npm ci` or `npm install` when the dependency is already declared — still require confirmation.)

If `package.json` already lists `@playwright/test` but `node_modules` is incomplete:

```bash
npm install
```

Use the equivalent for pnpm/yarn when that is the project manager.

### 2. Browsers (if needed)

**Require user confirmation** before any browser install, including browser-only:

```bash
npm exec --no -- playwright install
```

On **Linux** when system deps are clearly missing, **ask for confirmation** before (prefer this over browser-only on Linux when OS deps are required):

```bash
npm exec --no -- playwright install --with-deps
```

- **macOS:** always use browser-only install (`playwright install`); never `--with-deps`.
- **Windows:** do not use `--with-deps` unless Playwright’s own error message requires host dependency setup.

### 3. Verify

Re-run the command that failed (usually `npm test`, `npm run check`, or `npm exec --no -- playwright test`). Confirm it gets past install/missing-binary errors.

## Rules

- Install only what is missing; if the package is present, skip straight to local `playwright install` (after confirmation).
- Prefer the lockfile-pinned Playwright version; do not upgrade to a new major unless the user asks or the current version cannot install browsers.
- Do not use bare `npx playwright …` (it may fetch a different package if the local binary is missing). Prefer `npm exec --no -- playwright …` / `pnpm exec` / `yarn`.
- Do not commit `node_modules` or browser cache directories.
- If install fails, show the error, try one clear fix (e.g. approved `npm install` then approved local `playwright install` again — still gated), then report what still blocks.
- After a successful install during a code-change session, continue the original task (including project check rules if they apply).

## Brief user update

After installing, say what was missing and what you ran (package, browsers, or both), then continue.
