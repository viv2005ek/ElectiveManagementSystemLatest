#!/bin/sh

# Run database migrations
npx prisma migrate deploy

# Start the application
npm start
