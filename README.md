# ZestMedia

ZestMedia is a product catalogue and portfolio site for a custom printing and branding business. Customers can explore services, configure product details, and send quote requests through WhatsApp. Administrators manage the catalogue and portfolio from a protected dashboard.

> **Project status:** Active development. The storefront, FastAPI API, admin tools, PostgreSQL persistence, and Supabase image uploads are implemented. Online payments and a customer enquiry management system are not part of the current workflow.

## What the application does

### Customer experience

- Browse products, categories, and portfolio work.
- View product descriptions, features, images, and available options.
- Configure a product and prepare a quote request for WhatsApp.
- See configured contact details and business links when supplied through frontend environment variables.

Customers send quote requests through WhatsApp; the business reviews details and confirms pricing directly. The site does not process payments. Customers can attach artwork directly in WhatsApp when they send their request.

### Admin dashboard

The dashboard is available at `/admin`. An authenticated administrator can:

- Create, edit, and delete products and categories.
- Manage product options and their choices.
- Add product descriptions, features, audiences, turnaround details, and multiple images.
- Create, edit, and delete portfolio entries in **Our Work**.
- Upload product and portfolio images to Supabase Storage.

Admin writes and image-upload link requests require a bearer token. Public catalogue and portfolio reads are available to the storefront.

## Technology

| Area          | Technology                                     |
| ------------- | ---------------------------------------------- |
| Frontend      | Next.js 16, React 19, TypeScript, Tailwind CSS |
| API           | Python 3.14+, FastAPI, Pydantic                |
| Database      | PostgreSQL, SQLAlchemy, Alembic                |
| Image storage | Supabase Storage                               |
| Quote handoff | WhatsApp                                       |

## Repository layout

```text
backend/
  app/                  FastAPI application, routers, models, and schemas
  alembic/              Database migrations
  scripts/create_admin.py
  .env.example          Backend configuration template
frontend/
  app/                  Next.js pages and routes
  components/           Storefront and admin UI
  lib/                  API client and product content
  .env.example          Frontend configuration template
```

## Requirements

