--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5
-- Dumped by pg_dump version 11.5

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
-- Name: codenames; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE codenames WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';


\connect codenames

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
-- Name: card_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.card_type AS ENUM (
    'RED',
    'BLUE',
    'ASSASSIN',
    'NEUTRAL'
);


--
-- Name: team_options; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.team_options AS ENUM (
    'RED',
    'BLUE',
    'OBSERVER'
);


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: avatars; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.avatars (
    id integer NOT NULL,
    player_id integer,
    image character varying
);


--
-- Name: avatars_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.avatars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: avatars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.avatars_id_seq OWNED BY public.avatars.id;


--
-- Name: game_words; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.game_words (
    id integer NOT NULL,
    word_id integer NOT NULL,
    game_id integer NOT NULL,
    sort numeric DEFAULT random(),
    type public.card_type NOT NULL
);


--
-- Name: game_words_game_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.game_words_game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: game_words_game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.game_words_game_id_seq OWNED BY public.game_words.game_id;


--
-- Name: game_words_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.game_words_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: game_words_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.game_words_id_seq OWNED BY public.game_words.id;


--
-- Name: game_words_word_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.game_words_word_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: game_words_word_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.game_words_word_id_seq OWNED BY public.game_words.word_id;


--
-- Name: games; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.games (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    room_id integer NOT NULL
);


--
-- Name: games_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.games_id_seq OWNED BY public.games.id;


--
-- Name: moves; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moves (
    id integer NOT NULL,
    player_id integer NOT NULL,
    word_id integer,
    is_turn_end boolean DEFAULT false NOT NULL,
    last_updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    game_id integer NOT NULL
);


--
-- Name: moves_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moves_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moves_id_seq OWNED BY public.moves.id;


--
-- Name: players; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.players (
    id integer NOT NULL,
    name character varying(40) NOT NULL,
    team public.team_options DEFAULT 'OBSERVER'::public.team_options NOT NULL,
    is_cluegiver boolean DEFAULT false NOT NULL,
    room_id integer,
    secret character varying(40)
);


--
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.players_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    code character varying(10) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- Name: secrets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.secrets (
    secret character varying(40),
    playerid integer NOT NULL
);


--
-- Name: secrets_playerid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.secrets_playerid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: secrets_playerid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.secrets_playerid_seq OWNED BY public.secrets.playerid;


--
-- Name: words; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.words (
    id integer NOT NULL,
    text character varying(40) NOT NULL
);


--
-- Name: words_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.words_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: words_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.words_id_seq OWNED BY public.words.id;


--
-- Name: avatars id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avatars ALTER COLUMN id SET DEFAULT nextval('public.avatars_id_seq'::regclass);


--
-- Name: game_words id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_words ALTER COLUMN id SET DEFAULT nextval('public.game_words_id_seq'::regclass);


--
-- Name: game_words word_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_words ALTER COLUMN word_id SET DEFAULT nextval('public.game_words_word_id_seq'::regclass);


--
-- Name: game_words game_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_words ALTER COLUMN game_id SET DEFAULT nextval('public.game_words_game_id_seq'::regclass);


--
-- Name: games id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games ALTER COLUMN id SET DEFAULT nextval('public.games_id_seq'::regclass);


--
-- Name: moves id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moves ALTER COLUMN id SET DEFAULT nextval('public.moves_id_seq'::regclass);


--
-- Name: players id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq'::regclass);


--
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- Name: secrets playerid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secrets ALTER COLUMN playerid SET DEFAULT nextval('public.secrets_playerid_seq'::regclass);


--
-- Name: words id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.words ALTER COLUMN id SET DEFAULT nextval('public.words_id_seq'::regclass);


--
-- Name: avatars avatars_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avatars
    ADD CONSTRAINT avatars_pkey PRIMARY KEY (id);


--
-- Name: game_words game_words_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_words
    ADD CONSTRAINT game_words_pkey PRIMARY KEY (id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- Name: moves moves_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moves
    ADD CONSTRAINT moves_pkey PRIMARY KEY (id);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: players players_room_id_secret_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_room_id_secret_key UNIQUE (room_id, secret);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: words words_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.words
    ADD CONSTRAINT words_pkey PRIMARY KEY (id);


--
-- Name: words words_text_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.words
    ADD CONSTRAINT words_text_key UNIQUE (text);


--
-- Name: avatars avatars_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avatars
    ADD CONSTRAINT avatars_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- Name: game_words game_words_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_words
    ADD CONSTRAINT game_words_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id);


--
-- Name: game_words game_words_word_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_words
    ADD CONSTRAINT game_words_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.words(id);


--
-- Name: games games_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- Name: moves moves_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moves
    ADD CONSTRAINT moves_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id);


--
-- Name: moves moves_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moves
    ADD CONSTRAINT moves_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- Name: moves moves_word_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moves
    ADD CONSTRAINT moves_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.words(id);


--
-- Name: players players_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- Name: secrets secrets_playerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secrets
    ADD CONSTRAINT secrets_playerid_fkey FOREIGN KEY (playerid) REFERENCES public.players(id);


--
-- PostgreSQL database dump complete
--

