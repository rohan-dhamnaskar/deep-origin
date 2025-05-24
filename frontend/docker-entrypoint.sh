#!/bin/sh
set -e

echo "Installing dependencies..."
npm install

echo "Starting development server with hot-reload..."
exec npm run dev