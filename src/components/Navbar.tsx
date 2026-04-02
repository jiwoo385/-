import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BarChart3 } from 'lucide-react';
import { db, doc, onSnapshot } from '@/firebase';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [settings, setSettings] = React.useState({ 
    siteName: 'FuriE', 
    siteLogo: '',
    logoHeight: 32
  });
  const location = useLocation();

  React.useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site', 'settings'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          siteName: data.siteName || 'FuriE',
          siteLogo: data.siteLogo || '',
          logoHeight: data.logoHeight || 32
        });
      }
    }, (error) => {
      console.error("Error fetching settings:", error);
    });
    return () => unsub();
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/clients', label: 'Reference' },
    { to: '/product', label: 'Product' },
    { to: '/news', label: 'Notice & News' },
    { to: '/contact', label: 'Contact Us' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [settings.siteLogo]);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center">
                {settings.siteLogo && !imageError ? (
                  <img 
                    src={settings.siteLogo} 
                    alt={`${settings.siteName} Logo`} 
                    referrerPolicy="no-referrer"
                    style={{ 
                      height: `${settings.logoHeight}px`, 
                      width: 'auto'
                    }}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-3xl font-black italic tracking-tighter text-navy-900 flex items-center">
                    <span className="border-b-4 border-navy-900 leading-none">{settings.siteName}</span>
                  </span>
                )}
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={`px-4 py-2 rounded-xl transition-all font-medium ${
                  isActive(link.to) 
                    ? 'bg-gray-100 text-navy-900' 
                    : 'text-gray-600 hover:text-navy-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className={`block px-4 py-3 rounded-xl font-medium transition-all ${
                isActive(link.to)
                  ? 'bg-gray-100 text-navy-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
