#!/usr/bin/env bash

# Starts victoriametrics and prometheus on local to serve data.

set -x -e
cd "$(dirname "$0")"

mkdir -p victoriametrics-data
mkdir -p prometheus-data

USE_UID="$(id -u):$(id -g)" docker-compose up
