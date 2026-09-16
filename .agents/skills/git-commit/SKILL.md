---
name: git-commit
description: >-
  Use this skill when the user explicitly asks to commit, stage, or save their
  work to git. Inspects all staged and unstaged changes, groups them into
  logical commits with proper conventional commit messages, and stages + commits
  each group. Never pushes — pushing is always the user's responsibility.
---

# Git Commit Skill

This skill handles staging, grouping, and committing all pending changes in the
`YouTube-Shorts-Auto-Scroll` repository with proper [Conventional Commits](https://www.conventionalcommits.org/) messages.
Run this skill only when the user explicitly asks to commit their work.

---

## Steps

### 1. Inspect Current Changes

Run the following to see all staged and unstaged changes:

```bash
git status
git diff --stat
git diff --cached --stat
```

Read the output carefully to understand which files have changed and why.

### 2. Group Changes into Logical Commits

Group the changed files into **one or more logical units**, each of which will become a separate commit.
Good grouping criteria:

- All changes to a single feature belong together (e.g. a new component + its types).
- Test files should be committed together with the source files they test, or separately if the tests were written in a separate pass.
- Config/tooling changes (CI, build files, `package.json`) belong in their own commit.
- Documentation changes (`AGENTS.md`, `README.md`) belong in their own commit.

### 3. Determine the Commit Type for Each Group

Use the table below to pick the right `<type>`:

| Type       | When to Use                                                    | Example                                          |
|------------|----------------------------------------------------------------|--------------------------------------------------|
| `feat`     | New feature, new component, new unit category                  | `feat: add speed unit category`                  |
| `fix`      | Bug fix, correcting broken logic or rendering                  | `fix: temperature rounding precision`             |
| `refactor` | Code restructuring with no behavior change                     | `refactor: derive toValue via useMemo`            |
| `style`    | Formatting, whitespace, missing semicolons (no logic change)   | `style: fix indentation in UnitInput`             |
| `docs`     | Documentation changes (AGENTS.md, README, comments)            | `docs: add git workflow to AGENTS.md`             |
| `test`     | Adding or updating tests                                       | `test: add edge case tests for currency`          |
| `ci`       | CI/CD workflow changes (GitHub Actions, scripts)               | `ci: add lint and typecheck to CI pipeline`       |
| `chore`    | Tooling, config, dependencies (no production code)             | `chore: install vitest and testing-library`       |
| `perf`     | Performance improvement                                        | `perf: memoize unit list derivation`              |
| `build`    | Build system or dependency changes                             | `build: downgrade tailwind to v3 for NextUI`      |

Optional scope for precision: `feat(units): add speed category`

### 4. Stage and Commit Each Group

For each logical group, stage only the relevant files and commit:

```bash
git add <file1> <file2> ...
git commit -m "<type>: <short lowercase description under 72 chars>"
```

Repeat for each additional logical group.

### 5. Confirm and Report

After all commits are made, run:

```bash
git log --oneline -10
git status
```

Report the commits that were made to the user and confirm the working tree is clean.

---

## Rules

1. **Never use `git add .`** unless every single changed file belongs to the same logical commit.
2. **Never push.** Pushing is always the user's responsibility.
3. **Messages must be lowercase, imperative mood, no period, under 72 characters.**
4. **One logical change per commit** — if the work spans multiple concerns, make multiple commits.
5. **Do not commit if the working tree has failures.** If in doubt, run `npm run lint && npm run typecheck && npm run test:ci` first and confirm they pass.
