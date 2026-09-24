# ZestMedia

A modern web platform for a printing, branding, and custom design business.

ZestMedia allows customers to explore printing and branding services, configure their requirements, upload artwork, and send quotation/order requests directly through WhatsApp.

The platform also provides an admin system for managing products, categories, product options, and customer enquiries.

---

## Overview

ZestMedia is designed for a real-world printing and branding workflow rather than a traditional online shopping system.

Customers do not make online payments.

Instead, the customer:

1. Selects a product
2. Configures the required options
3. Uploads their artwork/design when required
4. Reviews their request
5. Sends the request through WhatsApp
6. The business reviews the request and confirms the quotation/order manually

This keeps the ordering process simple while allowing the business to handle custom pricing and requirements.

---

## Features

### Customer Features

- Browse printing and branding products
- Browse products by category
- View detailed product information
- Configure product-specific options
- Select quantities and specifications
- Upload artwork/design files
- Request quotations
- Send configured requests through WhatsApp
- Responsive interface
- Product-specific configuration

### Admin Features

The admin system is being developed to allow authorized administrators to:

- Authenticate securely
- View dashboard
- Create products
- Edit products
- Delete products
- Manage categories
- Manage product options
- Manage option choices
- Upload product images
- View customer enquiries
- Manage customer uploaded files

---

## Product Categories

The platform supports different types of printing and branding services, including:

- Stationery
- Large Format
- Apparel
- Small Format
- Branding

Example products include:

- Visiting Cards
- Flex & Banners
- T-Shirt Printing
- Stickers
- Posters
- Brochures
- Invitations
- Custom Branding

---

## Product Configuration

Products can have their own configurable options.

For example, a Visiting Cards product can contain:

```text
Visiting Cards
│
├── Paper Stock
│   ├── Matte 350gsm
│   ├── Soft-touch 400gsm
│   ├── Gloss 350gsm
│   └── Textured cotton 600gsm
│
├── Printing Sides
│   ├── Single sided
│   └── Double sided
│
├── Corners
│   ├── Square
│   └── Rounded
│
└── Quantity
    ├── 100
    ├── 250
    ├── 500
    └── 1000
```

The product configuration is stored in PostgreSQL rather than being hardcoded into the frontend.

This allows administrators to add or modify product options without modifying frontend source code.

---

# Architecture

```text
                         CUSTOMER
                            │
                            ▼
                  ┌───────────────────┐
                  │     Next.js       │
                  │   React Frontend  │
                  └─────────┬─────────┘
                            │
                            │ REST API
                            ▼
                  ┌───────────────────┐
                  │      FastAPI      │
                  │      Backend      │
                  └─────────┬─────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
       ┌────────────────┐      ┌────────────────┐
       │   PostgreSQL   │      │ Object Storage │
       │    Database    │      │ Images / Files │
       └────────────────┘      └────────────────┘
                │
                ▼
       Products / Categories
       Options / Choices
       Enquiries / Users


                         CUSTOMER
                            │
                            ▼
                      WhatsApp
                            │
                            ▼
                    Business / Admin
```

---

# Technology Stack

## Frontend

- Next.js
- React
- JavaScript
- Tailwind CSS

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic

## Database

- PostgreSQL

## Storage

- Supabase Storage

## Communication

- WhatsApp

---

# Backend Architecture

```text
backend/
│
├── app/
│   ├── models/
│   │   ├── category.py
│   │   ├── product.py
│   │   ├── option.py
│   │   └── option_choice.py
│   │
│   ├── schemas/
│   │   ├── category.py
│   │   ├── product.py
│   │   └── option.py
│   │
│   ├── routers/
│   │   ├── categories.py
│   │   ├── products.py
│   │   └── options.py
│   │
│   ├── database.py
│   └── main.py
│
├── alembic/
│   └── versions/
│
├── tests/
│
├── .env
├── .gitignore
├── alembic.ini
└── pyproject.toml
```

---

# Database Design

The current database uses PostgreSQL with SQLAlchemy ORM.

## Entity Relationship

```text
Category
   │
   │ 1:N
   ▼
Product
   │
   │ 1:N
   ▼
ProductOption
   │
   │ 1:N
   ▼
OptionChoice
```

## Tables

### `categories`

```text
id
name
slug
```

### `products`

