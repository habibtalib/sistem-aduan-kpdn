# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start with nodemon (auto-reload)
npm start         # Start without auto-reload
npm run seed      # Populate DB with sample data + create admin user
```

There is no linter or test runner configured.

## Environment Setup

Copy `.env.example` to `.env` and fill in `MONGODB_URI`. Local default is `mongodb://localhost:27017/aduan_kpdn`. `SESSION_SECRET` should be changed from the default.

## Architecture

Standard Express MVC: `routes/` → `controllers/` → `models/`. Server entrypoint is `server.js`.

- **`routes/web.js`** — HTML web routes (EJS views). Flash messages use `jaya` (success) and `gagal` (error) keys.
- **`routes/api.js`** — REST JSON API under `/api/aduan`, full CRUD.
- **`views/layout.ejs`** — Master layout via `express-ejs-layouts`; all views extend it. Flash partials live in `views/partials/`.
- **`config/db.js`** — Mongoose connection; exits process on failure.
- **`config/multer.js`** — File upload config: images/PDF only, 5MB max, stored to `public/uploads/`.
- **`middleware/auth.js`** — `requireLogin` (redirect to `/login`) and `requireGuest` (redirect to `/pengguna`) guards.

## Models

**`Aduan`** — Main complaint entity. `noAduan` (e.g. `ADN-2026-0001`) is auto-generated in a `pre('save')` hook. Exports `KATEGORI`, `STATUS`, and `PRIORITI` arrays used by controllers and views. `lampiran` holds uploaded filenames as an array. `method-override` enables PUT/DELETE from HTML forms via `?_method=`.

**`Tindakan`** — Action log linked to `Aduan` via `ObjectId` ref. Can optionally update `aduan.status` when recorded. Used with `populate()` in dashboard and `aduan/show`.

**`Pengguna`** — System users (staff/admin). Password hashed via bcrypt `pre('save')` hook; `password` field has `select: false` so it must be explicitly requested with `.select('+password')`. Instance method `comparePassword()` handles verification.

## Authentication

Session-based (no Passport.js). After login, `req.session.user` holds `{ id, nama, email }`. Seed admin credentials: `admin@kpdn.gov.my` / `kata123`.

## Language Convention

UI labels and comments are in **Bahasa Melayu**. Code identifiers are English, except domain nouns that mirror BM field names (e.g. `namaPengadu`, `noAduan`, `senaraiAduan`). Controllers pass view data using BM variable names; keep this consistent.
