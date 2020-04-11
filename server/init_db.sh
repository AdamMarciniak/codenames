#! /bin/bash

dropdb codenames; cat codenames-dump.sql insert-words.sql | psql -d postgres