```text
id
name
slug
tagline
summary
image_url
turnaround
category_id
```

### `product_options`

```text
id
name
label
product_id
```

### `option_choices`

```text
id
label
option_id
```

---

# API

The backend exposes REST APIs through FastAPI.

## Products

### Get all products

```http
GET /api/products/
```

Returns products together with their options and choices.

### Create a product

```http
POST /api/products/
```

Example:

```json
{
  "name": "Visiting Cards",
  "slug": "visiting-cards",
  "tagline": "Make a memorable first impression.",
  "summary": "Premium business cards for professionals and brands.",
  "image_url": null,
  "turnaround": "2–3 days",
  "category_id": 1
}
```

## Categories

### Create category

```http
POST /api/categories/
```

Example:

```json
{
  "name": "Stationery",
  "slug": "stationery"
}
```

## Product Options

### Create product option

```http
POST /api/products/{product_id}/options
```

Example:

```json
{
  "name": "stock",
  "label": "Paper Stock"
}
```

### Create option choice

```http
POST /api/products/options/{option_id}/choices
```

Example:

```json
{
  "label": "Matte 350gsm"
}
```

---

# Example API Response

```json
[
  {
    "id": 1,
    "name": "Visiting Cards",
    "slug": "visiting-cards",
    "tagline": "Make a memorable first impression.",
    "summary": "Premium business cards for professionals and brands.",
    "image_url": null,
    "turnaround": "2–3 days",
    "category_id": 1,
    "options": [
      {
        "id": 1,
        "name": "stock",
        "label": "Paper Stock",
        "choices": [
          {"id": 1, "label": "Matte 350gsm"},
          {"id": 2, "label": "Soft-touch 400gsm"},
          {"id": 3, "label": "Gloss 350gsm"},
          {"id": 4, "label": "Textured cotton 600gsm"}
        ]
      },
      {
        "id": 2,
        "name": "sides",
        "label": "Printing Sides",
        "choices": [
          {"id": 5, "label": "Single sided"},
          {"id": 6, "label": "Double sided"}
        ]
      },
      {
        "id": 3,
        "name": "corners",
        "label": "Corners",
        "choices": [
          {"id": 7, "label": "Square"},
          {"id": 8, "label": "Rounded"}
        ]
      },
      {
        "id": 4,
        "name": "quantity",
        "label": "Quantity",
        "choices": [
          {"id": 9, "label": "100"},
          {"id": 10, "label": "250"},
          {"id": 11, "label": "500"},
          {"id": 12, "label": "1000"}
        ]
      }
    ]
  }
]
```

---

# Customer Flow

```text
HOME
  ↓
PRODUCTS
  ↓
PRODUCT DETAILS
  ↓
CONFIGURE PRODUCT
  ↓
UPLOAD DESIGN
  ↓
GET QUOTE
  ↓
WHATSAPP
  ↓
BUSINESS CONFIRMATION
```

There is no online payment flow. The business manually reviews the customer's requirements and confirms the quotation/order.

---

# Admin Flow

```text
ADMIN LOGIN
    ↓
DASHBOARD
    ↓
Products / Categories / Enquiries
    ↓
Product Management
    ├── Create
    ├── Edit
    └── Delete
    ↓
Manage Options
    ↓
Manage Choices
```

Admin endpoints will be protected using authentication and authorization.

---

# Local Development

## Requirements

- Python
- uv
- PostgreSQL
- Node.js
- npm

## Backend Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ZestMedia.git
cd ZestMedia
```

### 2. Enter the backend

```bash
cd backend
```

### 3. Install dependencies

```bash
uv sync
```

### 4. Configure environment variables

Create `.env`:

```env
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/zestmedia
```

Never commit `.env`.

---

# Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE zestmedia;
```

Run migrations:

```bash
uv run alembic upgrade head
```

---

# Run the Backend

```bash
uv run uvicorn app.main:app --reload
```

API:

```text
http://127.0.0.1:8000
```

---

# API Documentation

### Swagger UI

```text
http://127.0.0.1:8000/docs
```

### ReDoc

```text
http://127.0.0.1:8000/redoc
```

---

# Database Migrations

Create a migration:

```bash
uv run alembic revision --autogenerate -m "describe your change"
```

Apply migrations:

```bash
uv run alembic upgrade head
```

Rollback:

