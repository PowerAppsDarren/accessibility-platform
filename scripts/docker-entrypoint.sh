#!/bin/sh
set -e

echo "==> Waiting for database to be ready..."
# Simple wait loop - the compose healthcheck handles the real wait,
# but this catches edge cases during container restart
sleep 3

echo "==> Starting application..."
exec "$@"
