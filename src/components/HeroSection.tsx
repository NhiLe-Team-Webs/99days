import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section 
      className="text-white h-[80vh] flex items-center relative bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroBg})`
      }}
    >
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
          99 NGÀY THAY ĐỔI BẢN THÂN
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
          Cùng NhiLe và cộng đồng người Việt toàn cầu xây dựng sức khỏe dẻo dai và thói quen sống lành mạnh.
        </p>
        <a href="#dang-ky" className="btn-hero">
          BẮT ĐẦU HÀNH TRÌNH CỦA BẠN
        </a>
      </div>
    </section>
  );
};

export default HeroSection;