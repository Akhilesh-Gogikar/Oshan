#!/bin/bash

# This script automates the process of starting both the oshan-server and the oshan-app.

echo "Starting oshan-server..."

# Navigate to the oshan-server directory
# Navigate to the oshan-server directory
cd oshan-server || exit

# Install server dependencies
echo "Installing server dependencies (if not already installed)..."
npm install --legacy-peer-deps

# Start the oshan-server in the background
echo "Starting oshan-server in the background..."
nohup npm run dev &

# Inform the user about the server status
echo "Oshan server is running in the background. You can check its output by looking at nohup.out file inside oshan-server directory"

# Add a brief pause to give the server a moment to start up
echo "Giving the server 5 seconds to start..."
sleep 5

# Navigate back to the root directory before going to oshan-app
echo "Navigating to oshan-app directory..."
cd ../oshan-app || exit

# Install app dependencies
echo "Installing app dependencies (if not already installed)..."
npm install --legacy-peer-deps

# Start the oshan-app
echo "Starting oshan-app. This will take over the terminal."
npm run web