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

- **Ask for confirmation first** before any command that changes dependencies or `node_modules` (`npm install`, `npm ci`, `pnpm add`, `pnpm install`, `yarn add`, `yarn install`, and equivalents). Those run package lifecycle scripts (`preinstall` / `postinstall` / `prepare`) with local privileges.
- **Do not ask** before browser-only install via the local Playwright binary (lockfile-pinned version already in the project).
- **`playwright install --with-deps`** installs OS packages (often with elevated privileges). Auto-run it **only** on disposable CI runners already set up for that (for example this repo’s GitHub Actions job on `ubuntu-latest`). On a **local Linux** host, **ask for confirmation** before `--with-deps`.
- If the user already asked to install Playwright/testers/browsers, treat that as approval for the needed package and `--with-deps` steps.
- Prefer the smallest install that unblocks tests (browsers only if the package is already present; avoid `--with-deps` unless system libs are clearly missing).

## Detect what is missing

From the project root:

1. **Package** — `@playwright/test` missing from `node_modules` or `package.json` `devDependencies` / `dependencies`, or errors like:
   - `Cannot find module '@playwright/test'`
   - `playwright: command not found` / similar
2. **Browsers** — package present but browsers missing, or errors like:
   - `Executable doesn't exist`
   - `browserType.launch`
   - messages pointing at a missing path under `.cache/ms-playwright` (or OS equivalent)

If both are missing, install package first (after approval), then browsers.

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

Run automatically when the package is already present / lockfile-pinned:

```bash
npm exec --no -- playwright install
```

On **Linux**, when system deps are clearly missing:

- **Disposable CI** (e.g. this repo’s `ubuntu-latest` workflow): run automatically:

```bash
npm exec --no -- playwright install --with-deps
```

- **Local Linux host:** ask for confirmation first, then run the same command if approved. Prefer browser-only install when it is enough.

- **macOS:** always use browser-only install (`playwright install`); never `--with-deps`.
- **Windows:** do not use `--with-deps` unless Playwright’s own error message requires host dependency setup.

### 3. Verify

Re-run the command that failed (usually `npm test`, `npm run check`, or `npm exec --no -- playwright test`). Confirm it gets past install/missing-binary errors.

## Rules

- Install only what is missing; if the package is present, skip straight to local `playwright install`.
- Prefer the lockfile-pinned Playwright version; do not upgrade to a new major unless the user asks or the current version cannot install browsers.
- Do not use bare `npx playwright …` (it may fetch a different package if the local binary is missing). Prefer `npm exec --no -- playwright …` / `pnpm exec` / `yarn`.
- Do not commit `node_modules` or browser cache directories.
- If install fails, show the error, try one clear fix (e.g. approved `npm install` then local `playwright install` again), then report what still blocks.
- After a successful install during a code-change session, continue the original task (including project check rules if they apply).

## Brief user update

After installing, say what was missing and what you ran (package, browsers, or both), then continue.
