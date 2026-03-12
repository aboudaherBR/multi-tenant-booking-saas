--
-- PostgreSQL database dump
--

\restrict 95yh1FCRBck7yOrUyK8oSv3aC4Ly2hWs3a9BmJsRcgEtLc6y7DtSDmQUgUPXCxr

-- Dumped from database version 16.12
-- Dumped by pg_dump version 16.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    company_id uuid NOT NULL,
    professional_id uuid NOT NULL,
    service_id uuid NOT NULL,
    date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    service_name_snapshot character varying(150) NOT NULL,
    service_price_snapshot numeric(10,2) NOT NULL,
    service_duration_snapshot integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    timespan tsrange GENERATED ALWAYS AS (tsrange((date + start_time), (date + end_time))) STORED,
    client_id uuid NOT NULL,
    CONSTRAINT appointments_duration_match_check CHECK ((((EXTRACT(epoch FROM (end_time - start_time)) / (60)::numeric))::integer = service_duration_snapshot)),
    CONSTRAINT appointments_service_duration_snapshot_check CHECK ((service_duration_snapshot > 0)),
    CONSTRAINT appointments_service_price_snapshot_check CHECK ((service_price_snapshot >= (0)::numeric)),
    CONSTRAINT appointments_time_order_check CHECK ((end_time > start_time))
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    company_id uuid NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    appointment_buffer_minutes integer DEFAULT 0,
    lunch_start_time time without time zone,
    lunch_end_time time without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    subscription_ends_at timestamp without time zone,
    slot_interval_minutes integer DEFAULT 30 NOT NULL,
    slug character varying(100) NOT NULL,
    CONSTRAINT companies_appointment_buffer_minutes_check CHECK ((appointment_buffer_minutes >= 0)),
    CONSTRAINT companies_lunch_time_check CHECK ((((lunch_start_time IS NULL) AND (lunch_end_time IS NULL)) OR ((lunch_start_time IS NOT NULL) AND (lunch_end_time IS NOT NULL) AND (lunch_start_time < lunch_end_time)))),
    CONSTRAINT companies_slot_interval_check CHECK (((slot_interval_minutes > 0) AND (slot_interval_minutes <= 240))),
    CONSTRAINT companies_status_check CHECK (((status)::text = ANY (ARRAY[('active'::character varying)::text, ('inactive'::character varying)::text])))
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: company_business_hours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_business_hours (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    company_id uuid NOT NULL,
    weekday integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    CONSTRAINT company_business_hours_check CHECK ((start_time < end_time)),
    CONSTRAINT company_business_hours_day_of_week_check CHECK (((weekday >= 0) AND (weekday <= 6)))
);


ALTER TABLE public.company_business_hours OWNER TO postgres;

--
-- Name: professional_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professional_services (
    company_id uuid NOT NULL,
    professional_id uuid NOT NULL,
    service_id uuid NOT NULL,
    custom_price numeric(10,2)
);


ALTER TABLE public.professional_services OWNER TO postgres;

--
-- Name: professionals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professionals (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    company_id uuid NOT NULL,
    user_id uuid NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    photo_url text,
    slug character varying(100) NOT NULL
);


ALTER TABLE public.professionals OWNER TO postgres;

--
-- Name: schedule_blocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedule_blocks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    company_id uuid NOT NULL,
    professional_id uuid,
    start_date date NOT NULL,
    end_date date NOT NULL,
    start_time time without time zone,
    end_time time without time zone,
    reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT schedule_blocks_check CHECK ((start_date <= end_date)),
    CONSTRAINT schedule_blocks_check1 CHECK ((((start_time IS NULL) AND (end_time IS NULL)) OR ((start_time IS NOT NULL) AND (end_time IS NOT NULL) AND (start_time < end_time))))
);


ALTER TABLE public.schedule_blocks OWNER TO postgres;

--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    company_id uuid NOT NULL,
    name character varying(150) NOT NULL,
    base_price numeric(10,2) NOT NULL,
    duration_minutes integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    slug character varying(150) NOT NULL,
    CONSTRAINT services_duration_minutes_check CHECK ((duration_minutes > 0)),
    CONSTRAINT services_price_check CHECK ((base_price >= (0)::numeric))
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    company_id uuid,
    name text NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    is_company_admin boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_unique_slot; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_unique_slot UNIQUE (company_id, professional_id, date, start_time);


