#!/bin/bash

# Hospital Management System - Setup & Run Script
# This script navigates to the correct directory and runs the React application

echo "🏥 Hospital Management System - Starting..."
echo ""

# Navigate to the project directory
cd /Users/shreyavarade/Desktop/cpp\ project\ copy/hoga-ekdin-be-positive-

echo "📁 Current directory: $(pwd)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
else
    echo "✓ Dependencies already installed"
    echo ""
fi

echo "🚀 Starting the application..."
echo "   The app will open at http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the React development server
npm start

