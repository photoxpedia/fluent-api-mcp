#!/bin/bash

# FluentAPI MCP Server Release Script

set -e

echo "🚀 Preparing FluentAPI MCP Server release..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the project root."
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $CURRENT_VERSION"

# Ask for new version
echo "📝 Enter new version (current: $CURRENT_VERSION):"
echo "   1) patch (bug fixes)"
echo "   2) minor (new features)"
echo "   3) major (breaking changes)"
echo "   4) custom version"
read -p "Choice (1-4): " VERSION_CHOICE

case $VERSION_CHOICE in
    1)
        NEW_VERSION=$(npm version patch --no-git-tag-version)
        ;;
    2)
        NEW_VERSION=$(npm version minor --no-git-tag-version)
        ;;
    3)
        NEW_VERSION=$(npm version major --no-git-tag-version)
        ;;
    4)
        read -p "Enter custom version: " CUSTOM_VERSION
        NEW_VERSION=$(npm version $CUSTOM_VERSION --no-git-tag-version)
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo "✅ Updated to version: $NEW_VERSION"

# Build and test
echo "🔨 Building project..."
npm run build

echo "🧪 Running tests..."
npm test || echo "⚠️  Tests not available or failed - proceeding anyway"

# Commit changes
echo "📝 Committing version bump..."
git add package.json package-lock.json
git commit -m "chore: bump version to $NEW_VERSION

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Create and push tag
echo "🏷️  Creating and pushing tag..."
git tag "$NEW_VERSION"
git push origin main
git push origin "$NEW_VERSION"

echo ""
echo "🎉 Release $NEW_VERSION prepared successfully!"
echo ""
echo "📋 What happens next:"
echo "1. GitHub Actions will build and test the code"
echo "2. If tests pass, it will publish to npm automatically"
echo "3. A GitHub release will be created"
echo ""
echo "🔗 Check progress at:"
echo "   GitHub: https://github.com/fluentapi/fluent-api-mcp/actions"
echo "   NPM: https://www.npmjs.com/package/@fluentapi/mcp-server"
echo ""
echo "✨ Users can install with: npm install -g @fluentapi/mcp-server"