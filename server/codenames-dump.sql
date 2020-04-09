--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1

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
-- Name: betacodenames; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE betacodenames WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';


\connect betacodenames

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

SET default_table_access_method = heap;

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
    game_code character varying(10) NOT NULL
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
    last_updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
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
    game_id integer NOT NULL,
    name character varying(40) NOT NULL,
    team public.team_options DEFAULT 'OBSERVER'::public.team_options NOT NULL,
    is_cluegiver boolean DEFAULT false NOT NULL
);


--
-- Name: players_game_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.players_game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: players_game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.players_game_id_seq OWNED BY public.players.game_id;


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
-- Name: players game_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players ALTER COLUMN game_id SET DEFAULT nextval('public.players_game_id_seq'::regclass);


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
-- Name: games games_game_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_game_code_key UNIQUE (game_code);


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
-- Name: players players_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id);


--
-- Name: secrets secrets_playerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secrets
    ADD CONSTRAINT secrets_playerid_fkey FOREIGN KEY (playerid) REFERENCES public.players(id);




INSERT INTO public.words (text) VALUES 
('Hollywood'),
('Screen'),
('Play'),
('Marble'),
('Dinosaur'),
('Cat'),
('Pitch'),
('Bond'),
('Greece'),
('Deck'),
('Spike'),
('Center'),
('Vacuum'),
('Unicorn'),
('Undertaker'),
('Sock'),
('Loch Ness'),
('Horse'),
('Berlin'),
('Platypus'),
('Port'),
('Chest'),
('Box'),
('Compound'),
('Ship'),
('Watch'),
('Space'),
('Flute'),
('Tower'),
('Death'),
('Well'),
('Fair'),
('Tooth'),
('Staff'),
('Bill'),
('Shot'),
('King'),
('Pan'),
('Square'),
('Buffalo'),
('Scientist'),
('Chick'),
('Atlantis'),
('Spy'),
('Mail'),
('Nut'),
('Log'),
('Pirate'),
('Face'),
('Stick'),
('Disease'),
('Yard'),
('Mount'),
('Slug'),
('Dice'),
('Lead'),
('Hook'),
('Carrot'),
('Poison'),
('Stock'),
('Foot'),
('Torch'),
('Arm'),
('Figure'),
('Mine'),
('Suit'),
('Crane'),
('Beijing'),
('Mass'),
('Microscope'),
('Engine'),
('China'),
('Straw'),
('Pants'),
('Europe'),
('Boot'),
('Princess'),
('Link'),
('Luck'),
('Olive'),
('Palm'),
('Teacher'),
('Thumb'),
('Octopus'),
('Hood'),
('Tie'),
('Doctor'),
('Wake'),
('Cricket'),
('Millionaire'),
('Slip'),
('Limousine'),
('Pass'),
('Theater'),
('Plate'),
('Satellite'),
('Ketchup'),
('Hotel'),
('Tail'),
('Tick'),
('Ground'),
('Police'),
('Dwarf'),
('Fan'),
('Dress'),
('Saturn'),
('Grass'),
('Brush'),
('Chair'),
('Rock'),
('Pilot'),
('Telescope'),
('File'),
('Lab'),
('India'),
('Ruler'),
('Nail'),
('Swing'),
('Olympus'),
('Change'),
('Tablet'),
('Australia'),
('Green'),
('Egypt'),
('Line'),
('Lawyer'),
('Witch'),
('Parachute'),
('Crash'),
('Gold'),
('Note'),
('Lion'),
('Plastic'),
('Web'),
('Ambulance'),
('Hospital'),
('Spell'),
('Lock'),
('Water'),
('London'),
('Casino'),
('Cycle'),
('Bar'),
('Cliff'),
('Round'),
('Bomb'),
('Giant'),
('Hand'),
('Ninja'),
('Rose'),
('Drill'),
('Glove'),
('Paste'),
('Fall'),
('Fire'),
('Spider'),
('Spine'),
('Soldier'),
('Horn'),
('Queen'),
('Ham'),
('Litter'),
('Life'),
('Temple'),
('Rabbit'),
('Button'),
('Game'),
('Star'),
('Jupiter'),
('Vet'),
('Night'),
('Air'),
('Battery'),
('Genius'),
('Shop'),
('Bottle'),
('Stadium'),
('Alien'),
('Light'),
('Triangle'),
('Date'),
('Stream'),
('Missile'),
('Scale'),
('Band'),
('Angel'),
('Press'),
('Berry'),
('Card'),
('Check'),
('Draft'),
('Head'),
('Lap'),
('Orange'),
('Ice Cream'),
('Film'),
('Washer'),
('Pool'),
('Shark'),
('Van'),
('String'),
('Calf'),
('Hawk'),
('Eagle'),
('Needle'),
('Forest'),
('Dragon'),
('Key'),
('Belt'),
('Cap'),
('Bell'),
('Leprechaun'),
('Pheonix'),
('Force'),
('Boom'),
('Fork'),
('Alps'),
('Post'),
('Fence'),
('Kangaroo'),
('Mouse'),
('Mug'),
('Horseshoe'),
('Scorpion'),
('Agent'),
('Helicopter'),
('Hole'),
('Organ'),
('Jack'),
('Charge'),
('Lemon'),
('Nurse'),
('Drop'),
('Track'),
('Bank'),
('Germany'),
('Worm'),
('Ray'),
('Capital'),
('Strike'),
('War'),
('Concert'),
('Honey'),
('Canada'),
('Buck'),
('Snowman'),
('Beat'),
('Jam'),
('Copper'),
('Beach'),
('Spring'),
('Match'),
('Diamond'),
('Centaur'),
('March'),
('Roulette'),
('Dog'),
('Cross'),
('Wave'),
('Duck'),
('Wind'),
('Spot'),
('Skyscraper'),
('Paper'),
('Apple'),
('Oil'),
('Cook'),
('Fly'),
('Cast'),
('Bear'),
('Pin'),
('Thief'),
('Trunk'),
('America'),
('Novel'),
('Cell'),
('Bow'),
('Model'),
('Knife'),
('Knight'),
('New York'),
('State'),
('Bermuda'),
('Park'),
('Turkey'),
('Chocolate'),
('Trip'),
('Racket'),
('Bat'),
('Jet'),
('Shakespeare'),
('Bolt'),
('Switch'),
('Wall'),
('Soul'),
('Ghost'),
('Time'),
('Dance'),
('Amazon'),
('Grace'),
('Moscow'),
('Pumpkin'),
('Antarctica'),
('Whip'),
('Heart'),
('Table'),
('Ball'),
('Fighter'),
('Cold'),
('Day'),
('Court'),
('Iron'),
('Whale'),
('Shadow'),
('Contract'),
('Mercury'),
('Conductor'),
('Seal'),
('Car'),
('Ring'),
('Kid'),
('Piano'),
('Laser'),
('Sound'),
('Pole'),
('Superhero'),
('Revolution'),
('Pit'),
('Gas'),
('Glass'),
('Washington'),
('Bark'),
('Snow'),
('Ivory'),
('Pipe'),
('Cover'),
('Degree'),
('Tokyo'),
('Church'),
('Pie'),
('Point'),
('France'),
('Mammoth'),
('Cotton'),
('Robin'),
('Net'),
('Bugle'),
('Maple'),
('England'),
('Field'),
('Robot'),
('Plot'),
('Africa'),
('Tag'),
('Mouth'),
('Kiwi'),
('Mole'),
('School'),
('Sink'),
('Pistol'),
('Opera'),
('Mint'),
('Root'),
('Sub'),
('Crown'),
('Back'),
('Plane'),
('Mexico'),
('Cloak'),
('Circle'),
('Tube'),
('Block'),
('Comic'),
('Fish'),
('Bridge'),
('Moon'),
('Part'),
('Aztec'),
('Smuggler'),
('Train'),
('Embassy'),
('Pupil'),
('Scuba Diver'),
('Ice'),
('Tap'),
('Code'),
('Shoe'),
('Server'),
('Club'),
('Row'),
('Pyramid'),
('Bug'),
('Penguin'),
('Pound'),
('Himalayas'),
('Czech'),
('Rome'),
('Eye'),
('Board'),
('Bed');


--
-- PostgreSQL database dump complete
--

