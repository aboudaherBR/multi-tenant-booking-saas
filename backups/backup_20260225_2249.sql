--
-- PostgreSQL database dump
--

\restrict FUBePHN9mA0FuXF4u6mFPibXVJcHuterHfNMBov35m0q3dIaSQQEr1AIXDIk1s6

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
    CONSTRAINT companies_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
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
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    professional_id uuid NOT NULL,
    name character varying(150) NOT NULL,
    price numeric(10,2) NOT NULL,
    duration_minutes integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT services_duration_minutes_check CHECK ((duration_minutes > 0)),
    CONSTRAINT services_price_check CHECK ((price >= (0)::numeric))
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
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, company_id, professional_id, service_id, date, start_time, end_time, service_name_snapshot, service_price_snapshot, service_duration_snapshot, created_at, client_id) FROM stdin;
f01ec7dc-7d5b-4703-9a38-ae322ceb8cdf	672d35c1-a21f-4a15-899e-06d771328e0a	d8f05011-3de6-4630-826f-51a322fd3c5c	4d40248f-87a5-453f-8bd9-460580a3bda0	2026-04-09	11:00:00	12:00:00	Corte Feminino	100.00	60	2026-02-24 11:00:28.018506	c8fb2523-23b5-498c-926e-f06ec6e53b6b
4b0b3cb1-1b17-4cd4-a1fe-c6c437ca6947	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	f08580f1-a0b4-4aa7-aab1-67ca9b3215f5	c23998cc-50a3-4b80-b78b-015dc15693ee	2026-02-26	09:00:00	10:00:00	Corte Feminino	80.00	60	2026-02-25 13:27:56.027001	bdfd0d02-abea-4d46-b6f2-f6b7b12eebea
1fc8659b-3944-44a3-aad1-334ae8fced80	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	f08580f1-a0b4-4aa7-aab1-67ca9b3215f5	4e4d7216-3370-457c-a69f-202a1ad0d9e5	2026-02-26	10:30:00	11:10:00	Escova	50.00	40	2026-02-25 13:29:11.073571	bdfd0d02-abea-4d46-b6f2-f6b7b12eebea
1339fce3-b92e-4321-91ed-80ca5865da2d	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	f08580f1-a0b4-4aa7-aab1-67ca9b3215f5	c23998cc-50a3-4b80-b78b-015dc15693ee	2026-03-10	10:00:00	11:00:00	Corte Feminino	80.00	60	2026-02-25 14:26:24.848511	c2c1f8ab-8462-48f0-9afb-79410c7e0ea5
bf4cc9ca-8cf8-417d-b28d-5a7feddc573d	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	f08580f1-a0b4-4aa7-aab1-67ca9b3215f5	c23998cc-50a3-4b80-b78b-015dc15693ee	2026-03-10	14:00:00	15:00:00	Corte Feminino	80.00	60	2026-02-25 14:26:49.985637	1096c472-ea69-4ebc-82fc-4a4d4fcab69b
c56bf20a-d0ce-418a-8c65-42205d977102	672d35c1-a21f-4a15-899e-06d771328e0a	d8f05011-3de6-4630-826f-51a322fd3c5c	4d40248f-87a5-453f-8bd9-460580a3bda0	2026-03-10	14:00:00	15:00:00	Corte Feminino	100.00	60	2026-02-25 21:44:41.864413	996f8056-d4f5-470b-8d28-8b94a32ff591
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, company_id, name, phone, created_at, is_active) FROM stdin;
bdfd0d02-abea-4d46-b6f2-f6b7b12eebea	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	Maria S.	5585999999999	2026-02-25 13:23:33.479533	t
d038a7ba-f54f-469b-a09b-32f7cc8e3828	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	Ana	5585988888888	2026-02-25 13:31:05.081514	t
c2c1f8ab-8462-48f0-9afb-79410c7e0ea5	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	Cliente Manha	5585911111111	2026-02-25 14:23:49.970605	t
1096c472-ea69-4ebc-82fc-4a4d4fcab69b	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	Cliente Tarde	5585922222222	2026-02-25 14:26:49.973992	t
c8fb2523-23b5-498c-926e-f06ec6e53b6b	672d35c1-a21f-4a15-899e-06d771328e0a	Cliente Teste	00000000000	2026-02-25 11:51:47.484377	t
996f8056-d4f5-470b-8d28-8b94a32ff591	672d35c1-a21f-4a15-899e-06d771328e0a	Cliente Teste	5500000000000	2026-02-25 21:44:41.812044	t
01a19910-767f-4a89-8629-54776772ef1b	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	Cliente Teste	5500000000000	2026-02-25 21:45:47.108392	t
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, appointment_buffer_minutes, lunch_start_time, lunch_end_time, created_at, status, subscription_ends_at, slot_interval_minutes, slug) FROM stdin;
672d35c1-a21f-4a15-899e-06d771328e0a	Salon Teste	0	\N	\N	2026-02-21 16:05:56.308231	active	\N	30	joao
92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	Salao Teste V2	10	12:00:00	13:00:00	2026-02-25 12:45:52.583057	active	\N	30	maria
\.


--
-- Data for Name: company_business_hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_business_hours (id, company_id, weekday, start_time, end_time, is_active) FROM stdin;
f27c95c8-0c67-484a-99f9-4d34a97b8c6b	672d35c1-a21f-4a15-899e-06d771328e0a	1	09:00:00	18:00:00	t
c2f6dbb2-5874-4e6d-9143-b93fed08bc2a	672d35c1-a21f-4a15-899e-06d771328e0a	2	09:00:00	18:00:00	t
d3bc1342-6eb7-4a11-a966-19c8d9aa1561	672d35c1-a21f-4a15-899e-06d771328e0a	3	09:00:00	18:00:00	t
7aa7bbc1-9483-4ae5-afbb-a8b2d74d416a	672d35c1-a21f-4a15-899e-06d771328e0a	4	09:00:00	18:00:00	t
512a450b-b315-4e8d-bda0-53a8246df8d4	672d35c1-a21f-4a15-899e-06d771328e0a	5	09:00:00	18:00:00	t
\.


