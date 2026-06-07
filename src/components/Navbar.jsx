import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, X, Heart } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  favoriteCount,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'all', label: 'Home' },
    { id: 'tv-show', label: 'TV Shows' },
    { id: 'movie', label: 'Movies' },
    { id: 'anime', label: 'Anime' },
    { id: 'trailer', label: 'Trailers' },
    { id: 'favorites', label: 'My List' },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-zinc-950/95 shadow-xl backdrop-blur-md py-3' : 'bg-gradient-to-b from-black/80 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Left Section: Logo & Desktop Links */}
        <div className="flex items-center space-x-8">
          <div
            id="brand-logo"
            onClick={() => setActiveTab('all')}
            className="flex items-center space-x-1 cursor-pointer select-none group"
          >
            <span className="text-[#E50914] font-black text-2xl md:text-3xl tracking-tighter hover:scale-105 transition-transform duration-200">
              NETFLIX<span className="text-white text-xs align-super ml-0.5 font-medium tracking-normal bg-[#E50914] px-1 py-0.5 rounded scale-75">HUB</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-${link.id}`}
                onClick={() => {
                  setActiveTab(link.id);
                  setSearchQuery('');
                }}
                className={`text-sm font-medium transition-colors duration-300 relative py-1 ${
                  activeTab === link.id
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {link.label}
                {link.id === 'favorites' && favoriteCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-red-600 text-white rounded-full font-bold">
                    {favoriteCount}
                  </span>
                )}
                {activeTab === link.id && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[3px] bg-red-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Animated Search Bar */}
          <div
            id="search-container"
            className={`flex items-center bg-zinc-900/60 border border-zinc-800 rounded-full py-1.5 px-3 transition-all duration-300 ${
              isSearchExpanded || searchQuery ? 'w-48 md:w-64 opacity-100' : 'w-10 opacity-70 hover:opacity-100'
            }`}
          >
            <Search
              size={18}
              className="text-zinc-400 cursor-pointer hover:text-white"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            />
            {(isSearchExpanded || searchQuery) && (
              <input
                id="search-input"
                type="text"
                placeholder="Titles, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white focus:outline-none ml-2 w-full placeholder-zinc-500"
                autoFocus
              />
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick List Button (Desktop) */}
          <button
            id="my-list-quick-btn"
            onClick={() => setActiveTab('favorites')}
            className={`relative p-2 rounded-full cursor-pointer hover:bg-zinc-900 transition-colors ${
              activeTab === 'favorites' ? 'text-red-500 bg-zinc-900' : 'text-zinc-300 hover:text-white'
            }`}
            title="My List"
          >
            <Heart size={20} fill={activeTab === 'favorites' || favoriteCount > 0 ? 'currentColor' : 'none'} />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold border border-zinc-950">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar */}
          <div className="hidden sm:block">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-800 cursor-pointer hover:border-red-600 transition-colors">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
                alt="Profile"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Mobile Menu Icon */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-zinc-300 hover:text-white p-1"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden fixed top-[60px] left-0 w-full h-[calc(100vh-60px)] bg-zinc-950 border-t border-zinc-900 flex flex-col pt-6 px-6 space-y-4 z-40 transition-transform duration-300"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              id={`mobile-nav-${link.id}`}
              onClick={() => {
                setActiveTab(link.id);
                setSearchQuery('');
                setIsMobileMenuOpen(false);
              }}
              className={`text-left text-lg font-medium py-2 border-b border-zinc-900 flex justify-between items-center ${
                activeTab === link.id ? 'text-red-500' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <span>{link.label}</span>
              {link.id === 'favorites' && favoriteCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {favoriteCount}
                </span>
              )}
            </button>
          ))}
          <div className="pt-8 flex items-center space-x-3 text-zinc-400 text-sm">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-lg object-cover border border-zinc-800"
            />
            <div>
              <p className="text-white font-medium">Guest User</p>
              <p className="text-xs text-zinc-550">premium subscriber</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
