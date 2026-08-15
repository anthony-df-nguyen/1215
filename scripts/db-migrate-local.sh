#!/bin/sh
# Applies drizzle/*.sql directly to the local Postgres container.
# `drizzle-kit migrate` can't be used here: it connects via the Neon
# serverless driver over websocket, which our local-neon-http-proxy
# (HTTP only) doesn't support.
set -e

for f in drizzle/*.sql; do
  echo "=== $f ==="
  docker compose exec -T postgres psql -U postgres -d main -v ON_ERROR_STOP=1 < "$f"
done
