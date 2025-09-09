# 🚀 FluentAPI MCP Server Installation Guide

## Quick Installation

### Option 1: Global NPM Installation (Recommended)

```bash
# Install globally
npm install -g @fluentapi/mcp-server

# Set up your API key
export FLUENT_API_KEY=your_fluent_api_key_here

# Run the MCP server
fluent-api-mcp
```

### Option 2: Local Project Installation

```bash
# Install in your project
npm install @fluentapi/mcp-server

# Create configuration file
echo "FLUENT_API_KEY=your_api_key_here" > .env

# Run with npx
npx fluent-api-mcp
```

### Option 3: Clone from GitHub

```bash
# Clone the repository
git clone https://github.com/fluentapi/fluent-api-mcp.git
cd fluent-api-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Configure environment
cp .env.example .env
# Edit .env with your API key

# Run the server
npm start
```

## 🔑 Getting Your FluentAPI Key

1. Visit your FluentAPI deployment at: `https://your-deployment.vercel.app/pricing.html`
2. Choose a plan and sign up
3. Copy your API key (starts with `fluent_live_sk_`)
4. Set it as an environment variable

## 🖥️ Claude Desktop Integration

Add to your Claude Desktop MCP configuration file:

### macOS/Linux: `~/Library/Application Support/Claude/claude_desktop_config.json`
### Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "fluent-api": {
      "command": "fluent-api-mcp",
      "env": {
        "FLUENT_API_KEY": "your_fluent_api_key_here"
      }
    }
  }
}
```

Or with custom installation path:

```json
{
  "mcpServers": {
    "fluent-api": {
      "command": "node",
      "args": ["/path/to/fluent-api-mcp/dist/index.js"],
      "env": {
        "FLUENT_API_KEY": "your_fluent_api_key_here",
        "FLUENT_API_BASE_URL": "https://your-deployment.vercel.app"
      }
    }
  }
}
```

## 🧪 Testing Your Installation

```bash
# Test basic functionality
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | fluent-api-mcp

# Expected output: JSON response with 4 tools listed
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `FLUENT_API_KEY` | Yes | - | Your FluentAPI key |
| `FLUENT_API_BASE_URL` | No | `https://fluent-api-rose.vercel.app` | FluentAPI server URL |

### Configuration File

Create `.env` file:
```bash
FLUENT_API_KEY=fluent_live_sk_your_key_here
FLUENT_API_BASE_URL=https://your-deployment.vercel.app
```

## 🐛 Troubleshooting

### Common Issues

**❌ "FLUENT_API_KEY environment variable is required"**
- Solution: Set your API key environment variable
```bash
export FLUENT_API_KEY=your_key_here
```

**❌ "command not found: fluent-api-mcp"**
- Solution: Install globally or use full path
```bash
npm install -g @fluentapi/mcp-server
# Or use: npx @fluentapi/mcp-server
```

**❌ "API key not found" or "Invalid API key"**
- Solution: Verify your API key is correct and active
- Get a new key from your FluentAPI pricing page

**❌ "Network error" or "Connection refused"**
- Solution: Check your `FLUENT_API_BASE_URL` setting
- Ensure your FluentAPI server is running

### Debug Mode

Run with debug output:
```bash
DEBUG=1 fluent-api-mcp
```

## 💡 Usage Examples

### Basic Translation
```bash
# Using the MCP server in Claude Desktop
# Just ask Claude: "Translate 'Hello world' to Spanish"
# Claude will use the MCP server automatically!
```

### Conversation Management
```bash
# Ask Claude: "Start a conversation between an English speaker and a Spanish speaker"
# The MCP server will create conversation context automatically
```

## 🔄 Updating

### Global Installation
```bash
npm update -g @fluentapi/mcp-server
```

### Local Installation
```bash
npm update @fluentapi/mcp-server
```

### From GitHub
```bash
git pull origin main
npm install
npm run build
```

## 🆘 Support

- **Documentation**: [GitHub Repository](https://github.com/fluentapi/fluent-api-mcp)
- **Issues**: [GitHub Issues](https://github.com/fluentapi/fluent-api-mcp/issues)
- **FluentAPI Support**: Visit your FluentAPI deployment for API-related issues

---

🌍 **Ready to break language barriers with AI assistance!**