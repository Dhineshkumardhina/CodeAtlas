import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, LogOut, Github, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper to check active link
  const isActive = (path) => location.pathname === path;

  // Scroll to section helper (for home page anchors)
  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0b0f19]/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
                <Compass className="h-5.5 w-5.5 text-white" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-violet-400 transition-colors duration-200">
                Code<span className="text-violet-400">Atlas</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/') ? 'text-violet-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                Home
              </Link>
              <button
                onClick={() => scrollToSection('features')}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                How It Works
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                      : 'text-gray-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <div className="h-4 w-[1px] bg-white/10"></div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/10 font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-gray-200">{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?tab=register"
                  className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
