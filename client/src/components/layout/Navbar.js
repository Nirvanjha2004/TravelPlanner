import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Globe, 
  PlusCircle, 
  User, 
  LogOut, 
  LogIn, 
  Menu, 
  X,
  Search,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '../../lib/utils';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  // Handle scroll effect on navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when changing pages
  useEffect(() => {
    closeAllMenus();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    closeAllMenus();
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return '?';
    const nameParts = user.name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  };

  // Navigation items - updated to include map
  const navItems = [
    { title: "Explore", href: "/explore" },
    { title: "Categories", href: "/categories" },
    { title: "Popular Destinations", href: "/destinations" },
    { title: "Map View", href: "/map" },
  ];

  return (
    <nav 
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-sm transition-all duration-300",
        isScrolled 
          ? "bg-white/90 shadow-sm border-b" 
          : "bg-white border-b"
      )}
    >
      <div className="container-custom py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Globe className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-xl text-gray-900">TravelShare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Navigation Links */}
            <div className="mr-4 space-x-1">
              {navItems.map((item, index) => (
                <Button 
                  key={index} 
                  variant="ghost" 
                  size="sm" 
                  asChild 
                  className="text-gray-700 font-medium"
                >
                  <Link to={item.href}>{item.title}</Link>
                </Button>
              ))}
            </div>
            
            {/* Search - visible on desktop */}
            <div className="hidden lg:flex relative flex-1 mx-4 w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search experiences..." 
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent text-sm"
              />
            </div>

            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="text-gray-700 hover:text-primary"
                >
                  <Link to="/add-experience" className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Share Experience
                  </Link>
                </Button>
                
                {/* Enhanced Profile Menu */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 pr-2 pl-1 py-1"
                    onClick={toggleProfileMenu}
                  >
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarImage src={user.profilePicture || "https://github.com/shadcn.png"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline font-medium text-gray-800">{user.name?.split(' ')[0]}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg z-50 border animate-in slide-in-from-top-5 duration-200">
                      <div className="py-2 px-4 border-b">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={closeAllMenus}
                        >
                          <User className="mr-2 h-4 w-4" /> Profile
                        </Link>
                        
                        <Link 
                          to="/settings" 
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={closeAllMenus}
                        >
                          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg> 
                          Settings
                        </Link>
                      </div>
                      
                      <div className="py-1 border-t">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <LogOut className="mr-2 h-4 w-4 text-rose-500" /> 
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="font-medium">
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/register">
                    <User className="mr-2 h-4 w-4" />
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <Link to="/profile" className="mr-2">
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarImage src={user.profilePicture || "https://github.com/shadcn.png"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu} 
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-in slide-in-from-top-5 duration-200">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>
            
            {/* Navigation Links for Mobile */}
            {navItems.map((item, index) => (
              <Button 
                key={index}
                variant="ghost" 
                className="w-full justify-start" 
                asChild 
                onClick={closeAllMenus}
              >
                <Link to={item.href}>{item.title}</Link>
              </Button>
            ))}
            
            <div className="pt-2 mt-2 border-t border-gray-200">
              {user ? (
                <>
                  <Button variant="ghost" className="w-full justify-start" asChild onClick={closeAllMenus}>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild onClick={closeAllMenus}>
                    <Link to="/add-experience" className="flex items-center">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Share Experience
                    </Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start mt-2" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/login" onClick={closeAllMenus}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                  <Button className="w-full justify-start mt-2" asChild>
                    <Link to="/register" onClick={closeAllMenus}>
                      <User className="mr-2 h-4 w-4" />
                      Register
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
