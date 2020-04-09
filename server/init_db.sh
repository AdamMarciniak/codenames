#! /bin/bash

dropdb betacodenames; psql -d postgres -f codenames-dump.sql
