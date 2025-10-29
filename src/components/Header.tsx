import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('gioi-thieu'); // mặc định

  // Danh sách section cần theo dõi
  const sections = ['gioi-thieu', 'loi-ich', 'hanh-trinh', 'dang-ky'];

  // Theo dõi cuộn
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // +100 để tránh header che

      // Kiểm tra từ dưới lên để lấy section cao nhất đang hiện
      for (const id of [...sections].reverse()) {
        const element = document.getElementById(id);
        if (!element) continue;

        const offsetTop = element.offsetTop;
        const height = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Kích hoạt ngay khi load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a
          href="#gioi-thieu"
          onClick={() => setActiveSection('gioi-thieu')}
          className="flex items-center gap-3 text-2xl font-bold text-gray-900"
        >
          <img
            src="/favicon.ico"
            alt="99 Days logo"
            className="h-10 w-10"
          />
          <span>
            <span className="text-primary">99 Days</span> with NhiLe
          </span>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8 items-center">
          <a
            href="#gioi-thieu"
            onClick={() => setActiveSection('gioi-thieu')}
            className={`transition-all duration-300 capitalize
              ${activeSection === 'gioi-thieu'
                ? 'text-primary font-medium'
                : 'text-gray-600 hover:text-primary'
              }
            `}
          >
            Giới thiệu
          </a>
          <a
            href="#loi-ich"
            onClick={() => setActiveSection('loi-ich')}
            className={`transition-all duration-300
              ${activeSection === 'loi-ich'
                ? 'text-primary font-medium'
                : 'text-gray-600 hover:text-primary'
              }
            `}
          >
            Lợi ích
          </a>
          <a
            href="#hanh-trinh"
            onClick={() => setActiveSection('hanh-trinh')}
            className={`transition-all duration-300
              ${activeSection === 'hanh-trinh'
                ? 'text-primary font-medium'
                : 'text-gray-600 hover:text-primary'
              }
            `}
          >
            Hành trình
          </a>
          <a
            href="#dang-ky"
            onClick={() => setActiveSection('dang-ky')}
            className="btn-primary"
          >
            Đăng ký ngay
          </a>
          <Link
          to="/login"
          className="text-gray-600 hover:text-primary transition-all duration-300 font-medium"
        >
          Đăng nhập
        </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-800 p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-4 bg-white/95 backdrop-blur-lg space-y-2 animate-in slide-in-from-top-2 duration-200">
          <a
            href="#gioi-thieu"
            onClick={() => {
              setActiveSection('gioi-thieu');
              setIsMenuOpen(false);
            }}
            className={`block py-2 text-gray-600
              ${activeSection === 'gioi-thieu' ? 'text-primary font-medium' : 'hover:text-primary'}
            `}
          >
            Giới thiệu
          </a>
          <a
            href="#loi-ich"
            onClick={() => {
              setActiveSection('loi-ich');
              setIsMenuOpen(false);
            }}
            className={`block py-2 text-gray-600
              ${activeSection === 'loi-ich' ? 'text-primary font-medium' : 'hover:text-primary'}
            `}
          >
            Lợi ích
          </a>
          <a
            href="#hanh-trinh"
            onClick={() => {
              setActiveSection('hanh-trinh');
              setIsMenuOpen(false);
            }}
            className={`block py-2 text-gray-600
              ${activeSection === 'hanh-trinh' ? 'text-primary font-medium' : 'hover:text-primary'}
            `}
          >
            Hành trình
          </a>
          <a
            href="#login"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-gray-600 hover:text-primary font-medium"
          >
            Đăng nhập
          </a>
          <a
            href="#dang-ky"
            onClick={() => {
              setActiveSection('dang-ky');
              setIsMenuOpen(false);
            }}
            className="block mt-2 btn-primary text-center"
          >
            Đăng ký ngay
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
