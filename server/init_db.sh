#! /bin/bash

dropdb codenames-beta; psql -d postgres -f codenames-dump.sql
