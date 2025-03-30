#!/bin/bash

# Initialize git repository
git init

# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit: LogMate structured logger"

# Instructions for the user
echo ""
echo "Git repository initialized with initial commit."
echo ""
echo "Next steps:"
echo "1. Create a GitHub repository"
echo "2. Add the remote: git remote add origin <repository-url>"
echo "3. Push to GitHub: git push -u origin main"
echo "" 