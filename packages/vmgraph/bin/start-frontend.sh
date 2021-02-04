#!/usr/bin/env bash

# Builds project in production mode, and starts simple server to serve it.

set -x -e

cd "$(dirname "$0")/.."

npm run build

USE_UID="$(id -u):$(id -g)"
export USE_UID

# Use -d instead of -it for running in background.
docker run -it --rm --name vmgraph -v $PWD/build:/usr/share/nginx/html:ro -p 7000:80 nginx:stable

