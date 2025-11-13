#!/bin/bash

# Notified Frontend Setup Script
# Automates initial project setup

echo "🚀 Notified Frontend Setup"
echo "============================"
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $NODE_VERSION detected"
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Are you in the correct directory?"
    exit 1
fi

# Install dependencies
echo "📥 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please edit .env and set your API URL"
else
    echo "ℹ️  .env file already exists"
fi
echo ""

# Setup Husky (Git hooks)
echo "🎣 Setting up Git hooks..."
npm run prepare 2>/dev/null || npx husky install
if [ $? -eq 0 ]; then
    echo "✅ Git hooks configured"
else
    echo "⚠️  Git hooks setup skipped (not a git repository?)"
fi
echo ""

# Run format check
echo "🎨 Running code formatter..."
npm run format
echo "✅ Code formatted"
echo ""

echo "============================"
echo "✨ Setup Complete!"
echo "============================"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your API URL"
echo "  2. Run: npm run dev"
echo "  3. Open: http://localhost:5173"
echo ""
echo "Happy coding! 🎉"
