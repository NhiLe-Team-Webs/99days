import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const NAV_ITEMS = [
  { id: "gioi-thieu", label: "Giới thiệu" },
  { id: "loi-ich", label: "Lợi ích" },
  { id: "hanh-trinh", label: "Hành trình" },
  { id: "faq", label: "FAQ" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("gioi-thieu");

  useEffect(() => {
    const trackedSections = [...NAV_ITEMS.map((item) => item.id), "dang-ky"];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      for (const id of [...trackedSections].reverse()) {
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

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateTo = (id: string) => {
    setActiveSection(id);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 shadow-sm backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a
          href="#gioi-thieu"
          onClick={() => navigateTo("gioi-thieu")}
          className="flex items-center gap-3 text-2xl font-bold text-gray-900"
        >
          <img src="/favicon.ico" alt="99 Days logo" className="h-10 w-10" />
          <span>
            <span className="text-primary">99 Days</span> with NhiLe
          </span>
        </a>

        <nav className="hidden items-center space-x-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => navigateTo(item.id)}
              className={`transition-colors duration-300 ${
                activeSection === item.id
                  ? "text-primary font-medium"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#dang-ky"
            onClick={() => navigateTo("dang-ky")}
            className="btn-primary"
          >
            Đăng ký ngay
          </a>
          <Link
            to="/login"
            className="font-medium text-gray-600 transition-colors duration-300 hover:text-primary"
          >
            Đăng nhập
          </Link>
        </nav>

        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="rounded-md p-2 text-gray-800 md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="space-y-2 bg-white/95 px-6 pb-4 backdrop-blur-lg md:hidden">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => navigateTo(item.id)}
              className={`block py-2 text-gray-600 ${
                activeSection === item.id ? "text-primary font-medium" : "hover:text-primary"
              }`}
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/login"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-gray-600 font-medium hover:text-primary"
          >
            Đăng nhập
          </Link>
          <a
            href="#dang-ky"
            onClick={() => navigateTo("dang-ky")}
            className="btn-primary block text-center"
          >
            Đăng ký ngay
          </a>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
