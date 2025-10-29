const highlights = [
  {
    title: '⏰ Thời gian',
    description: 'Mỗi ngày từ 4h45 sáng (giờ Việt Nam) cùng NhiLe Team.',
  },
  {
    title: '📍 Địa điểm',
    description: 'Bất cứ đâu! Bạn có thể tham gia tại nhà, công viên hay phòng gym.',
  },
  {
    title: '🧭 Hình thức',
    description: 'Online qua Zoom. Chỉ cần thức dậy đúng giờ và theo các bài tập đã chuẩn bị sẵn.',
  },
  {
    title: '🙌 Ai có thể tham gia?',
    description: 'Mọi người từ 14 đến 55 tuổi, dù mới bắt đầu hay đã có kinh nghiệm đều được chào đón.',
  },
];

const HowItWorksSection = () => {
  return (
    <section id="cach-thuc" className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Chương trình hoạt động như thế nào?
          </h2>
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr,1.1fr]">
          <div className="space-y-6">
            {highlights.map(({ title, description }) => (
              <div key={title}>
                <h3 className="mb-1 text-xl font-semibold">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            <img
              src="/group.jpg"
              alt="Cộng đồng luyện tập cùng nhau"
              className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
