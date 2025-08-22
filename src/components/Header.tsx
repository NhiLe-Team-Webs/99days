import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-gray-900">
          <span className="text-primary">99 Days</span> with NhiLe
        </a>
        <nav className="hidden md:flex space-x-8 items-center">
          <a href="#gioi-thieu" className="text-gray-600 hover:text-primary transition-all duration-300">Giới thiệu</a>
          <a href="#loi-ich" className="text-gray-600 hover:text-primary transition-all duration-300">Lợi ích</a>
          <a href="#hanh-trinh" className="text-gray-600 hover:text-primary transition-all duration-300">Hành trình</a>
          <a href="#dang-ky" className="btn-primary">Đăng ký ngay</a>
          <a href="#login" className="text-gray-600 hover:text-primary transition-all duration-300 font-medium">Đăng nhập</a>
        </nav>
        <button onClick={toggleMenu} className="md:hidden text-gray-800">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-4 bg-white/95 backdrop-blur-lg">
          <a href="#gioi-thieu" className="block py-2 text-gray-600 hover:text-primary" onClick={toggleMenu}>Giới thiệu</a>
          <a href="#loi-ich" className="block py-2 text-gray-600 hover:text-primary" onClick={toggleMenu}>Lợi ích</a>
          <a href="#hanh-trinh" className="block py-2 text-gray-600 hover:text-primary" onClick={toggleMenu}>Hành trình</a>
          <a href="#login" className="block py-2 text-gray-600 hover:text-primary font-medium" onClick={toggleMenu}>Đăng nhập</a>
          <a href="#dang-ky" className="block mt-4 btn-primary text-center" onClick={toggleMenu}>Đăng ký ngay</a>
        </div>
      )}
    </header>
  );
};

export default Header;