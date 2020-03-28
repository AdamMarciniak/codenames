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
-- Name: words id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.words ALTER COLUMN id SET DEFAULT nextval('public.words_id_seq'::regclass);


--
-- Data for Name: game_words; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.game_words (id, word_id, game_id, sort, type) FROM stdin;
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.games (id, created_at, game_code) FROM stdin;
\.


--
-- Data for Name: moves; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.moves (id, player_id, word_id, is_turn_end, last_updated_at) FROM stdin;
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.players (id, game_id, name, team, is_cluegiver) FROM stdin;
\.


--
-- Data for Name: words; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.words (id, text) FROM stdin;
1	Hollywood
2	Screen
3	Play
4	Marble
5	Dinosaur
6	Cat
7	Pitch
8	Bond
9	Greece
10	Deck
11	Spike
12	Center
13	Vacuum
14	Unicorn
15	Undertaker
16	Sock
17	Loch Ness
18	Horse
19	Berlin
20	Platypus
21	Port
22	Chest
23	Box
24	Compound
25	Ship
26	Watch
27	Space
28	Flute
29	Tower
30	Death
31	Well
32	Fair
33	Tooth
34	Staff
35	Bill
36	Shot
37	King
38	Pan
39	Square
40	Buffalo
41	Scientist
42	Chick
43	Atlantis
44	Spy
45	Mail
46	Nut
47	Log
48	Pirate
49	Face
50	Stick
51	Disease
52	Yard
53	Mount
54	Slug
55	Dice
56	Lead
57	Hook
58	Carrot
59	Poison
60	Stock
61	Foot
62	Torch
63	Arm
64	Figure
65	Mine
66	Suit
67	Crane
68	Beijing
69	Mass
70	Microscope
71	Engine
72	China
73	Straw
74	Pants
75	Europe
76	Boot
77	Princess
78	Link
79	Luck
80	Olive
81	Palm
82	Teacher
83	Thumb
84	Octopus
85	Hood
86	Tie
87	Doctor
88	Wake
89	Cricket
90	Millionaire
91	Slip
92	Limousine
93	Pass
94	Theater
95	Plate
96	Satellite
97	Ketchup
98	Hotel
99	Tail
100	Tick
101	Ground
102	Police
103	Dwarf
104	Fan
105	Dress
106	Saturn
107	Grass
108	Brush
109	Chair
110	Rock
111	Pilot
112	Telescope
113	File
114	Lab
115	India
116	Ruler
117	Nail
118	Swing
119	Olympus
120	Change
121	Tablet
122	Australia
123	Green
124	Egypt
125	Line
126	Lawyer
127	Witch
128	Parachute
129	Crash
130	Gold
131	Note
132	Lion
133	Plastic
134	Web
135	Ambulance
136	Hospital
137	Spell
138	Lock
139	Water
140	London
141	Casino
142	Cycle
143	Bar
144	Cliff
145	Round
146	Bomb
147	Giant
148	Hand
149	Ninja
150	Rose
151	Drill
152	Glove
153	Paste
154	Fall
155	Fire
156	Spider
157	Spine
158	Soldier
159	Horn
160	Queen
161	Ham
162	Litter
163	Life
164	Temple
165	Rabbit
166	Button
167	Game
168	Star
169	Jupiter
170	Vet
171	Night
172	Air
173	Battery
174	Genius
175	Shop
176	Bottle
177	Stadium
178	Alien
179	Light
180	Triangle
181	Date
182	Stream
183	Missile
184	Scale
185	Band
186	Angel
187	Press
188	Berry
189	Card
190	Check
191	Draft
192	Head
193	Lap
194	Orange
195	Ice Cream
196	Film
197	Washer
198	Pool
199	Shark
200	Van
201	String
202	Calf
203	Hawk
204	Eagle
205	Needle
206	Forest
207	Dragon
208	Key
209	Belt
210	Cap
211	Bell
212	Leprechaun
213	Pheonix
214	Force
215	Boom
216	Fork
217	Alps
218	Post
219	Fence
220	Kangaroo
221	Mouse
222	Mug
223	Horseshoe
224	Scorpion
225	Agent
226	Helicopter
227	Hole
228	Organ
229	Jack
230	Charge
231	Lemon
232	Nurse
233	Drop
234	Track
235	Bank
236	Germany
237	Worm
238	Ray
239	Capital
240	Strike
241	War
242	Concert
243	Honey
244	Canada
245	Buck
246	Snowman
247	Beat
248	Jam
249	Copper
250	Beach
251	Spring
252	Match
253	Diamond
254	Centaur
255	March
256	Roulette
257	Dog
258	Cross
259	Wave
260	Duck
261	Wind
262	Spot
263	Skyscraper
264	Paper
265	Apple
266	Oil
267	Cook
268	Fly
269	Cast
270	Bear
271	Pin
272	Thief
273	Trunk
274	America
275	Novel
276	Cell
277	Bow
278	Model
279	Knife
280	Knight
281	New York
282	State
283	Bermuda
284	Park
285	Turkey
286	Chocolate
287	Trip
288	Racket
289	Bat
290	Jet
291	Shakespeare
292	Bolt
293	Switch
294	Wall
295	Soul
296	Ghost
297	Time
298	Dance
299	Amazon
300	Grace
301	Moscow
302	Pumpkin
303	Antarctica
304	Whip
305	Heart
306	Table
307	Ball
308	Fighter
309	Cold
310	Day
311	Court
312	Iron
313	Whale
314	Shadow
315	Contract
316	Mercury
317	Conductor
318	Seal
319	Car
320	Ring
321	Kid
322	Piano
323	Laser
324	Sound
325	Pole
326	Superhero
327	Revolution
328	Pit
329	Gas
330	Glass
331	Washington
332	Bark
333	Snow
334	Ivory
335	Pipe
336	Cover
337	Degree
338	Tokyo
339	Church
340	Pie
341	Point
342	France
343	Mammoth
344	Cotton
345	Robin
346	Net
347	Bugle
348	Maple
349	England
350	Field
351	Robot
352	Plot
353	Africa
354	Tag
355	Mouth
356	Kiwi
357	Mole
358	School
359	Sink
360	Pistol
361	Opera
362	Mint
363	Root
364	Sub
365	Crown
366	Back
367	Plane
368	Mexico
369	Cloak
370	Circle
371	Tube
372	Block
373	Comic
374	Fish
375	Bridge
376	Moon
377	Part
378	Aztec
379	Smuggler
380	Train
381	Embassy
382	Pupil
383	Scuba Diver
384	Ice
385	Tap
386	Code
387	Shoe
388	Server
389	Club
390	Row
391	Pyramid
392	Bug
393	Penguin
394	Pound
395	Himalayas
396	Czech
397	Rome
398	Eye
399	Board
400	Bed
\.


--
-- Name: game_words_game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.game_words_game_id_seq', 1, false);


--
-- Name: game_words_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.game_words_id_seq', 1, false);


--
-- Name: game_words_word_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.game_words_word_id_seq', 1, false);


--
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.games_id_seq', 1, false);


--
-- Name: moves_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.moves_id_seq', 1, false);


--
-- Name: players_game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.players_game_id_seq', 1, false);


--
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.players_id_seq', 1, false);


--
-- Name: words_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.words_id_seq', 400, true);


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
-- PostgreSQL database dump complete
--

