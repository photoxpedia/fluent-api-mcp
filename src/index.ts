#!/usr/bin/env node

/**
 * FluentAPI MCP Server
 * Enables AI assistants to facilitate seamless multilingual conversations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { FluentAPIClient } from './fluent-client.js';

// Environment configuration
const FLUENT_API_KEY = process.env.FLUENT_API_KEY;
const FLUENT_API_BASE_URL = process.env.FLUENT_API_BASE_URL || 'https://www.fluentapi.io';

if (!FLUENT_API_KEY) {
  console.error('Error: FLUENT_API_KEY environment variable is required');
  console.error(`Get your API key from: ${FLUENT_API_BASE_URL}/pricing.html`);
  process.exit(1);
}

// Initialize FluentAPI client
const fluentClient = new FluentAPIClient(FLUENT_API_KEY, FLUENT_API_BASE_URL);

// Schema definitions for tool parameters
const TranslateMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  target_language: z.string().min(1, 'Target language is required'),
  source_language: z.string().optional().default('auto'),
  conversation_id: z.string().optional(),
  sender_id: z.string().optional(),
  recipient_id: z.string().optional(),
  platform: z.string().optional().default('mcp'),
});

const GetConversationSchema = z.object({
  conversation_id: z.string().min(1, 'Conversation ID is required'),
  participant_id: z.string().optional(),
  language: z.string().optional(),
});

const CreateConversationSchema = z.object({
  conversation_id: z.string().min(1, 'Conversation ID is required'),
  participants: z.array(z.object({
    id: z.string(),
    language: z.string(),
  })).optional(),
});

// Create MCP server
const server = new Server(
  {
    name: 'fluent-api-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'translate_message',
        description: 'Translate a message between languages with conversation context. Perfect for facilitating multilingual conversations.',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'The message text to translate',
            },
            target_language: {
              type: 'string',
              description: 'Target language code (e.g., "es" for Spanish, "fr" for French, "zh" for Chinese)',
            },
            source_language: {
              type: 'string',
              description: 'Source language code (optional, defaults to "auto" for auto-detection)',
              default: 'auto',
            },
            conversation_id: {
              type: 'string',
              description: 'Unique conversation identifier for context (optional, will generate if not provided)',
            },
            sender_id: {
              type: 'string',
              description: 'ID of the message sender (optional)',
            },
            recipient_id: {
              type: 'string',
              description: 'ID of the message recipient (optional)',
            },
            platform: {
              type: 'string',
              description: 'Platform type (facebook, whatsapp, slack, discord, mcp)',
              default: 'mcp',
            },
          },
          required: ['message', 'target_language'],
        },
      },
      {
        name: 'get_conversation',
        description: 'Retrieve conversation history with messages translated to a specific participant\'s language.',
        inputSchema: {
          type: 'object',
          properties: {
            conversation_id: {
              type: 'string',
              description: 'The conversation ID to retrieve',
            },
            participant_id: {
              type: 'string',
              description: 'Filter for specific participant (optional)',
            },
            language: {
              type: 'string',
              description: 'Language to translate messages to (optional)',
            },
          },
          required: ['conversation_id'],
        },
      },
      {
        name: 'get_supported_languages',
        description: 'Get list of all supported languages with their codes and names.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'create_conversation',
        description: 'Create a new conversation context for multilingual communication.',
        inputSchema: {
          type: 'object',
          properties: {
            conversation_id: {
              type: 'string',
              description: 'Unique identifier for the conversation',
            },
            participants: {
              type: 'array',
              description: 'List of participants with their preferred languages',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'Participant ID' },
                  language: { type: 'string', description: 'Participant\'s preferred language code' },
                },
                required: ['id', 'language'],
              },
            },
          },
          required: ['conversation_id'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'translate_message': {
        const params = TranslateMessageSchema.parse(args);
        
        // Generate conversation ID if not provided
        const conversationId = params.conversation_id || `mcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const result = await fluentClient.translate({
          conversationId,
          senderId: params.sender_id,
          senderLang: params.source_language,
          recipientId: params.recipient_id,
          recipientLang: params.target_language,
          message: params.message,
          platformType: params.platform,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                conversation_id: result.conversationId,
                message_id: result.messageId,
                original: {
                  text: result.original.text,
                  language: result.original.language,
                  language_name: fluentClient.getSupportedLanguages()[result.original.language] || result.original.language,
                },
                translated: {
                  text: result.translated.text,
                  language: result.translated.language,
                  language_name: fluentClient.getSupportedLanguages()[result.translated.language] || result.translated.language,
                },
                display_format: result.displayOptions.format,
                platform_integrations: result.integrations,
              }, null, 2),
            },
          ],
        };
      }

      case 'get_conversation': {
        const params = GetConversationSchema.parse(args);
        
        const conversation = await fluentClient.getConversation(
          params.conversation_id,
          params.participant_id,
          params.language
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                conversation_id: conversation.conversationId,
                participants: conversation.participants,
                message_count: conversation.messageCount,
                messages: conversation.messages.map(msg => ({
                  id: msg.id,
                  sender_id: msg.senderId,
                  recipient_id: msg.recipientId,
                  original: {
                    text: msg.original.text,
                    language: msg.original.language,
                    language_name: fluentClient.getSupportedLanguages()[msg.original.language] || msg.original.language,
                  },
                  translated: {
                    text: msg.translated.text,
                    language: msg.translated.language,
                    language_name: fluentClient.getSupportedLanguages()[msg.translated.language] || msg.translated.language,
                  },
                  display_text: msg.displayText,
                  display_language: msg.displayLanguage,
                  timestamp: msg.timestamp,
                  platform: msg.platformType,
                })),
              }, null, 2),
            },
          ],
        };
      }

      case 'get_supported_languages': {
        const languages = fluentClient.getSupportedLanguages();
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                supported_languages: languages,
                language_count: Object.keys(languages).length,
                popular_languages: {
                  'en': languages['en'],
                  'es': languages['es'],
                  'fr': languages['fr'],
                  'de': languages['de'],
                  'zh': languages['zh'],
                  'ja': languages['ja'],
                  'ko': languages['ko'],
                  'ar': languages['ar'],
                  'hi': languages['hi'],
                  'pt': languages['pt'],
                  'ru': languages['ru'],
                },
              }, null, 2),
            },
          ],
        };
      }

      case 'create_conversation': {
        const params = CreateConversationSchema.parse(args);
        
        // For conversation creation, we just return the structure
        // The actual conversation will be created on first message
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                conversation_id: params.conversation_id,
                participants: params.participants || [],
                status: 'ready',
                message: 'Conversation context created. Send your first message using translate_message.',
                next_steps: [
                  'Use translate_message to send messages in this conversation',
                  'Each participant can communicate in their native language',
                  'The API will handle all translations automatically',
                ],
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
      );
    }
    
    if (error instanceof Error) {
      throw new McpError(
        ErrorCode.InternalError,
        `FluentAPI error: ${error.message}`
      );
    }
    
    throw new McpError(
      ErrorCode.InternalError,
      `Unknown error: ${String(error)}`
    );
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log startup message to stderr so it doesn't interfere with MCP protocol
  console.error('FluentAPI MCP Server started successfully');
  console.error(`API Key: ${FLUENT_API_KEY?.slice(0, 20)}...`);
  console.error(`Base URL: ${FLUENT_API_BASE_URL}`);
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error('Shutting down FluentAPI MCP Server...');
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('Shutting down FluentAPI MCP Server...');
  await server.close();
  process.exit(0);
});

main().catch((error) => {
  console.error('Fatal error starting FluentAPI MCP Server:', error);
  process.exit(1);
});