--
-- Name: company_business_hours business_hours_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_business_hours
    ADD CONSTRAINT business_hours_unique UNIQUE (company_id, weekday);


--
-- Name: clients clients_company_id_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_company_id_id_unique UNIQUE (company_id, id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: clients clients_unique_phone_per_company; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_unique_phone_per_company UNIQUE (company_id, phone);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: companies companies_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_slug_unique UNIQUE (slug);


--
-- Name: company_business_hours company_business_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_business_hours
    ADD CONSTRAINT company_business_hours_pkey PRIMARY KEY (id);


--
-- Name: appointments no_time_overlap; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT no_time_overlap EXCLUDE USING gist (professional_id WITH =, timespan WITH &&);


--
-- Name: professionals professionals_company_id_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professionals
    ADD CONSTRAINT professionals_company_id_id_unique UNIQUE (company_id, id);


--
-- Name: professionals professionals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professionals
    ADD CONSTRAINT professionals_pkey PRIMARY KEY (id);


--
-- Name: professionals professionals_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professionals
    ADD CONSTRAINT professionals_user_id_key UNIQUE (user_id);


--
-- Name: professional_services ps_unique_relationship; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_services
    ADD CONSTRAINT ps_unique_relationship UNIQUE (company_id, professional_id, service_id);


--
-- Name: schedule_blocks schedule_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_blocks
    ADD CONSTRAINT schedule_blocks_pkey PRIMARY KEY (id);


--
-- Name: services services_company_id_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_company_id_id_unique UNIQUE (company_id, id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services services_unique_name_per_company; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_unique_name_per_company UNIQUE (company_id, name);


--
-- Name: users users_company_id_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_company_id_id_unique UNIQUE (company_id, id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: professionals_company_slug_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX professionals_company_slug_unique ON public.professionals USING btree (company_id, slug);


--
-- Name: services_company_slug_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX services_company_slug_unique ON public.services USING btree (company_id, slug);


--
-- Name: users_unique_company_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_unique_company_username ON public.users USING btree (company_id, username) WHERE (company_id IS NOT NULL);


--
-- Name: users_unique_platform_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_unique_platform_username ON public.users USING btree (username) WHERE (company_id IS NULL);


--
-- Name: appointments appointments_client_company_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_client_company_fk FOREIGN KEY (company_id, client_id) REFERENCES public.clients(company_id, id) ON DELETE RESTRICT;


--
-- Name: appointments appointments_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: appointments appointments_company_professional_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_company_professional_fk FOREIGN KEY (company_id, professional_id) REFERENCES public.professionals(company_id, id) ON DELETE CASCADE;


--
-- Name: appointments appointments_company_service_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_company_service_fk FOREIGN KEY (company_id, service_id) REFERENCES public.services(company_id, id) ON DELETE RESTRICT;


--
-- Name: company_business_hours business_hours_company_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_business_hours
    ADD CONSTRAINT business_hours_company_fk FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: clients clients_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: professionals professionals_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professionals
    ADD CONSTRAINT professionals_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: professionals professionals_company_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professionals
    ADD CONSTRAINT professionals_company_user_fk FOREIGN KEY (company_id, user_id) REFERENCES public.users(company_id, id) ON DELETE CASCADE;


--
-- Name: professional_services ps_company_professional_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_services
    ADD CONSTRAINT ps_company_professional_fk FOREIGN KEY (company_id, professional_id) REFERENCES public.professionals(company_id, id) ON DELETE CASCADE;


--
-- Name: professional_services ps_company_service_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_services
    ADD CONSTRAINT ps_company_service_fk FOREIGN KEY (company_id, service_id) REFERENCES public.services(company_id, id) ON DELETE CASCADE;


--
-- Name: schedule_blocks schedule_blocks_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_blocks
    ADD CONSTRAINT schedule_blocks_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: schedule_blocks schedule_blocks_company_professional_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_blocks
    ADD CONSTRAINT schedule_blocks_company_professional_fk FOREIGN KEY (company_id, professional_id) REFERENCES public.professionals(company_id, id) ON DELETE CASCADE;


--
-- Name: services services_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: users users_company_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_company_fk FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 95yh1FCRBck7yOrUyK8oSv3aC4Ly2hWs3a9BmJsRcgEtLc6y7DtSDmQUgUPXCxr

