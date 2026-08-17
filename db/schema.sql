-- ============================================================================
-- Victory Fashion Design — Neon Postgres schema
--
-- Applied to the Neon project backing DATABASE_URL. Safe to re-run: every
-- statement is IF NOT EXISTS, so it will not clobber existing data.
--
--   psql "$DATABASE_URL" -f db/schema.sql
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Products (shop catalogue)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  category       text NOT NULL DEFAULT 'dresses',
  price          numeric(10,2) NOT NULL DEFAULT 0,
  description    text,
  image_url      text,
  badge          text,
  stock_quantity integer NOT NULL DEFAULT 0,
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_active_created_idx
  ON products (is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS products_category_idx
  ON products (category);

-- ---------------------------------------------------------------------------
-- Orders
--
-- payment_status: pending | processing | paid | failed | unpaid (WhatsApp)
-- status:         pending | confirmed | ...
-- checkout_request_id is how the M-Pesa callback finds the order again.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number         text UNIQUE NOT NULL,
  customer_name        text NOT NULL,
  customer_phone       text NOT NULL,
  customer_email       text,
  delivery_address     text,
  subtotal             numeric(10,2),
  delivery_fee         numeric(10,2),
  total                numeric(10,2),
  status               text DEFAULT 'pending',
  payment_status       text DEFAULT 'pending',
  checkout_request_id  text,
  mpesa_transaction_id text,
  notes                text,
  created_at           timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_created_idx
  ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS orders_checkout_request_idx
  ON orders (checkout_request_id);

-- ---------------------------------------------------------------------------
-- Order line items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity     integer DEFAULT 1,
  price        numeric(10,2),
  subtotal     numeric(10,2)
);

CREATE INDEX IF NOT EXISTS order_items_order_idx
  ON order_items (order_id);

-- ---------------------------------------------------------------------------
-- Academy enrolments
--
-- has_experience is text rather than boolean: the form sends "Yes"/"No" in
-- some paths and a boolean in others.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enrollments (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name              text NOT NULL,
  date_of_birth          text,
  gender                 text,
  id_number              text,
  email                  text,
  phone                  text,
  address                text,
  city                   text,
  county                 text,
  education_level        text,
  has_experience         text,
  emergency_name         text,
  emergency_relationship text,
  emergency_phone        text,
  intake_month           text,
  study_mode             text,
  additional_info        text,
  status                 text DEFAULT 'pending',
  created_at             timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS enrollments_created_idx
  ON enrollments (created_at DESC);

-- ---------------------------------------------------------------------------
-- Contact form messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text,
  phone      text,
  subject    text,
  message    text NOT NULL,
  status     text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_messages_created_idx
  ON contact_messages (created_at DESC);
