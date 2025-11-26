# Deployment Guide

This guide explains how to publish **Neural Galaxy** as a static site on
GitHub Pages while keeping all import logic client-side.

## 1. Prerequisites

- GitHub repository with this project
- GitHub Pages enabled (Settings → Pages → Source: “GitHub Actions”)
- Node.js v18+ and npm installed locally if you want to test builds

## 2. Local Build (optional)

```
cd frontend
npm install
npm run build  # Produces frontend/dist
npm run preview
```

If the preview looks good, commit your changes.

## 3. GitHub Actions Workflow

Create `.github/workflows/pages.yml` with the steps below:

1. Check out the repo
2. Install Node and cache dependencies
3. Build the frontend (working dir: `frontend/`)
4. Upload `frontend/dist` as a Pages artifact
5. Deploy using `actions/deploy-pages`

See the repo for the exact workflow file. Push to `main` and GitHub will
build + deploy automatically.

## 4. Importing Personal Data

The hosted site uses demo data by default, but users can still import their
own exports directly in the browser (press `I` → follow the Setup Guide).
No backend processing is needed.

## 5. DNS (optional)

To use a custom domain, configure Pages’ custom domain setting and add the
provided CNAME/ALIAS records in your DNS provider.
