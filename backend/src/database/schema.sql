-- =========================================================
-- EXTENSIONS
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- COMPANIES
-- =========================================================

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  appointment_buffer_minutes INTEGER DEFAULT 0 CHECK (appointment_buffer_minutes >= 0),
  lunch_start_time TIME,
  lunch_end_time TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID,
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_company_admin BOOLEAN DEFAULT false,
  is_professional BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT users_company_fk
    FOREIGN KEY (company_id)
    REFERENCES companies(id)
    ON DELETE CASCADE
);

CREATE UNIQUE INDEX users_unique_company_username
  ON users(company_id, username)
  WHERE company_id IS NOT NULL;

CREATE UNIQUE INDEX users_unique_platform_username
  ON users(username)
  WHERE company_id IS NULL;

-- =========================================================
-- PROFESSIONALS
-- =========================================================

CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL,
  user_id UUID NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT professionals_company_fk
    FOREIGN KEY (company_id)
    REFERENCES companies(id)
    ON DELETE CASCADE,

  CONSTRAINT professionals_company_user_fk
    FOREIGN KEY (company_id, user_id)
    REFERENCES users(company_id, id)
    ON DELETE CASCADE,

  CONSTRAINT professionals_company_unique
    UNIQUE (company_id, id),

  CONSTRAINT professionals_unique_user
    UNIQUE (user_id)
);

-- =========================================================
-- SERVICES
-- =========================================================

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL,
  professional_id UUID NOT NULL,
  name VARCHAR(150) NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT services_company_fk
    FOREIGN KEY (company_id)
    REFERENCES companies(id)
    ON DELETE CASCADE,

  CONSTRAINT services_professional_fk
    FOREIGN KEY (company_id, professional_id)
    REFERENCES professionals(company_id, id)
    ON DELETE CASCADE
);

-- =========================================================
-- COMPANY BUSINESS HOURS
-- =========================================================

CREATE TABLE company_business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL CHECK (start_time < end_time),

  CONSTRAINT business_hours_company_fk
    FOREIGN KEY (company_id)
    REFERENCES companies(id)
    ON DELETE CASCADE,

  CONSTRAINT business_hours_unique
    UNIQUE (company_id, day_of_week)
);

-- =========================================================
-- SCHEDULE BLOCKS
-- =========================================================

CREATE TABLE schedule_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL,
  professional_id UUID,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT schedule_blocks_date_check
    CHECK (start_date <= end_date),

  CONSTRAINT schedule_blocks_time_check
    CHECK (
      (start_time IS NULL AND end_time IS NULL)
      OR
      (start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
    ),

  CONSTRAINT schedule_blocks_company_fk
    FOREIGN KEY (company_id)
    REFERENCES companies(id)
    ON DELETE CASCADE,

  CONSTRAINT schedule_blocks_professional_fk
    FOREIGN KEY (company_id, professional_id)
    REFERENCES professionals(company_id, id)
    ON DELETE CASCADE
);

CREATE INDEX schedule_blocks_company_date_idx
  ON schedule_blocks(company_id, start_date, end_date);

CREATE INDEX schedule_blocks_professional_date_idx
  ON schedule_blocks(company_id, professional_id, start_date, end_date);

-- =========================================================
-- APPOINTMENTS
-- =========================================================

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL,
  professional_id UUID NOT NULL,
  service_id UUID NOT NULL,
  client_name TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  service_name_snapshot VARCHAR(150) NOT NULL,
  service_price_snapshot NUMERIC(10,2) NOT NULL CHECK (service_price_snapshot >= 0),
  service_duration_snapshot INTEGER NOT NULL CHECK (service_duration_snapshot > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT appointments_company_fk
    FOREIGN KEY (company_id)
    REFERENCES companies(id)
    ON DELETE CASCADE,

  CONSTRAINT appointments_professional_fk
    FOREIGN KEY (company_id, professional_id)
    REFERENCES professionals(company_id, id)
    ON DELETE CASCADE,

  CONSTRAINT appointments_service_fk
    FOREIGN KEY (company_id, service_id)
    REFERENCES services(company_id, id)
    ON DELETE RESTRICT
);

CREATE INDEX appointments_lookup_idx
  ON appointments(company_id, professional_id, date);

ALTER TABLE appointments
ADD CONSTRAINT appointments_unique_slot
UNIQUE (company_id, professional_id, date, start_time);