interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class AIClient {
  private endpoint = 'https://oi-server.onrender.com/chat/completions';
  private headers = {
    'customerId': 'clay27153@gmail.com',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  };

  async chatCompletion(
    messages: ChatMessage[],
    model: string = 'openrouter/claude-sonnet-4'
  ): Promise<string> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from AI model');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Client Error:', error);
      throw new Error('Failed to get AI response');
    }
  }
}

export const aiClient = new AIClient();