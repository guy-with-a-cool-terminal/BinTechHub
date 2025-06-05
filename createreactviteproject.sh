#!/bin/bash

if [ -z "$1" ]; then
  echo "PLEASE PROVIDE A PROJECT NAME"
  exit 1
fi

PROJECT_NAME=$1

echo "CREATING React + Vite project: $PROJECT_NAME"

npm create vite@latest "$PROJECT_NAME" -- --template react

cd "$PROJECT_NAME" || exit

echo "INSTALLING DEPENDENCIES..."
npm install

echo "STARTING DEV SERVER..."
npm run dev
