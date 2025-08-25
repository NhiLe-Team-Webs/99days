export const generateMotivationalQuote = async (
  name: string,
  userInfo?: {
    email?: string;
    phone?: string;
    telegram?: string;
  }
): Promise<string> => {
  // Tạo seed duy nhất cho mỗi user dựa trên thông tin cá nhân (không dùng age)
  const userSeed = `${name}_${userInfo?.email || ''}`;
  const today = new Date().toDateString();
  const uniqueSeed = `${userSeed}_${today}`;

  const prompt = `
Bạn là một huấn luyện viên thể hình cá nhân chuyên nghiệp. 
Hãy tạo một câu động viên độc đáo và cá nhân hóa cho ${name}.

Thông tin người dùng:
- Tên: ${name}
- Ngày: ${today}
- Mã cá nhân: ${uniqueSeed.slice(-8)}

Yêu cầu:
- Dưới 120 ký tự
- Phải gọi tên "${name}"
- Tạo câu hoàn toàn khác biệt dựa trên thông tin cá nhân
- Phong cách: năng động, cá nhân, truyền cảm hứng về tập luyện
- Không dùng dấu ngoặc kép
- Tập trung vào fitness, sức khỏe, động lực

Hãy tạo một câu động viên HOÀN TOÀN DUY NHẤT cho ${name}.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let quote = response.text().trim();
    quote = quote.replace(/^"|"$/g, '').replace(/\*+/g, '');
    return quote || `${name} ơi, hôm nay là ngày tuyệt vời để thử thách bản thân!`;
  } catch (error) {
    console.error("Lỗi gọi Gemini API:", error);
    const fallbacks = [
      `${name}, sức mạnh nằm trong sự kiên trì!`,
      `Hôm nay ${name} sẽ mạnh mẽ hơn ngày hôm qua!`,
      `${name} ơi, mỗi giọt mồ hôi là một bước tiến!`,
      `Cơ thể khỏe mạnh là món quà ${name} tặng cho chính mình!`
    ];
    const hash = uniqueSeed.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return fallbacks[Math.abs(hash) % fallbacks.length];
  }
};