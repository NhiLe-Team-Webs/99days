import { Zap, Clock, CheckCircle, Users } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Sức khỏe dẻo dai",
      description: "Cải thiện thể lực, tăng cường năng lượng cho ngày mới và cảm nhận sự thay đổi rõ rệt của cơ thể."
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Thói quen lành mạnh",
      description: "Biến việc tập luyện buổi sáng thành một phần không thể thiếu trong cuộc sống của bạn."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: "Tư duy tích cực",
      description: "Rèn luyện ý chí, kỷ luật và một tinh thần mạnh mẽ để vượt qua mọi thử thách trong cuộc sống."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Cộng đồng gắn kết",
      description: "Giao lưu, học hỏi và được tiếp thêm động lực mỗi ngày từ những người đồng đội tuyệt vời."
    }
  ];

  return (
    <section id="loi-ich" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Bạn sẽ nhận được gì sau 99 ngày?
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="card-benefit">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;