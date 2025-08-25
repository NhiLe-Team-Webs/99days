// src/lib/gemini.ts
export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateMotivationalQuote(): Promise<string> {
    const prompt = `Tạo một câu quote truyền động lực tập thể dục bằng tiếng Việt, ngắn gọn (không quá 25 từ), tích cực và đầy năng lượng. Quote phải liên quan đến việc tập luyện, sức khỏe, hoặc vượt qua thử thách. Chỉ trả về câu quote, không giải thích thêm.`;

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 100,
        stopSequences: []
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch(`${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No candidates returned from Gemini API');
    }

    const quote = data.candidates[0].content.parts[0].text.trim();
    
    // Làm sạch quote (loại bỏ dấu ngoặc kép thừa)
    return quote.replace(/^["']|["']$/g, '');
  }
}

// Utility functions cho quote caching
export class QuoteCache {
  private static getToday(): string {
    return new Date().toDateString();
  }

  static get(key: string = 'default'): string | null {
    const today = this.getToday();
    const cacheKey = `quote_${key}_${today}`;
    return localStorage.getItem(cacheKey);
  }

  static set(quote: string, key: string = 'default'): void {
    const today = this.getToday();
    const cacheKey = `quote_${key}_${today}`;
    localStorage.setItem(cacheKey, quote);
    
    // Dọn dẹp cache cũ (chỉ giữ lại 7 ngày gần nhất)
    this.cleanup();
  }

  private static cleanup(): void {
    const keys = Object.keys(localStorage);
    const now = new Date().getTime();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

    keys.forEach(key => {
      if (key.startsWith('quote_')) {
        // Extract date từ key
        const parts = key.split('_');
        if (parts.length >= 3) {
          const dateStr = parts.slice(2).join('_');
          const cacheDate = new Date(dateStr).getTime();
          
          if (cacheDate < sevenDaysAgo) {
            localStorage.removeItem(key);
          }
        }
      }
    });
  }
}

// Fallback quotes khi API không khả dụng
export const FALLBACK_QUOTES = [
  "Thành công là tích lũy của những nỗ lực nhỏ mỗi ngày.",
  "Hãy tin vào hành trình của bạn – 99 ngày sẽ thay đổi cuộc đời bạn.",
  "Sức mạnh không đến từ những gì bạn có thể làm, mà từ những gì bạn đã vượt qua.",
  "Bạn không cần phải nhanh, chỉ cần không ngừng lại.",
  "Mỗi giọt mồ hôi hôm nay là một bước gần hơn đến chiến thắng ngày mai.",
  "Không có ngày nào quá nhỏ để tạo nên sự khác biệt.",
  "Bạn đang tiến gần hơn mỗi khi không bỏ cuộc.",
  "Ngày hôm nay là viên gạch đầu tiên cho tòa lâu đài của bạn.",
  "Chỉ cần một bước nhỏ mỗi ngày – bạn sẽ đi rất xa.",
  "Bạn không cần hoàn hảo, chỉ cần bắt đầu.",
  "Cơ thể đạt được những gì mà tâm trí tin tưởng.",
  "Hôm nay tốt hơn hôm qua, ngày mai tốt hơn hôm nay.",
  "Những giọt mồ hôi không bao giờ nói dối.",
  "Hãy tập luyện như thể bạn chưa từng thắng, hãy chiến thắng như thể bạn chưa từng thua.",
  "Khó khăn không kéo dài, nhưng người mạnh mẽ thì có.",
  "Bạn mạnh mẽ hơn bạn nghĩ và có thể làm được nhiều hơn bạn tưởng.",
  "Mỗi buổi tập là một cơ hội để trở thành phiên bản tốt hơn của chính mình.",
  "Đau đớn là tạm thời, nhưng sự bỏ cuộc là vĩnh viễn.",
  "Hãy yêu bản thân đủ để chăm sóc sức khỏe của mình.",
  "99 ngày có thể thay đổi cả cuộc đời – hãy tin vào điều đó!"
];

export function getFallbackQuote(): string {
  const today = new Date();
  const start = new Date('2024-01-01');
  const oneDay = 1000 * 60 * 60 * 24;
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / oneDay);
  return FALLBACK_QUOTES[diffDays % FALLBACK_QUOTES.length];
}