import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqSections = [
  {
    heading: "1. Ý NGHĨA VÀ CÂU CHUYỆN CHƯƠNG TRÌNH",
    items: [
      {
        question: "1.1 99 Days with NhiLe là gì?",
        paragraphs: [
          "“99 Days with NhiLe” không chỉ là một thử thách thể dục – đây là hành trình rèn luyện kỷ luật và xây dựng lối sống mới.",
          "Mỗi sáng, bạn thức dậy lúc 4h45 AM, tham gia Zoom tập luyện cùng cộng đồng.",
          "Mỗi ngày, bạn viết 3 điều biết ơn để nuôi dưỡng tinh thần tích cực.",
          "Qua 99 ngày, bạn nhận ra:",
        ],
        bullets: [
          "Cơ thể khỏe mạnh và gọn gàng hơn.",
          "Tâm trí sáng suốt, tinh thần lạc quan hơn.",
          "Cuộc sống kỷ luật và chủ động hơn.",
        ],
        closing:
          "👉 Nói ngắn gọn: Đây là hành trình trở thành phiên bản tốt hơn của chính bạn, từng ngày một.",
      },
      {
        question: "1.2 Đây có phải chương trình thể dục không?",
        paragraphs: [
          "Không chỉ vậy.",
          "Đây còn là thử thách về kỷ luật cá nhân – nơi bạn học cách chiến thắng bản thân mỗi buổi sáng.",
          "Thể dục chỉ là phương tiện. Mục tiêu thực sự là rèn tính bền bỉ và tinh thần kỷ luật.",
        ],
      },
      {
        question: "1.3 Có chị NhiLe tham gia không?",
        paragraphs: [
          "Có.",
          "Thỉnh thoảng chị NhiLe tham gia Zoom cùng mọi người sau khi buổi tập kết thúc.",
          "Thời điểm cụ thể không cố định – như một món quà bất ngờ dành cho những ai luôn sẵn sàng.",
        ],
      },
      {
        question: "1.4 Thử thách “99 Days with NhiLe” có khó không?",
        paragraphs: [
          "Không khó.",
          "Bạn chỉ cần kiên trì và làm đúng quy định mỗi ngày.",
          "Điều quan trọng không phải thể lực, mà là duy trì kỷ luật – dậy sớm, tập luyện và biết ơn.",
        ],
      },
    ],
  },
  {
    heading: "2. LUẬT CHƠI VÀ CHECKLIST DÀNH CHO NGƯỜI MỚI",
    items: [
      {
        question: "2.1 Ai có thể tham gia?",
        bullets: [
          "Người Việt Nam ở mọi nơi, từ 14 đến 55 tuổi.",
          "Mong muốn cải thiện sức khỏe – tinh thần – kỷ luật.",
          "Cần cộng đồng hỗ trợ và truyền cảm hứng mỗi ngày.",
        ],
      },
      {
        question: "2.2 Khi nào bắt đầu và kết thúc thử thách?",
        bullets: ["Bắt đầu: 19/11/2025", "Kết thúc: 25/02/2026"],
      },
      {
        question: "2.3 Luật chơi cơ bản",
        bullets: [
          "Thức dậy lúc 4:45 sáng mỗi ngày.",
          "Tham gia Zoom tập luyện 30 phút cùng team (xem thêm quy định ở mục 3).",
          "Trước khi kết thúc ngày, viết 3 điều biết ơn.",
          "Bỏ lỡ 1 ngày = rời khỏi thử thách.",
          "Đây không phải bài kiểm tra thể lực, mà là thử thách kỷ luật cá nhân.",
        ],
      },
      {
        question: "2.4 Tôi cần chuẩn bị gì trước khi tham gia?",
        bullets: [
          "Đăng ký tham gia và được duyệt vào nhóm Telegram của chương trình.",
          "Có tài khoản Zoom và Telegram (để nhận link và thông báo).",
          "Không gian yên tĩnh, bật camera suốt buổi tập.",
          "Đặt tên Zoom theo cú pháp: SBD + Họ tên.",
          "Cam kết tham gia đủ 99 buổi, không nghỉ.",
        ],
      },
      {
        question: "2.5 Nếu tôi đi công tác, du lịch hoặc về quê trong 99 ngày thì sao?",
        paragraphs: [
          "Không sao cả.",
          "Chỉ cần tuân thủ đúng quy định và có dụng cụ tập (tạ), bạn hoàn toàn tập được ở bất kỳ đâu.",
          "Thử thách không phụ thuộc địa điểm – chỉ phụ thuộc ý chí.",
        ],
      },
      {
        question: "2.6 Nếu tôi bị rớt mạng giữa chừng thì sao?",
        bullets: [
          "Zoom mở từ 4:30 sáng và khóa phòng lúc 4:45.",
          "Nếu vì bất kỳ lý do nào bạn bị rời khỏi Zoom trước khi HLV thông báo kết thúc, buổi đó được tính là vắng mặt.",
        ],
      },
      {
        question: "2.7 Trong quá trình tập nếu bị chấn thương thì sao?",
        bullets: [
          "HLV điều chỉnh bài tập hoặc giảm cường độ phù hợp.",
          "Khi có vấn đề, hãy chủ động báo cho HLV hoặc admin để được hỗ trợ an toàn.",
        ],
      },
      {
        question: "2.8 Tôi chưa từng tập thể dục, sức yếu có tham gia được không?",
        paragraphs: [
          "Hoàn toàn được.",
          "HLV hướng dẫn từ những bài tập cơ bản nhất, giúp bạn tăng dần sức bền.",
          "Quan trọng là kiên trì rèn luyện đúng hướng dẫn.",
        ],
      },
      {
        question: "2.9 Phần thưởng cuối hành trình",
        paragraphs: [
          "🎁 Khi hoàn thành 99 ngày, bạn sẽ nhận được:",
        ],
        bullets: [
          "Một cơ thể khỏe mạnh và bền bỉ hơn.",
          "Thói quen 4h45 sáng – khởi đầu ngày mới tràn năng lượng.",
          "Tinh thần biết ơn và lạc quan mỗi ngày.",
          "Và phần thưởng đặc biệt: Khóa học “Là Chính Mình”, minh chứng cho hành trình trưởng thành.",
        ],
        closing:
          "Sứ mệnh khóa học “Là Chính Mình”: Giúp bạn khám phá và chữa lành bản thân, xây dựng lối sống cân bằng, phát triển toàn diện về thể chất – tinh thần – cảm xúc. Xem thêm tại: https://nedu.nhi.sg/program-offline/la-chinh-minh/",
      },
    ],
  },
  {
    heading: "3. QUY ĐỊNH THAM GIA ZOOM",
    items: [
      {
        question: "3.1 Quy định cơ bản",
        bullets: [
          "Vào phòng Zoom trước 4:45 AM.",
          "Đặt tên đúng cú pháp: SBD + Tên (ví dụ: 002 Hương).",
          "Bật camera – Tắt mic trong suốt buổi tập, chỉ bật mic khi được yêu cầu.",
          "Cơ thể luôn nằm trong khung hình, ánh sáng rõ ràng.",
          "Không chia sẻ link Zoom hoặc thông tin nhóm ra bên ngoài.",
          "Vi phạm quy định = loại khỏi thử thách.",
        ],
      },
      {
        question: "3.2 Có cần bật mic để tương tác không?",
        paragraphs: [
          "Không.",
          "Chỉ bật mic khi HLV hoặc Admin yêu cầu.",
          "Hãy giữ mic tắt để tôn trọng không gian chung của phòng tập.",
        ],
      },
      {
        question: "3.3 Ban tổ chức có kiểm tra camera từng người không?",
        paragraphs: [
          "Có.",
          "Đội ngũ admin quan sát camera để:",
        ],
        bullets: [
          "Sửa kỹ thuật sai, tránh chấn thương.",
          "Đảm bảo tính công bằng và tuân thủ quy định.",
        ],
      },
    ],
  },
  {
    heading: "4. CÂU HỎI THƯỜNG GẶP KHÁC",
    items: [
      {
        question: "4.1 Làm sao nhận được SBD (Số báo danh)?",
        paragraphs: [
          "SBD được công bố trong Group Telegram 99 Days with NhiLe sau khi bạn được duyệt tham gia.",
          "Link nhóm được gửi kèm email xác nhận, và công bố trước ngày 18/11.",
        ],
      },
      {
        question: "4.2 Tôi có được nghỉ 1 buổi không?",
        paragraphs: [
          "❌ Không.",
          "Nghỉ 1 buổi → mất quyền thi đua giải thưởng “Là Chính Mình.”",
          "Nghỉ 2 buổi → bị loại khỏi thử thách.",
        ],
      },
      {
        question: "4.3 Tôi cần chuẩn bị dụng cụ tập gì?",
        paragraphs: ["Dụng cụ được thông báo trong chương trình.", "Thông thường:"],
        bullets: [
          "Thảm tập (không bắt buộc)",
          "Tạ (bắt buộc) – tiêu chuẩn tạ được HLV hướng dẫn chi tiết.",
        ],
      },
      {
        question: "4.4 Nếu tôi có vấn đề sức khỏe thì có tham gia được không?",
        paragraphs: [
          "Được.",
          "Trong đơn đăng ký có mục ghi chú tình trạng sức khỏe.",
          "Ghi rõ để HLV điều chỉnh bài tập phù hợp.",
        ],
      },
      {
        question: "4.5 Làm sao theo dõi tiến độ của mình?",
        paragraphs: [
          "Truy cập https://99days.nhi.sg/ → đăng nhập vào trang cá nhân.",
          "Mỗi tuần chụp ảnh tiến trình, và 2 tuần test thể lực.",
        ],
      },
      {
        question: "4.6 Tôi gặp vấn đề kỹ thuật thì liên hệ ai?",
        paragraphs: [
          "Liên hệ Admin (Telegram): @Team_Exercise",
          "Hoặc nhắn trực tiếp trong group Telegram “99 Days with NhiLe” – tin nhắn tại nhóm được ưu tiên trả lời nhanh hơn.",
        ],
      },
      {
        question: "4.7 Tôi muốn chia sẻ câu chuyện hành trình ở đâu?",
        paragraphs: [
          "Gửi về Admin (Telegram): @Team_Exercise",
          "Câu chuyện truyền cảm hứng của bạn có thể được đăng trên kênh chính thức của “99 Days with NhiLe” và NhiLe Team.",
        ],
      },
      {
        question: "4.8 Tôi ở nước ngoài, múi giờ khác có tham gia được không?",
        paragraphs: [
          "Hoàn toàn được!",
          "Chỉ cần tham gia đúng khung giờ 4h45 sáng (giờ Việt Nam).",
          "Nếu lệch múi giờ, bạn có thể xem lại hướng dẫn bài tập để tự tập bù.",
        ],
      },
      {
        question: "4.9 Có được xem lại buổi tập không?",
        paragraphs: [
          "Buổi Zoom được ghi lại nội bộ để kiểm tra thời lượng tham gia.",
          "Không công khai bản ghi vì lý do bảo mật.",
          "Các hướng dẫn bài tập được gửi trước buổi tập để bạn có thể lưu trữ và xem lại.",
        ],
      },
      {
        question: "4.10 Có chương trình mùa tiếp theo không?",
        paragraphs: [
          "Có.",
          "“99 Days with NhiLe” được tổ chức một mùa mỗi năm.",
        ],
      },
      {
        question: "4.11 Tôi có được tham gia lại nếu bị loại không?",
        paragraphs: [
          "Hoàn toàn được.",
          "Bạn đăng ký lại ở mùa kế tiếp.",
          "Nếu bị rớt ngày đầu tiên, vẫn có thể tiếp tục tham gia (không tính thi đua giải thưởng).",
          "Nếu tiếp tục rớt thêm → bị loại hoàn toàn khỏi thử thách.",
        ],
      },
    ],
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="bg-white py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6F00]">
            Câu Hỏi Thường Gặp
          </p>
          <h2 className="mt-3 text-3xl font-black text-gray-900 md:text-4xl">
            Hiểu Rõ Hành Trình 99 Days with NhiLe
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Tất cả thông tin bạn cần biết để sẵn sàng tham gia và gắn bó với cộng đồng.
          </p>
        </div>
        <div className="space-y-10">
          {faqSections.map((section) => (
            <div key={section.heading} className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">{section.heading}</h3>
              <Accordion type="multiple" className="space-y-3">
                {section.items.map((item) => (
                  <AccordionItem
                    key={item.question}
                    value={item.question}
                    className="rounded-xl border border-gray-200 bg-white"
                  >
                    <AccordionTrigger className="px-5 py-4 text-left text-base font-semibold text-gray-900 hover:text-[#FF6F00]">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4 text-sm leading-relaxed text-gray-700">
                      <div className="space-y-3">
                        {item.paragraphs?.map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                        {item.bullets ? (
                          <ul className="list-disc space-y-1 pl-5">
                            {item.bullets.map((bullet, idx) => (
                              <li key={idx}>{bullet}</li>
                            ))}
                          </ul>
                        ) : null}
                        {item.closing ? <p>{item.closing}</p> : null}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
