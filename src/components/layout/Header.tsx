import { Link } from 'react-router-dom';
import { BookOpen, Home, Trophy, Target, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="text-primary" size={28} />
            <span className="text-xl font-bold text-gray-800">JLPT N2</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors">
              <Home size={18} />
              <span>首页</span>
            </Link>
            <Link to="/lessons" className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors">
              <BookOpen size={18} />
              <span>课程</span>
            </Link>
            <Link to="/progress" className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors">
              <Trophy size={18} />
              <span>进度</span>
            </Link>
            <Link to="/achievements" className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors">
              <Target size={18} />
              <span>成就</span>
            </Link>
            <Link to="/settings" className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors">
              <Settings size={18} />
              <span>设置</span>
            </Link>
          </nav>

          {/* Mobile menu button - to be implemented */}
          <button className="md:hidden text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
