# FluentAPI MCP Server

A Model Context Protocol (MCP) server that enables AI assistants to facilitate seamless multilingual conversations using FluentAPI's translation services.

## 🌍 What This Does

This MCP server allows AI assistants to:
- Translate messages between any supported languages
- Maintain conversation context for better translations
- Create multilingual chat sessions
- Access 70+ languages with auto-detection
- Format translations for different platforms (Facebook, WhatsApp, Slack, etc.)

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+** installed
2. **FluentAPI Key** - Get yours at your FluentAPI deployment URL + `/pricing.html`

### Installation

```bash
# Clone or navigate to the MCP directory
cd fluent-api-mcp

# Install dependencies
npm install

# Build the server
npm run build

# Copy environment file and configure
cp .env.example .env
# Edit .env and add your FLUENT_API_KEY
```

### Configuration

Create a `.env` file:

```bash
# Required: Your FluentAPI key
FLUENT_API_KEY=fluent_live_sk_your_api_key_here

# Optional: FluentAPI base URL (defaults to https://www.fluentapi.io)
FLUENT_API_BASE_URL=https://www.fluentapi.io
```

### Usage with Claude Desktop

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "fluent-api": {
      "command": "node",
      "args": ["/path/to/fluent-api-mcp/dist/index.js"],
      "env": {
        "FLUENT_API_KEY": "your_api_key_here",
        "FLUENT_API_BASE_URL": "https://www.fluentapi.io"
      }
    }
  }
}
```

### Usage with Other MCP Clients

```bash
# Run the MCP server
npm start

# Or for development with auto-reload
npm run dev
```

## 🛠️ Available Tools

### `translate_message`
Translate text between languages with conversation context.

**Parameters:**
- `message` (required): The text to translate
- `target_language` (required): Target language code (e.g., "es", "fr", "zh")
- `source_language` (optional): Source language code (defaults to "auto")
- `conversation_id` (optional): Unique conversation identifier
- `sender_id` (optional): Message sender ID
- `recipient_id` (optional): Message recipient ID
- `platform` (optional): Platform type (facebook, whatsapp, slack, discord, mcp)

**Example:**
```json
{
  "message": "Hello, how are you?",
  "target_language": "es",
  "source_language": "en",
  "conversation_id": "chat_123"
}
```

**Response:**
```json
{
  "success": true,
  "conversation_id": "chat_123",
  "message_id": "msg_456",
  "original": {
    "text": "Hello, how are you?",
    "language": "en",
    "language_name": "English"
  },
  "translated": {
    "text": "Hola, ¿cómo estás?",
    "language": "es",
    "language_name": "Spanish"
  },
  "display_format": "Hola, ¿cómo estás?\n[Hello, how are you?]",
  "platform_integrations": {
    "facebook": {...},
    "whatsapp": {...},
    "slack": {...}
  }
}
```

### `get_conversation`
Retrieve conversation history with translations.

**Parameters:**
- `conversation_id` (required): The conversation ID to retrieve
- `participant_id` (optional): Filter for specific participant
- `language` (optional): Language to translate messages to

### `get_supported_languages`
Get list of all supported languages.

**Response:**
```json
{
  "supported_languages": {
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "zh": "Chinese (Simplified)",
    ...
  },
  "language_count": 70,
  "popular_languages": {...}
}
```

### `create_conversation`
Create a new multilingual conversation context.

**Parameters:**
- `conversation_id` (required): Unique identifier for the conversation
- `participants` (optional): Array of participants with their preferred languages

## 🌟 Real-World Use Cases

### Customer Support
```javascript
// Customer writes in Spanish
await translate_message({
  message: "Mi producto no funciona correctamente",
  target_language: "en",
  conversation_id: "support_ticket_123",
  sender_id: "customer_456",
  recipient_id: "support_agent"
});
// Result: "My product is not working correctly"
```

### International Business
```javascript
// CEO writes in English, translates to Japanese for partners
await translate_message({
  message: "The quarterly results exceed our expectations",
  target_language: "ja",
  conversation_id: "board_meeting_q4",
  platform: "slack"
});
// Result: "四半期の結果は私たちの期待を上回っています"
```

### Gaming Communities
```javascript
// Korean player communicating with English-speaking team
await translate_message({
  message: "우리 팀이 이겼다!",
  target_language: "en",
  source_language: "ko",
  conversation_id: "game_lobby_789"
});
// Result: "Our team won!"
```

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```

### Building
```bash
npm run build
```

### Project Structure
```
fluent-api-mcp/
├── src/
│   ├── index.ts          # Main MCP server
│   └── fluent-client.ts  # FluentAPI client wrapper
├── dist/                 # Built JavaScript files
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 📝 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `FLUENT_API_KEY` | Yes | - | Your FluentAPI key from the pricing page |
| `FLUENT_API_BASE_URL` | No | `https://www.fluentapi.io` | FluentAPI server URL |

## 🔒 Security

- API keys are passed via environment variables
- All translation processing happens on FluentAPI servers
- No message content is stored locally
- Conversation context is managed server-side

## 📈 Usage Limits

Usage limits depend on your FluentAPI subscription:
- **Free Trial**: 1,000 translations/month
- **Starter**: 10,000 translations/month  
- **Professional**: 100,000 translations/month
- **Enterprise**: 1,000,000 translations/month

## 🌏 Supported Languages

The MCP server supports 70+ languages including:
- **Popular**: English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Hindi, Portuguese, Russian
- **European**: Italian, Dutch, Swedish, Norwegian, Polish, Czech, Hungarian, and more
- **Asian**: Thai, Vietnamese, Indonesian, Malaysian, Filipino, and more
- **Others**: Mongolian, Georgian, Armenian, and many regional languages

Use `get_supported_languages` to see the complete list.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: This README and inline code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **FluentAPI Support**: Visit your FluentAPI deployment for API-related issues

---

**Made with ❤️ for the MCP ecosystem and multilingual communication**