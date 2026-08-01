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

When a Playwright tester is needed but missing, install the **full** stack automatically: the `@playwright/test` package **and** browser binaries. Do not ask the user to install manually unless install fails after retry.

## When to run

Apply immediately (no asking first) if any of these are true:

- User asks for a tester / Playwright / to download or install browsers
- Tests or `npm run check` fail because Playwright or browsers are missing
- Error text matches missing package or browser binaries (examples below)

## Detect what is missing

From the project root:

1. **Package** — `@playwright/test` missing from `node_modules` or `package.json` `devDependencies` / `dependencies`, or errors like:
   - `Cannot find module '@playwright/test'`
   - `playwright: command not found` / similar
2. **Browsers** — package present but browsers missing, or errors like:
   - `Executable doesn't exist`
   - `browserType.launch`
   - messages pointing at a missing path under `.cache/ms-playwright` (or OS equivalent)

If both are missing, install package first, then browsers.

## Install steps

Run from the project root. Prefer the package manager already used by the repo (`package-lock.json` → npm, `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn). Default to npm.

### 1. Package (if needed)

```bash
npm install -D @playwright/test
```

Use the equivalent for pnpm/yarn when that is the project manager.

If `package.json` already lists `@playwright/test` but `node_modules` is incomplete:

```bash
npm install
```

### 2. Browsers (if needed)

```bash
npx playwright install
```

On Linux CI or when system deps are clearly missing, use:

```bash
npx playwright install --with-deps
```

Do not use `--with-deps` on Windows unless Playwright’s own error message requires it.

### 3. Verify

Re-run the command that failed (usually `npx playwright test`, `npm test`, or `npm run check`). Confirm it gets past install/missing-binary errors.

## Rules

- Install only what is missing; if the package is present, skip straight to `playwright install`.
- Do not upgrade Playwright to a new major unless the user asks or the current version cannot install browsers.
- Do not commit `node_modules` or browser cache directories.
- If install fails, show the error, try one clear fix (e.g. `npm install` then `npx playwright install` again), then report what still blocks.
- After a successful install during a code-change session, continue the original task (including project check rules if they apply).

## Brief user update

After installing, say what was missing and what you ran (package, browsers, or both), then continue.
