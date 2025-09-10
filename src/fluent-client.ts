/**
 * FluentAPI Client for MCP Server
 * Handles communication with FluentAPI borderless endpoints
 */

import fetch from 'node-fetch';

export interface TranslationRequest {
  conversationId: string;
  senderId?: string;
  senderLang?: string;
  recipientId?: string;
  recipientLang: string;
  message: string;
  platformType?: string;
}

export interface TranslationResponse {
  success: boolean;
  conversationId: string;
  messageId: string;
  original: {
    text: string;
    language: string;
    senderId?: string;
    senderLang?: string;
  };
  translated: {
    text: string;
    language: string;
    recipientId?: string;
  };
  displayOptions: {
    showOriginal: boolean;
    showTranslated: boolean;
    format: string;
  };
  integrations: {
    facebook: any;
    whatsapp: any;
    slack: any;
  };
}

export interface ConversationHistory {
  conversationId: string;
  participants: Record<string, {
    language: string;
    lastActive: string;
  }>;
  messages: Array<{
    id: string;
    senderId?: string;
    recipientId?: string;
    original: {
      text: string;
      language: string;
    };
    translated: {
      text: string;
      language: string;
    };
    timestamp: string;
    platformType?: string;
    displayText?: string;
    displayLanguage?: string;
  }>;
  messageCount: number;
}

export interface APIError {
  error: string;
  message?: string;
  usage?: number;
  limit?: number;
  upgradeUrl?: string;
}

export class FluentAPIClient {
  private baseURL: string;
  private apiKey: string;

  constructor(apiKey: string, baseURL = 'https://www.fluentapi.io') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  /**
   * Translate a message in the context of a conversation
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/borderless`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json() as APIError;
        throw new Error(`FluentAPI Error: ${error.error} - ${error.message || 'Unknown error'}`);
      }

      return await response.json() as TranslationResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Network error: ${String(error)}`);
    }
  }

  /**
   * Get conversation history
   */
  async getConversation(
    conversationId: string,
    participantId?: string,
    language?: string
  ): Promise<ConversationHistory> {
    try {
      const params = new URLSearchParams({ conversationId });
      if (participantId) params.append('participantId', participantId);
      if (language) params.append('language', language);

      const response = await fetch(`${this.baseURL}/api/borderless?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json() as APIError;
        throw new Error(`FluentAPI Error: ${error.error} - ${error.message || 'Unknown error'}`);
      }

      return await response.json() as ConversationHistory;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Network error: ${String(error)}`);
    }
  }

  /**
   * Get supported languages (static list for now)
   */
  getSupportedLanguages(): Record<string, string> {
    return {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese (Simplified)',
      'zh-TW': 'Chinese (Traditional)',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'th': 'Thai',
      'vi': 'Vietnamese',
      'tr': 'Turkish',
      'pl': 'Polish',
      'nl': 'Dutch',
      'sv': 'Swedish',
      'da': 'Danish',
      'no': 'Norwegian',
      'fi': 'Finnish',
      'cs': 'Czech',
      'hu': 'Hungarian',
      'ro': 'Romanian',
      'bg': 'Bulgarian',
      'hr': 'Croatian',
      'sk': 'Slovak',
      'sl': 'Slovenian',
      'et': 'Estonian',
      'lv': 'Latvian',
      'lt': 'Lithuanian',
      'mt': 'Maltese',
      'ga': 'Irish',
      'cy': 'Welsh',
      'eu': 'Basque',
      'ca': 'Catalan',
      'gl': 'Galician',
      'is': 'Icelandic',
      'mk': 'Macedonian',
      'sq': 'Albanian',
      'be': 'Belarusian',
      'uk': 'Ukrainian',
      'mn': 'Mongolian',
      'ka': 'Georgian',
      'hy': 'Armenian',
      'az': 'Azerbaijani',
      'kk': 'Kazakh',
      'ky': 'Kyrgyz',
      'tg': 'Tajik',
      'uz': 'Uzbek',
      'tk': 'Turkmen',
      'fa': 'Persian',
      'ur': 'Urdu',
      'bn': 'Bengali',
      'ta': 'Tamil',
      'te': 'Telugu',
      'ml': 'Malayalam',
      'kn': 'Kannada',
      'gu': 'Gujarati',
      'pa': 'Punjabi',
      'mr': 'Marathi',
      'ne': 'Nepali',
      'si': 'Sinhala',
      'my': 'Myanmar',
      'km': 'Khmer',
      'lo': 'Lao',
      'id': 'Indonesian',
      'ms': 'Malay',
      'tl': 'Filipino',
      'haw': 'Hawaiian',
      'mi': 'Maori',
      'sm': 'Samoan',
      'to': 'Tongan',
      'fj': 'Fijian',
      'auto': 'Auto-detect'
    };
  }
}