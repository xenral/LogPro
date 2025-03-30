#!/bin/bash

# Make script exit on first error
set -e

# Ensure TypeScript is installed
if ! command -v npx &> /dev/null; then
  echo "Error: npx is not installed. Please install Node.js and npm."
  exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the package
echo "Building package..."
npm run build

# Function to run an example with a title
run_example() {
  echo ""
  echo "========================================================"
  echo "  Running example: $1"
  echo "========================================================"
  echo ""
  
  # Use ts-node to run the TypeScript example directly
  npx ts-node "examples/$1.ts"
}

# Check if specific example was requested
if [ $# -eq 1 ]; then
  run_example "$1"
  exit 0
fi

# Otherwise run all examples
echo "Running all examples..."

# Basic usage example
run_example "basic-usage"

# Production configuration example
NODE_ENV=production run_example "production-config"

# Express integration example (only if express is installed)
if npm list express &> /dev/null; then
  run_example "express-integration"
else
  echo ""
  echo "Skipping express-integration example (express not installed)"
  echo "Run 'npm install express @types/express' to enable this example"
fi

echo ""
echo "All examples completed successfully!" 