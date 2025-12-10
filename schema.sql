--
-- PostgreSQL database dump
--

\restrict tmrmbZONzELDL8oycaPLRwWhMcbUNkDZFwzU1mN5vTZ8sWNI1Cx5RMAfa85L4Hq

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg13+2)
-- Dumped by pg_dump version 18.0

-- Started on 2025-12-10 13:41:54

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3485 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 230 (class 1255 OID 16483)
-- Name: check_timetable_no_self_overlap(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_timetable_no_self_overlap() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM course_timetables ct2
    WHERE ct2.course_id = NEW.course_id 
      AND ct2.day_of_week = NEW.day_of_week
      AND ct2.id != COALESCE(NEW.id, 0)
      AND (NEW.start_time < ct2.end_time AND ct2.start_time < NEW.end_time)
  ) THEN
    RAISE EXCEPTION 'Timetable overlaps with existing slot for same course/day';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_timetable_no_self_overlap() OWNER TO postgres;

--
-- TOC entry 229 (class 1255 OID 16481)
-- Name: enforce_student_course_same_college(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.enforce_student_course_same_college() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Verify student and course exist in same college
  IF NOT EXISTS (
    SELECT 1 FROM students s 
    JOIN courses c ON s.college_id = c.college_id
    WHERE s.id = NEW.student_id AND c.id = NEW.course_id
  ) THEN
    RAISE EXCEPTION 'Student and course must belong to the same college';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.enforce_student_course_same_college() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: colleges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.colleges (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.colleges OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: colleges_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.colleges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.colleges_id_seq OWNER TO postgres;

--
-- TOC entry 3486 (class 0 OID 0)
-- Dependencies: 219
-- Name: colleges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.colleges_id_seq OWNED BY public.colleges.id;


--
-- TOC entry 226 (class 1259 OID 16438)
-- Name: course_timetables; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_timetables (
    id integer NOT NULL,
    course_id bigint NOT NULL,
    day_of_week smallint NOT NULL,
    "startTime" time without time zone NOT NULL,
    "endTime" time without time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.course_timetables OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16437)
-- Name: course_timetables_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_timetables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_timetables_id_seq OWNER TO postgres;

--
-- TOC entry 3487 (class 0 OID 0)
-- Dependencies: 225
-- Name: course_timetables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_timetables_id_seq OWNED BY public.course_timetables.id;


--
-- TOC entry 224 (class 1259 OID 16418)
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    code character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    college_id bigint NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16417)
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO postgres;

--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 223
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- TOC entry 228 (class 1259 OID 16457)
-- Name: student_course_selections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_course_selections (
    id integer NOT NULL,
    student_id bigint NOT NULL,
    course_id bigint NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.student_course_selections OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16456)
-- Name: student_course_selections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_course_selections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_course_selections_id_seq OWNER TO postgres;

--
-- TOC entry 3489 (class 0 OID 0)
-- Dependencies: 227
-- Name: student_course_selections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_course_selections_id_seq OWNED BY public.student_course_selections.id;


--
-- TOC entry 222 (class 1259 OID 16401)
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    college_id bigint NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.students OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16400)
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO postgres;

--
-- TOC entry 3490 (class 0 OID 0)
-- Dependencies: 221
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- TOC entry 3311 (class 2604 OID 16393)
-- Name: colleges id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colleges ALTER COLUMN id SET DEFAULT nextval('public.colleges_id_seq'::regclass);


--
-- TOC entry 3314 (class 2604 OID 16441)
-- Name: course_timetables id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_timetables ALTER COLUMN id SET DEFAULT nextval('public.course_timetables_id_seq'::regclass);


--
-- TOC entry 3313 (class 2604 OID 16421)
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- TOC entry 3315 (class 2604 OID 16460)
-- Name: student_course_selections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_course_selections ALTER COLUMN id SET DEFAULT nextval('public.student_course_selections_id_seq'::regclass);


--
-- TOC entry 3312 (class 2604 OID 16404)
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- TOC entry 3317 (class 2606 OID 16399)
-- Name: colleges colleges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colleges
    ADD CONSTRAINT colleges_pkey PRIMARY KEY (id);


--
-- TOC entry 3323 (class 2606 OID 16450)
-- Name: course_timetables course_timetables_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_timetables
    ADD CONSTRAINT course_timetables_pkey PRIMARY KEY (id);


--
-- TOC entry 3321 (class 2606 OID 16431)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 3325 (class 2606 OID 16467)
-- Name: student_course_selections student_course_selections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_course_selections
    ADD CONSTRAINT student_course_selections_pkey PRIMARY KEY (id);


--
-- TOC entry 3319 (class 2606 OID 16411)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- TOC entry 3332 (class 2620 OID 16482)
-- Name: student_course_selections trg_student_course_same_college; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_student_course_same_college BEFORE INSERT OR UPDATE ON public.student_course_selections FOR EACH ROW EXECUTE FUNCTION public.enforce_student_course_same_college();


--
-- TOC entry 3331 (class 2620 OID 16484)
-- Name: course_timetables trg_timetable_no_self_overlap; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_timetable_no_self_overlap BEFORE INSERT OR UPDATE ON public.course_timetables FOR EACH ROW EXECUTE FUNCTION public.check_timetable_no_self_overlap();


--
-- TOC entry 3328 (class 2606 OID 16451)
-- Name: course_timetables course_timetables_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_timetables
    ADD CONSTRAINT course_timetables_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3327 (class 2606 OID 16432)
-- Name: courses courses_college_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_college_id_fkey FOREIGN KEY (college_id) REFERENCES public.colleges(id) ON UPDATE CASCADE;


--
-- TOC entry 3329 (class 2606 OID 16473)
-- Name: student_course_selections student_course_selections_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_course_selections
    ADD CONSTRAINT student_course_selections_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3330 (class 2606 OID 16468)
-- Name: student_course_selections student_course_selections_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_course_selections
    ADD CONSTRAINT student_course_selections_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3326 (class 2606 OID 16412)
-- Name: students students_college_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_college_id_fkey FOREIGN KEY (college_id) REFERENCES public.colleges(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2025-12-10 13:41:54

--
-- PostgreSQL database dump complete
--

\unrestrict tmrmbZONzELDL8oycaPLRwWhMcbUNkDZFwzU1mN5vTZ8sWNI1Cx5RMAfa85L4Hq

