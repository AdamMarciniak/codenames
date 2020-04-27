#! /bin/bash

psql codenames;
DELETE FROM words;
ALTER TABLE words DROP CONSTRAINT words_text_key;
ALTER TABLE words ADD COLUMN word_set VARCHAR(40);
ALTER TABLE words ADD CONSTRAINT words_text_key UNIQUE (text, word_set);