```bash
uv run alembic downgrade -1
```

Check current migration:

```bash
uv run alembic current
```

---

# Frontend Setup

The frontend is built with Next.js.

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

> If your frontend directory has a different name, replace `frontend` with the correct directory.

---

# Environment Variables

## Backend

```env
DATABASE_URL=
JWT_SECRET=
SUPABASE_URL=
SUPABASE_KEY=
WHATSAPP_NUMBER=
```

## Frontend

```env
NEXT_PUBLIC_API_URL=
```

Never commit secrets or private API keys to Git.

---

# File Storage

Product images and customer-uploaded files should not be stored directly inside PostgreSQL.

The intended architecture is:

```text
Admin / Customer
       │
       ▼
    FastAPI
       │
       ▼
Object Storage
       │
       └── File URL
              │
              ▼
         PostgreSQL
```

PostgreSQL stores the file URL/reference while the actual file is stored in object storage.

Supabase Storage is planned for this purpose.

---

# Security

The application will use:

- Environment variables for secrets
- Password hashing
- JWT-based authentication
- Role-based authorization
- Pydantic validation
- CORS configuration
- Secure file upload handling
- Protected admin routes
- Database constraints
- Production HTTPS

Sensitive files such as `.env` must never be committed.

---

# Testing

Automated tests will be added using Python testing tools.

Planned coverage:

```text
Authentication
 ├── Login
 ├── Invalid credentials
 └── Authorization

Products
 ├── Create
 ├── Read
 ├── Update
 └── Delete

Categories
 ├── Create
 ├── Read
 ├── Update
 └── Delete

Options
 ├── Create
 └── Choices
```

---

# Development Roadmap

## Backend

- [x] PostgreSQL setup
- [x] SQLAlchemy database connection
- [x] SQLAlchemy models
- [x] Alembic configuration
- [x] Database migrations
- [x] Category creation API
- [x] Product creation API
- [x] Product listing API
- [x] Product options API
- [x] Option choices API
- [x] Nested product responses
- [ ] Product update API
- [ ] Product delete API
- [ ] Category CRUD
- [ ] Option update/delete
- [ ] Admin authentication
- [ ] JWT authorization
- [ ] Product image upload
- [ ] Customer file upload
- [ ] Enquiry system
- [ ] API tests
- [ ] Production configuration

## Frontend

- [x] Initial UI
- [x] Product pages
- [x] Product configuration interface
- [ ] Connect frontend to FastAPI
- [ ] Replace static product data with API data
- [ ] Admin login
- [ ] Admin dashboard
- [ ] Product management UI
- [ ] Category management UI
- [ ] Option management UI
- [ ] Image upload UI
- [ ] Enquiry management
- [ ] WhatsApp integration

## Deployment

- [ ] Production PostgreSQL
- [ ] Backend deployment
- [ ] Frontend deployment
- [ ] Object storage configuration
- [ ] Production environment variables
- [ ] Domain configuration
- [ ] HTTPS
- [ ] Monitoring
- [ ] Backup strategy

---

# Project Status

**Status: 🚧 Active Development**

The core backend foundation is currently implemented.

Current capabilities include:

- PostgreSQL database
- SQLAlchemy ORM
- Alembic migrations
- Categories
- Products
- Product options
- Option choices
- Nested product API responses

The next major milestone is completing product CRUD and building the admin management system.

---

# Design Philosophy

ZestMedia is intentionally designed around a simple business workflow:

```text
Discover
   ↓
Configure
   ↓
Request
   ↓
Communicate
   ↓
Confirm
```

Rather than forcing custom printing orders into a traditional e-commerce checkout, the platform focuses on product configuration and direct communication with the business.

---

# Contributing

This project is currently being developed for ZestMedia.

For internal development:

1. Create a feature branch.
2. Make the required changes.
3. Test the changes locally.
4. Create a pull request.
5. Review the changes before merging.

Example:

```bash
git checkout -b feature/product-crud
```

---

# License

This project is proprietary software developed for ZestMedia.

All rights reserved.

Unauthorized copying, distribution, modification, or commercial use is prohibited without permission from the project owner.

---

# Author

Developed for **ZestMedia**.

Built with:

```text
Python
FastAPI
PostgreSQL
SQLAlchemy
Alembic
Next.js
React
Tailwind CSS
```
