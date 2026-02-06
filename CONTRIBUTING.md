# Contributing to CoursePilot

## Branch Naming

Use: `yourname/feature-description`

Examples: `vaidik/database-schema`, `lauryn/figma-tokens`

## Workflow

```bash
# Always start from dev
git checkout dev
git pull origin dev

# Create your branch
git checkout -b yourname/my-feature

# Work, commit, push
git add .
git commit -m "Description of changes"
git push origin yourname/my-feature

# Open PR to dev (not main)
```

## Rules

- **Never push directly to `main`**
- **All PRs target `dev`** and need 1 peer review
- **Frontend team**: stay in `frontend/`
- **Backend team**: stay in `backend/`
- If touching shared files (README, configs), announce in Slack first

## Before Opening a PR

- [ ] Code runs locally
- [ ] Tests pass
- [ ] No new linter errors
- [ ] Code formatted (Python: `black`, TypeScript: `prettier`)

## Merge Strategy

Use **"Squash and Merge"** when merging to `dev` to keep history clean.