--
-- Data for Name: professional_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professional_services (company_id, professional_id, service_id, created_at) FROM stdin;
672d35c1-a21f-4a15-899e-06d771328e0a	d8f05011-3de6-4630-826f-51a322fd3c5c	4d40248f-87a5-453f-8bd9-460580a3bda0	2026-02-25 22:39:23.620751
\.


--
-- Data for Name: professionals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professionals (id, company_id, user_id, is_active, created_at) FROM stdin;
d8f05011-3de6-4630-826f-51a322fd3c5c	672d35c1-a21f-4a15-899e-06d771328e0a	11111111-1111-1111-1111-111111111111	t	2026-02-21 16:22:59.540732
f08580f1-a0b4-4aa7-aab1-67ca9b3215f5	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	af2465a6-72b5-4f37-b206-8782e570de20	t	2026-02-25 12:54:07.87057
\.


--
-- Data for Name: schedule_blocks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_blocks (id, company_id, professional_id, start_date, end_date, start_time, end_time, reason, created_at) FROM stdin;
e168a45a-9b8f-4a1f-ae89-27b185e2d6bf	672d35c1-a21f-4a15-899e-06d771328e0a	d8f05011-3de6-4630-826f-51a322fd3c5c	2026-04-09	2026-04-09	13:00:00	14:00:00	\N	2026-02-24 11:00:28.09303
ed2bcce0-8c15-4585-9786-2362de767988	672d35c1-a21f-4a15-899e-06d771328e0a	\N	2026-04-13	2026-04-13	\N	\N	\N	2026-02-24 11:00:28.190314
cae6f2f2-cca2-4d75-95bc-b34c601219ba	672d35c1-a21f-4a15-899e-06d771328e0a	d8f05011-3de6-4630-826f-51a322fd3c5c	2026-04-15	2026-04-16	10:00:00	11:00:00	\N	2026-02-24 11:00:28.236303
6849ef93-4ddb-4c05-add5-b5d6d61ace58	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	f08580f1-a0b4-4aa7-aab1-67ca9b3215f5	2026-03-10	2026-03-10	09:00:00	12:00:00	Bloco 1	2026-02-25 14:42:37.652081
9c07d9ac-9814-4127-a772-af3947049015	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	f08580f1-a0b4-4aa7-aab1-67ca9b3215f5	2026-03-10	2026-03-10	13:00:00	16:00:00	Bloco 2	2026-02-25 14:43:43.992913
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, company_id, professional_id, name, price, duration_minutes, is_active, created_at) FROM stdin;
4d40248f-87a5-453f-8bd9-460580a3bda0	672d35c1-a21f-4a15-899e-06d771328e0a	d8f05011-3de6-4630-826f-51a322fd3c5c	Corte Feminino	100.00	60	t	2026-02-21 16:23:27.228238
c23998cc-50a3-4b80-b78b-015dc15693ee	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	f08580f1-a0b4-4aa7-aab1-67ca9b3215f5	Corte Feminino	80.00	60	t	2026-02-25 12:55:00.714463
4e4d7216-3370-457c-a69f-202a1ad0d9e5	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	f08580f1-a0b4-4aa7-aab1-67ca9b3215f5	Escova	50.00	40	t	2026-02-25 12:55:00.714463
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, company_id, name, username, password_hash, is_company_admin, is_active, created_at) FROM stdin;
11111111-1111-1111-1111-111111111111	672d35c1-a21f-4a15-899e-06d771328e0a	Administrador	admin	$2b$10$PfSTkKLwhUTo6COkkkbE1OvW4S48kQzMOlc4EjyJaN.mfriOnYGYy	t	t	2026-02-21 16:15:31.004766
af2465a6-72b5-4f37-b206-8782e570de20	92d65f6d-5554-42e2-93b6-8c61bdfb9ac8	Admin Teste V2	admin_v2	$2b$10$YUKdo9Ax9U8SLc.3rdK/auKtRiGyg9LFYCA.S22BwbCXCf/3.kFVK	t	t	2026-02-25 12:49:13.790644
\.


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
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: clients clients_unique_company_id_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_unique_company_id_id UNIQUE (company_id, id);


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
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services services_unique_company_id_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_unique_company_id_id UNIQUE (company_id, id);


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
-- Name: appointments appointments_professional_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES public.professionals(id) ON DELETE CASCADE;


--
-- Name: appointments appointments_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE RESTRICT;


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
-- Name: professional_services ps_professional_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_services
    ADD CONSTRAINT ps_professional_fk FOREIGN KEY (company_id, professional_id) REFERENCES public.professionals(company_id, id) ON DELETE CASCADE;


--
-- Name: professional_services ps_service_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_services
    ADD CONSTRAINT ps_service_fk FOREIGN KEY (company_id, service_id) REFERENCES public.services(company_id, id) ON DELETE CASCADE;


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
-- Name: services services_company_professional_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_company_professional_fk FOREIGN KEY (company_id, professional_id) REFERENCES public.professionals(company_id, id) ON DELETE CASCADE;


--
-- Name: users users_company_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_company_fk FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict FUBePHN9mA0FuXF4u6mFPibXVJcHuterHfNMBov35m0q3dIaSQQEr1AIXDIk1s6

