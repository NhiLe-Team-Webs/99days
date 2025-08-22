import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';
import gallery7 from '@/assets/gallery-7.jpg';
import gallery8 from '@/assets/gallery-8.jpg';

const GallerySection = () => {
  const galleryImages = [
    [gallery1, gallery2],
    [gallery3, gallery4],
    [gallery5, gallery6],
    [gallery7, gallery8]
  ];

  return (
    <section id="hanh-trinh" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Kho Lưu Giữ Hành Trình</h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            Nhật ký trở thành phiên bản xuất sắc hơn của chính mình. Cùng nhìn lại và lan tỏa động lực!
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((column, columnIndex) => (
            <div key={columnIndex} className="grid gap-4">
              {column.map((image, imageIndex) => (
                <div key={imageIndex}>
                  <img 
                    className="h-auto max-w-full rounded-lg shadow-md hover:opacity-90 transition-opacity duration-300 cursor-pointer" 
                    src={image} 
                    alt={`Khoảnh khắc ${columnIndex * 2 + imageIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Lan tỏa câu chuyện của bạn</h3>
          <p className="text-gray-600 mb-4">
            Chia sẻ hành trình của bạn với các hashtag{' '}
            <span className="font-semibold text-primary">
              #NhiLe #NhiLeTeam #NhiLeFoundation #99dayswithnhile
            </span>{' '}
            để cùng lan tỏa nguồn cảm hứng đến nhiều người hơn.
          </p>
          <h4 className="text-lg font-semibold mt-6 mb-2">Lưu Ý Về Bản Quyền & Sử Dụng Tài Nguyên</h4>
          <p className="text-gray-600 text-sm">
            Bạn được phép tải về và sử dụng hình ảnh/video cho mục đích cá nhân. Không được phép sử dụng cho mục đích thương mại khi chưa có sự đồng ý. Vui lòng liên hệ{' '}
            <a href="mailto:99days@nhi.sg" className="text-primary hover:underline">
              99days@nhi.sg
            </a>{' '}
            nếu có yêu cầu đặc biệt.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;