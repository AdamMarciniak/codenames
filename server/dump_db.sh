#!/bin/bash

pg_dump -C -s -O -d codenames > codenames-dump.sql
