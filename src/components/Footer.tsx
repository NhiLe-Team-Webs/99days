const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8 text-center">
        <a href="#" className="text-2xl font-bold">
          <span className="text-primary">99 Days</span> with NhiLe
        </a>
        <p className="mt-4 text-gray-400">
          Cùng nhau lan tỏa sức mạnh của sự kiên trì và kỷ luật!
        </p>
        <p className="mt-2 text-gray-400">
          Liên hệ hỗ trợ:{' '}
          <a href="https://t.me/Team_Exercise" className="hover:underline text-primary" target="_blank" rel="noopener noreferrer">
            @Team_Exercise
          </a>
        </p>
        <div className="mt-6 text-sm text-gray-500">
          &copy; 2024 NhiLe Foundation. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
