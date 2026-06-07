import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function MediaRow({
  title,
  movies,
  onSelect,
  onPlay,
  favorites,
  onToggleFavorite,
}) {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  if (!movies || movies.length === 0) return null;

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction) => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const row = rowRef.current;
    if (row) {
      row.addEventListener('scroll', handleScroll);
      // Run once on load to see if scrolling applies
      handleScroll();
    }
    return () => {
      if (row) {
        row.removeEventListener('scroll', handleScroll);
      }
    };
  }, [movies]);

  return (
    <div id={`row-section-${title.replace(/\s+/g, '-').toLowerCase()}`} className="relative space-y-2 px-4 md:px-8 py-4 group/row select-none">
      {/* Category Row Header */}
      <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight hover:text-red-500 transition-colors w-max cursor-pointer">
        {title} <span className="text-zinc-500 text-xs font-normal ml-2">Browse All &rarr;</span>
      </h2>

      {/* Row Inner Wrapper with custom buttons */}
      <div className="relative">
        {/* Left Scroll Navigation button */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[70%] w-10 sm:w-12 bg-black/80 hover:bg-black/95 text-white flex items-center justify-center z-40 rounded-r-lg opacity-0 group-hover/row:opacity-100 transition-opacity duration-350 border-y border-r border-zinc-800 cursor-pointer"
          >
            <ChevronLeft size={28} className="hover:scale-125 transition-transform" />
          </button>
        )}

        {/* Horizontal Container scroll */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-none scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelect}
              onPlay={onPlay}
              isFavorite={favorites.includes(movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>

        {/* Right Scroll Navigation button */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 h-[70%] w-10 sm:w-12 bg-black/80 hover:bg-black/95 text-white flex items-center justify-center z-40 rounded-l-lg opacity-0 group-hover/row:opacity-100 transition-opacity duration-350 border-y border-l border-zinc-800 cursor-pointer"
          >
            <ChevronRight size={28} className="hover:scale-125 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
