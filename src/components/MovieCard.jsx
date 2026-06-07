import React from 'react';
import { Play, Plus, Check } from 'lucide-react';

export default function MovieCard({
  movie,
  onSelect,
  onPlay,
  isFavorite,
  onToggleFavorite,
}) {
  return (
    <div
      id={`card-${movie.id}`}
      className="group relative flex-none w-[160px] sm:w-[200px] md:w-[240px] aspect-[2/3] sm:aspect-video rounded-sm overflow-hidden bg-[#222] cursor-pointer shadow-md scroll-snap-align-start select-none transition-all duration-300 hover:scale-105 hover:z-30 hover:shadow-2xl hover:shadow-black/70"
    >
      {/* Media Image Backdrop (Preferred for wide card style, or poster falls back) */}
      <img
        src={window.innerWidth > 640 && movie.backdropUrl ? movie.backdropUrl : movie.posterUrl}
        alt={movie.title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 rounded-sm"
      />

      {/* Dark overlay that appears on hover with strict Sleek interface color specs */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/85 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3 sm:p-4">
        {/* Play Action Badge overlay */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {/* Play Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(movie);
              }}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-115 active:scale-90 transition-transform"
              title="Play Now"
            >
              <Play size={15} fill="currentColor" className="ml-0.5 fill-black text-black" />
            </button>

            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(movie);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                isFavorite
                  ? 'bg-[#E50914] text-white border-[#E50914]'
                  : 'bg-black/60 text-white border-zinc-500 hover:border-white hover:bg-zinc-800'
              }`}
              title={isFavorite ? 'Remove from My List' : 'Add to My List'}
            >
              {isFavorite ? <Check size={14} className="stroke-[3]" /> : <Plus size={14} />}
            </button>
          </div>

          {/* Details / More Info Trigger */}
          <button
            onClick={() => onSelect(movie)}
            className="text-[10px] uppercase font-bold bg-[#333] hover:bg-[#444] text-white px-2.5 py-1 rounded-sm border border-zinc-700"
          >
            Info
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm md:text-base font-black text-white mb-1.5 line-clamp-1">
          {movie.title}
        </h3>

        {/* Metadata section row */}
        <div className="flex items-center space-x-2 text-[10px] md:text-xs text-zinc-350 font-semibold">
          <span className="text-green-400 font-extrabold">{Math.round(parseFloat(movie.rating) * 10)}% Match</span>
          <span>•</span>
          <span>{movie.releaseYear}</span>
          <span>•</span>
          <span className="text-[9px] bg-[#222] px-1.5 py-0.2 rounded-sm border border-zinc-800 uppercase font-black tracking-widest text-[#E50914]">
            {movie.category === 'tv-show' ? 'TV' : movie.category}
          </span>
        </div>
      </div>

      {/* Static Info Label for Mobile or Non-hover display details */}
      <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded-sm text-[9px] font-black text-[#E50914] uppercase tracking-widest pointer-events-none group-hover:opacity-0 transition-opacity">
        {movie.category === 'tv-show' ? 'Series' : movie.category}
      </div>
    </div>
  );
}
