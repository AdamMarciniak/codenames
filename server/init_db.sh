#! /bin/bash

dropdb codenames && psql -d postgres -f codenames-dump.sql
