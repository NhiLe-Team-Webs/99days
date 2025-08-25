// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateMotivationalQuote = async (name: string): Promise<string> => {
  const prompt = `
Bạn là một huấn luyện viên thể hình chuyên nghiệp và tràn đầy năng lượng. 
Hãy tạo một câu động viên ngắn gọn, tích cực cho ${name} để bắt đầu buổi tập thể dục.

Yêu cầu:
- Dưới 100 ký tự
- Gọi tên "${name}" một cách thân thiện
- Tập trung vào việc tập thể dục, sức khỏe
- Phong cách: năng động, khích lệ, tạo động lực
- Không dùng dấu ngoặc kép
- Chỉ trả về câu động viên

Ví dụ: ${name} ơi, cơ thể mạnh mẽ bắt đầu từ quyết tâm hôm nay!
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let quote = response.text().trim();
    quote = quote.replace(/^"|"$/g, '').replace(/\*+/g, '');
    return quote || `Bạn làm tốt lắm, ${name}! Cứ tiếp tục tiến lên!`;
  } catch (error) {
    console.error("Lỗi gọi Gemini API:", error);
    return `Bạn có thể làm được, ${name}! Đừng bỏ cuộc.`;
  }
};