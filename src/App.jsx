import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MediaRow from './components/MediaRow';
import PlayerModal from './components/PlayerModal';
import mediaDataRaw from './data/media.json';
import { AlertCircle, Heart } from 'lucide-react';

const mediaData = mediaDataRaw;

export default function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('netflix_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading favorites from localStorage', e);
    }
  }, []);

  // Save favorites to localStorage
  const handleToggleFavorite = (movie) => {
    let updatedFavorites;
    if (favorites.includes(movie.id)) {
      updatedFavorites = favorites.filter((id) => id !== movie.id);
    } else {
      updatedFavorites = [...favorites, movie.id];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('netflix_favorites', JSON.stringify(updatedFavorites));
  };

  const handlePlayMedia = (movie) => {
    setSelectedMovie(movie);
    setIsPlayerOpen(true);
  };

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setIsPlayerOpen(true);
  };

  // Determine which item is highlighted in the Hero Spotlight!
  const getFeaturedItem = () => {
    const featuredList = mediaData.filter((item) => {
      if (activeTab === 'all') return item.isFeatured;
      if (activeTab === 'favorites') return favorites.includes(item.id);
      return item.category === activeTab;
    });

    if (featuredList.length > 0) {
      // Return highest-rated featured item
      return featuredList.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))[0];
    }

    // Fallbacks
    const categoryBackupList = mediaData.filter(item => activeTab === 'all' ? true : item.category === activeTab);
    if (categoryBackupList.length > 0) {
      return categoryBackupList[0];
    }

    return mediaData[0]; // ultimate default fallback
  };

  const heroMovie = getFeaturedItem();

  // Search filter matching
  const searchFilteredItems = mediaData.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.genres.some((g) => g.toLowerCase().includes(q)) ||
      item.description.toLowerCase().includes(q)
    );
  });

  // Category specific filters for homepage rows
  const getRowItems = (category, filterType, genreFilter) => {
    let items = mediaData;
    
    // Filter by main tab if not 'all'
    if (activeTab !== 'all' && activeTab !== 'favorites') {
      items = items.filter(item => item.category === activeTab);
    }

    // Filter by specific subcategory tab
    if (category !== 'all') {
      items = items.filter(item => item.category === category);
    }

    if (filterType === 'trending') {
      return items.filter(item => item.isTrending);
    }

    if (filterType === 'new-releases') {
      return items.filter(item => item.isNewRelease);
    }

    if (filterType === 'genre' && genreFilter) {
      return items.filter(item => item.genres.includes(genreFilter));
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white selection:bg-[#E50914] selection:text-white flex flex-col font-sans">
      {/* Dynamic responsive Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoriteCount={favorites.length}
      />

      {/* Main Container contents */}
      <main className="flex-grow pb-16">
        {searchQuery ? (
          /* Search Results Grid View */
          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 md:pt-28 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-6">
              Search Results for: <span className="text-[#E50914]">"{searchQuery}"</span>
            </h1>
            
            {searchFilteredItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchFilteredItems.map((movie) => (
                  <div
                    key={movie.id}
                    className="cursor-pointer group relative bg-[#1c1c1c] rounded-sm overflow-hidden aspect-[2/3] transform transition-transform hover:scale-105 hover:z-20 shadow-xl border border-zinc-900"
                    onClick={() => handleSelectMovie(movie)}
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <h3 className="text-sm font-black text-white mb-1">{movie.title}</h3>
                      <div className="flex items-center space-x-2 text-[10px] text-zinc-400 font-bold">
                        <span className="text-green-400 font-extrabold">{Math.round(parseFloat(movie.rating) * 10)}% Match</span>
                        <span>•</span>
                        <span>{movie.releaseYear}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayMedia(movie);
                        }}
                        className="mt-3 w-full bg-[#E50914] text-white rounded-sm py-2 text-xs font-bold hover:bg-red-700 transition-colors"
                      >
                        Play
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle size={48} className="text-zinc-600 mb-4" />
                <p className="text-zinc-400 text-lg font-bold">No titles match your query.</p>
                <p className="text-zinc-650 text-sm mt-1">Try searching for other tags, categories, or keywords.</p>
              </div>
            )}
          </div>
        ) : activeTab === 'favorites' ? (
          /* My List Favorites Page */
          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 md:pt-28 animate-fade-in">
            <h1 className="text-2xl sm:text-4xl font-black mb-1 tracking-tight">My List</h1>
            <p className="text-zinc-550 text-xs sm:text-sm mb-8">Your saved favorites, movies, and episodes, stored locally.</p>

            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {mediaData
                  .filter((item) => favorites.includes(item.id))
                  .map((movie) => (
                    <div
                      key={movie.id}
                      className="cursor-pointer group relative bg-[#1c1c1c] rounded-sm overflow-hidden aspect-[2/3] transform transition-transform hover:scale-105 hover:z-20 shadow-xl border border-zinc-900"
                      onClick={() => handleSelectMovie(movie)}
                    >
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <h3 className="text-sm font-black text-white mb-1">{movie.title}</h3>
                        <div className="flex items-center space-x-2 text-[10px] text-zinc-400 font-bold">
                          <span className="text-green-400 font-extrabold">{Math.round(parseFloat(movie.rating) * 10)}% Match</span>
                          <span>•</span>
                          <span className="uppercase text-[9px] bg-[#222] text-[#E50914] px-1 rounded-sm">{movie.category.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayMedia(movie);
                            }}
                            className="flex-grow bg-[#E50914] text-white rounded-sm py-2 text-xs font-bold hover:bg-red-700 transition-colors"
                          >
                            Play
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(movie);
                            }}
                            className="bg-[#222] text-[#E50914] rounded-sm p-2 hover:bg-[#333] transition-colors border border-zinc-800"
                            title="Remove from My List"
                          >
                            <Heart size={14} fill="currentColor" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center select-none bg-zinc-900/10 rounded-sm border border-zinc-805 p-6 md:p-12">
                <Heart size={44} className="text-zinc-700 mb-4" />
                <h3 className="text-zinc-300 font-black text-lg">Your list is currently empty</h3>
                <p className="text-zinc-500 text-sm max-w-sm mt-2 leading-relaxed">
                  Tap the '+' plus or Heart icon on any movie, show, or trailer card to keep track of items you want to watch.
                </p>
                <button
                  onClick={() => setActiveTab('all')}
                  className="mt-6 bg-[#E50914] hover:bg-red-700 text-white text-xs font-extrabold px-8 py-3 rounded-sm transition-colors cursor-pointer"
                >
                  Explore Home Catalog
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Normal Home Rows View */
          <>
            {/* Cinematic Large Hero Spotlight */}
            {heroMovie && (
              <Hero
                movie={heroMovie}
                onPlay={handlePlayMedia}
                onSelect={handleSelectMovie}
                isFavorite={favorites.includes(heroMovie.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* Custom Interactive Categorized Rows */}
            <div className="space-y-8 -mt-8 md:-mt-16 relative z-30">
              
              {activeTab === 'all' && (
                <>
                  <MediaRow
                    title="Trending Now"
                    movies={getRowItems('all', 'trending')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />

                  {/* High Quality Anime Shonen Hits Row */}
                  <MediaRow
                    title="Top Anime Hit Row"
                    movies={getRowItems('anime')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />

                  {/* Action blockbusters */}
                  <MediaRow
                    title="Movies Selection"
                    movies={getRowItems('movie')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />

                  <MediaRow
                    title="Popular TV Shows"
                    movies={getRowItems('tv-show')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />

                  <MediaRow
                    title="Official Trailers & Sneak Previews"
                    movies={getRowItems('trailer')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </>
              )}

              {activeTab === 'anime' && (
                <>
                  <MediaRow
                    title="Trending Anime Series"
                    movies={getRowItems('anime', 'trending')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                  <MediaRow
                    title="Action & Supernatural"
                    movies={getRowItems('anime', 'genre', 'Action')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                  <MediaRow
                    title="New Releases"
                    movies={getRowItems('anime', 'new-releases')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </>
              )}

              {activeTab === 'tv-show' && (
                <>
                  <MediaRow
                    title="Trending TV Series"
                    movies={getRowItems('tv-show', 'trending')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                  <MediaRow
                    title="Sci-Fi & Mystery"
                    movies={getRowItems('tv-show', 'genre', 'Sci-Fi')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                  <MediaRow
                    title="Fantasy Collections"
                    movies={getRowItems('tv-show', 'genre', 'Fantasy')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </>
              )}

              {activeTab === 'movie' && (
                <>
                  <MediaRow
                    title="Trending Movies"
                    movies={getRowItems('movie', 'trending')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                  <MediaRow
                    title="Sci-Fi Blockbusters"
                    movies={getRowItems('movie', 'genre', 'Sci-Fi')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                  <MediaRow
                    title="Adventure & Drama"
                    movies={getRowItems('movie', 'genre', 'Adventure')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </>
              )}

              {activeTab === 'trailer' && (
                <>
                  <MediaRow
                    title="Official Previews"
                    movies={getRowItems('trailer')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                  <MediaRow
                    title="Trending Releases"
                    movies={getRowItems('trailer', 'trending')}
                    onSelect={handleSelectMovie}
                    onPlay={handlePlayMedia}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </>
              )}

            </div>
          </>
        )}
      </main>

      {/* Global Player / Detailed Episode & Season Chooser Overlay Modal */}
      {selectedMovie && (
        <PlayerModal
          movie={selectedMovie}
          isOpen={isPlayerOpen}
          onClose={() => {
            setIsPlayerOpen(false);
            setSelectedMovie(null);
          }}
          isFavorite={favorites.includes(selectedMovie.id)}
          onToggleFavorite={handleToggleFavorite}
          initialPlayMode={true}
        />
      )}

      {/* Sleek Netflix Styled Footer */}
      <footer id="global-footer" className="bg-[#141414] border-t border-zinc-900 py-16 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto space-y-8 select-none">
          {/* Social connections (Static premium labels) */}
          <div className="text-zinc-550 hover:text-zinc-300 text-xs font-semibold cursor-default">
            Questions? Contact developer support at dominicktompkins13@gmail.com
          </div>

          {/* Core lists */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-zinc-550">
            <div className="space-y-2.5">
              <a href="#faq" className="block hover:underline">FAQ</a>
              <a href="#terms" className="block hover:underline">Investor Relations</a>
              <a href="#privacy" className="block hover:underline">Privacy Policy</a>
              <a href="#speed" className="block hover:underline">Speed Test</a>
            </div>
            <div className="space-y-2.5">
              <a href="#help" className="block hover:underline">Help Center</a>
              <a href="#jobs" className="block hover:underline">Jobs Opportunities</a>
              <a href="#cookies" className="block hover:underline font-bold">Cookie Preferences</a>
              <a href="#legal" className="block hover:underline">Legal Notices</a>
            </div>
            <div className="space-y-2.5">
              <a href="#account" className="block hover:underline font-bold">Mock Account</a>
              <a href="#shop" className="block hover:underline">Netflix Shop</a>
              <a href="#corp" className="block hover:underline">Corporate Information</a>
              <a href="#originals" className="block hover:underline text-red-500 font-extrabold">Originals Hub</a>
            </div>
            <div className="space-y-2.5">
              <a href="#media" className="block hover:underline">Media Center</a>
              <a href="#redeem" className="block hover:underline">Redeem Gift Cards</a>
              <a href="#contact" className="block hover:underline">Contact Customer Care</a>
              <a href="#only" className="block hover:underline">Only on Streamify</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-zinc-900 text-xs text-zinc-650 gap-4">
            <p id="copyright-text">
              &copy; {new Date().getFullYear()} Netflix Hub Applet. Built for media simulation purposes. All embedded trailers are rights of respective producers.
            </p>
            <div className="flex items-center space-x-2 text-[10px] bg-red-650/15 text-red-500 border border-red-950 px-2.5 py-1 rounded-sm">
              <span>ACTIVE GUEST SERVICE PANEL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
