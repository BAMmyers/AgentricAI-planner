// =============================================================================
// LLM Service - AgentricAI-IED-ollama Backend Driver
// https://github.com/BAMmyers/AgentricAI-IED-ollama.git
// Production — all inference routed through local Ollama instance
// =============================================================================

import type { LLMResponse, LLMServiceConfig } from '../types';

const DEFAULT_CONFIG: LLMServiceConfig = {
  baseUrl: 'http://localhost:11434',
  model: 'AgentricAIcody:latest',
  timeout: 30000
};

class LLMService {
  private config: LLMServiceConfig;

  constructor(config: Partial<LLMServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async generateText(prompt: string): Promise<LLMResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          prompt: prompt,
          stream: false
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          text: '',
          error: `Backend returned status ${response.status}. Ensure AgentricAI-IED-ollama is running.`
        };
      }

      const data = await response.json();

      return {
        text: data.response || '',
        model: this.config.model,
        tokensUsed: data.eval_count
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        text: '',
        error: `Backend unavailable: ${message}. Start AgentricAI-IED-ollama at ${this.config.baseUrl}`
      };
    }
  }

  async generateChat(messages: { role: string; content: string }[]): Promise<LLMResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: messages,
          stream: false
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          text: '',
          error: `Backend returned status ${response.status}`
        };
      }

      const data = await response.json();

      return {
        text: data.message?.content || '',
        model: this.config.model,
        tokensUsed: data.eval_count
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        text: '',
        error: `Backend unavailable: ${message}`
      };
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.config.baseUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  async getModels(): Promise<string[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.config.baseUrl}/api/tags`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) return [];
      const data = await response.json();
      return data.models?.map((m: { name: string }) => m.name) || [];
    } catch {
      return [];
    }
  }

  getEndpoint(): string {
    return this.config.baseUrl;
  }

  getModel(): string {
    return this.config.model;
  }

  setModel(model: string): void {
    this.config.model = model;
  }
}

export const llmService = new LLMService();
export default LLMService;
