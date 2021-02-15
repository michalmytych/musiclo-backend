#!/bin/bash

git fetch
git status
git pull origin main
npm run build
