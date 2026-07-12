# PocketBase Schema Setup Guide

This guide explains how to set up PocketBase collections to replace the previous MySQL database.

## 1. Download & Run PocketBase

1. Go to [https://pocketbase.io/docs/](https://pocketbase.io/docs/) and download the executable for your OS.
2. Place `pocketbase.exe` in a new folder, e.g. `C:\pocketbase\`.
3. Start it:
   ```powershell
   .\pocketbase.exe serve
   ```
4. Open the Admin UI at [http://127.0.0.1:8090/_/](http://127.0.0.1:8090/_/) and create your superadmin account.

---

## 2. Create Collections

Open the PocketBase Admin UI and create the following collections:

### `users` (Base Collection — **already exists by default**)
PocketBase creates a `users` collection automatically. You can use it directly for admin login via email/password.

> Add an admin user via the PocketBase admin panel or via the API.

---

### `clients` (Base Collection)

| Field       | Type   | Options              |
|-------------|--------|----------------------|
| `nom`       | Text   | Required             |
| `telephone` | Text   | Required             |
| `email`     | Email  | Required, Unique     |
| `adresse`   | Text   |                      |
| `societe`   | Text   |                      |

**API Rules (all operations require auth):**
- List/Search: `@request.auth.id != ""`
- View: `@request.auth.id != ""`
- Create: `@request.auth.id != ""`
- Update: `@request.auth.id != ""`
- Delete: `@request.auth.id != ""`

---

### `devis` (Base Collection)

| Field         | Type     | Options                                          |
|---------------|----------|--------------------------------------------------|
| `client`      | Relation | → `clients`, Required                            |
| `type_panneau`| Text     | Required                                         |
| `dimensions`  | Text     |                                                  |
| `matiere`     | Text     |                                                  |
| `prix`        | Number   | Required                                         |
| `description` | Editor   |                                                  |
| `statut`      | Select   | Values: `EN_ATTENTE`, `VALIDE`, `ANNULE`, `EN_COURS` |
| `file`        | File     | Max 1 file, allowed types: pdf, jpg, png         |

**API Rules:**
- List/Search: `@request.auth.id != ""`
- View: `@request.auth.id != ""`
- Create: **`""`** (empty = allow public — needed for the quote form)
- Update: `@request.auth.id != ""`
- Delete: `@request.auth.id != ""`

---

### `commandes` (Base Collection)

| Field         | Type     | Options                                      |
|---------------|----------|----------------------------------------------|
| `client`      | Relation | → `clients`, Required                        |
| `type_panneau`| Text     | Required                                     |
| `dimensions`  | Text     |                                              |
| `matiere`     | Text     |                                              |
| `prix`        | Number   | Required                                     |
| `statut`      | Select   | Values: `EN_ATTENTE`, `EN_COURS`, `TERMINEE` |

**API Rules (all operations require auth):**
- List/Search: `@request.auth.id != ""`
- View: `@request.auth.id != ""`
- Create: `@request.auth.id != ""`
- Update: `@request.auth.id != ""`
- Delete: `@request.auth.id != ""`

---

## 3. Create a Test User

In the PocketBase Admin UI → **users** collection → click **New record**:

```
email: admin@example.com
password: YourSecurePassword123
```

Or, use this login on the `/admin/login` page with these credentials.

---

## 4. Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:9002
POCKETBASE_URL=http://127.0.0.1:8090
```

---

## 5. PocketBase Data Directory

By default PocketBase stores its data in `pb_data/` next to the executable.
Add this to your `.gitignore` if you put the executable inside the project:

```
pb_data/
pocketbase.exe
```
