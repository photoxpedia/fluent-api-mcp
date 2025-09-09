#!/bin/bash

# FluentAPI MCP Server Deployment Script

set -e

echo "🚀 Deploying FluentAPI MCP Server..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the fluent-api-mcp directory."
    exit 1
fi

# Check if required environment variables are set
if [ -z "$FLUENT_API_KEY" ]; then
    echo "⚠️  Warning: FLUENT_API_KEY not set. Make sure to configure it before running the MCP server."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building TypeScript..."
npm run build

# Verify build output
if [ ! -f "dist/index.js" ]; then
    echo "❌ Build failed: dist/index.js not found"
    exit 1
fi

echo "✅ Build successful!"

# Make the binary executable
chmod +x dist/index.js

# Create global symlink (optional)
if command -v npm &> /dev/null; then
    echo "🔗 Creating global npm link..."
    npm link
    echo "✅ You can now run 'fluent-api-mcp' from anywhere"
fi

echo ""
echo "🎉 FluentAPI MCP Server deployed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set your FLUENT_API_KEY environment variable"
echo "2. Add the MCP server to your Claude Desktop configuration"
echo "3. Or run directly with: npm start"
echo ""
echo "📖 See README.md for full setup instructions"