- Python 3.14 or newer
- [uv](https://docs.astral.sh/uv/)
- Node.js and npm
- PostgreSQL
- A Supabase project and Storage bucket for image uploads

## Local setup

Run the backend and frontend in separate terminals.

### 1. Configure the backend

```bash
cd backend
uv sync
cp .env.example .env
```

Edit `backend/.env` and set at least:

- `DATABASE_URL` — PostgreSQL connection URL using the `postgresql+psycopg://` driver.
- `JWT_SECRET` — a long, random value. Generate one with `openssl rand -hex 32`.
- `CORS_ORIGINS` — comma-separated frontend origins, such as `http://localhost:3000`.

For admin image uploads, also set `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `SUPABASE_STORAGE_BUCKET`. Keep the Supabase secret key in the backend environment only. The configured bucket must allow signed uploads and public reads for the uploaded image URLs.

Create the PostgreSQL database named in `DATABASE_URL` if it does not already exist, then apply migrations from the `backend/` directory:

```bash
uv run alembic upgrade head
```

Create the first administrator:

```bash
uv run python scripts/create_admin.py
```

Start the API:

```bash
uv run uvicorn app.main:app --reload
```

The API runs at `http://127.0.0.1:8000`. Interactive API documentation is at `http://127.0.0.1:8000/docs`.

### 2. Configure the frontend

In another terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
```

Set `NEXT_PUBLIC_API_URL` to the backend URL. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the business number in international format using digits only. Optional contact and social fields can be filled in as needed. Values prefixed with `NEXT_PUBLIC_` are included in browser code; never put private keys in them.

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`. The admin dashboard is at `http://localhost:3000/admin`.

## Configuration reference

Use `backend/.env.example` and `frontend/.env.example` as the complete variable templates.

| Variable                                               | Location | Purpose                                                             |
| ------------------------------------------------------ | -------- | ------------------------------------------------------------------- |
| `DATABASE_URL`                                         | Backend  | PostgreSQL connection string                                        |
| `JWT_SECRET`                                           | Backend  | Signs admin access tokens                                           |
| `CORS_ORIGINS`                                         | Backend  | Allowed frontend origins, comma-separated                           |
| `SUPABASE_URL`                                         | Backend  | Supabase project URL for image uploads                              |
| `SUPABASE_SECRET_KEY`                                  | Backend  | Private key for signing Storage upload URLs; do not expose publicly |
| `SUPABASE_STORAGE_BUCKET`                              | Backend  | Storage bucket name; defaults to `product-images`                   |
| `NEXT_PUBLIC_API_URL`                                  | Frontend | Base URL of the FastAPI service                                     |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`                          | Frontend | Quote-request destination, digits only                              |
| `NEXT_PUBLIC_CONTACT_*`                                | Frontend | Optional phone, email, address, and hours                           |
| `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_BEHANCE_URL` | Frontend | Optional social links                                               |

Keep `.env` and `.env.local` files private. The tracked `.env.example` files contain placeholders and are safe to share. Rotate a credential immediately if it is accidentally committed or shared.

## Render deployment

The root `render.yaml` defines the FastAPI backend and Next.js storefront as separate Singapore-region free web services. Connect this repository to Render as a Blueprint to create them. Free services can spin down when idle, so the first request after inactivity may take longer.

During Blueprint setup, enter the backend `DATABASE_URL`, `CORS_ORIGINS`, and Supabase values, plus the frontend `NEXT_PUBLIC_WHATSAPP_NUMBER`. Set `CORS_ORIGINS` to the deployed storefront URL. Render generates `JWT_SECRET` and wires the frontend API URL to the backend service URL. Keep all secret values in Render's environment settings, never in this repository.

Before the first API deploy, check the production database's migration state from `backend/` with `uv run alembic current`. Apply pending migrations with `uv run alembic upgrade head` before deploying the API. The Render free plan does not support pre-deploy commands, so migrations are not run automatically.

## Database changes

Alembic migration files are in `backend/alembic/versions/`. After pulling a change that adds a migration, run this from `backend/`:

```bash
uv run alembic upgrade head
```

Useful commands:

```bash
uv run alembic current
uv run alembic revision --autogenerate -m "describe the change"
uv run alembic downgrade -1
```

Review autogenerated migrations before applying them, and back up production data before making schema changes.

## API overview

The API is served from the configured backend origin. Admin write requests use an `Authorization: Bearer <token>` header obtained from `POST /api/auth/login`.

| Resource             | Public reads                | Admin operations                                                            |
| -------------------- | --------------------------- | --------------------------------------------------------------------------- |
| Products             | `GET /api/products/`        | `POST /api/products/`, `PATCH` and `DELETE /api/products/{product_id}`      |
| Categories           | `GET /api/categories/`      | `POST /api/categories/`, `PATCH` and `DELETE /api/categories/{category_id}` |
| Product options      | Included with product reads | Create, update, and delete options and choices under `/api/options/`        |
| Portfolio work       | `GET /api/works/`           | `POST /api/works/`, `PATCH` and `DELETE /api/works/{work_id}`               |
| Image uploads        | —                           | `POST /api/uploads/signed-url` (admin token required)                       |
| Admin authentication | —                           | `POST /api/auth/login`                                                      |

Full request and response schemas are available through Swagger UI at `/docs` while the backend is running.

## Security notes

- Keep database credentials, `JWT_SECRET`, and Supabase secret keys in backend-only environment variables.
- Do not commit `.env`, `.env.local`, access tokens, or private keys.
- Configure `CORS_ORIGINS` for the deployed frontend origins rather than allowing arbitrary origins.
- Use HTTPS and secure managed database and storage settings in production.
- Product and portfolio image uploads are issued through the authenticated backend; uploaded image URLs are stored with their catalogue records.

## Current limitations

- Quote requests are handed off through WhatsApp; there is no online checkout or payment processing.
- Customers attach artwork directly in WhatsApp; the site does not upload customer artwork.
- There is no admin enquiry inbox at this time.
- Production hosting, domain, HTTPS, backups, and monitoring must be configured for the deployment environment.

## License

Proprietary software developed for ZestMedia. All rights reserved.
