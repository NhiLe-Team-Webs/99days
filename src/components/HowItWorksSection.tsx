import workoutGroup from '@/assets/workout-group.jpg';

const HowItWorksSection = () => {
  return (
    <section id="cach-thuc" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Chương trình hoạt động như thế nào?
          </h2>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">⏰ Thời gian:</h3>
              <p className="text-gray-600">Mỗi ngày từ 4h45 sáng (giờ Việt Nam).</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">📍 Địa điểm:</h3>
              <p className="text-gray-600">Bất cứ đâu! Bạn có thể tham gia tại nhà, công viên, hay phòng gym.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">💻 Hình thức:</h3>
              <p className="text-gray-600">Online qua Zoom. Chỉ cần thức dậy và thực hiện các bài tập được thiết kế sẵn.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">👥 Ai có thể tham gia?</h3>
              <p className="text-gray-600">Bất kỳ ai từ 14 đến 55 tuổi, dù là người mới bắt đầu hay đã có kinh nghiệm.</p>
            </div>
          </div>
          <div>
            <img 
              src={workoutGroup} 
              alt="Tham gia chương trình" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;