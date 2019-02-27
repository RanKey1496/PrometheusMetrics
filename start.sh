#!/bin/bash
npm run build
export NODE_ENV=production
node dist/server.js