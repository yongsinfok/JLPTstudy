const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-600">
          JLPT N2 Learning Platform v1.0.0
        </p>
        <p className="text-xs text-gray-500 mt-2">
          本网站使用的学习数据来自{' '}
          <a
            href="https://github.com/mxggle/anki-jlpt-n2-grammar-example-sentences"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            shin-kanzen N2 grammar
          </a>{' '}
          项目
        </p>
        <p className="text-xs text-gray-500 mt-1">
          数据许可: CC BY-NC 4.0 | 本网站仅供个人学习使用，严禁商业用途
        </p>
      </div>
    </footer>
  );
};

export default Footer;
