const HeroSection = () => {
  return (
    <section
      className="relative flex h-[80vh] items-center bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/hero.jpg')",
      }}
    >
      <div className="container mx-auto px-6 text-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-6xl">
          99 NGÀY THAY ĐỔI BẢN THÂN
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-lg md:text-xl">
          Cùng NhiLe và cộng đồng người Việt trên toàn cầu xây dựng sức khỏe dẻo
          dai, tinh thần kỷ luật và thói quen sống lành mạnh mỗi ngày.
        </p>
        <a
          href="#dang-ky"
          className="btn-hero inline-flex items-center gap-2"
        >
          BẮT ĐẦU HÀNH TRÌNH CỦA BẠN
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
