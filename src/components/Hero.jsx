import React from 'react';
import { Play, Info, Plus, Check } from 'lucide-react';

export default function Hero({
  movie,
  onPlay,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) {
  if (!movie) return null;

  // Render a simulated match statistic based on the JSON item rating
  const matchPercentage = Math.round(parseFloat(movie.rating) * 10);

  return (
    <div
      id="hero-banner"
      className="relative h-[72vh] md:h-[85vh] w-full flex items-center justify-start overflow-hidden bg-[#141414] select-none"
    >
      {/* Background Cinematic image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.55] transition-all duration-1000"
        />
        {/* Cinematic gradient vignette overlays for a realistic dark theater look synced with theme */}
        <div 
          className="absolute inset-0 z-10" 
          style={{
            backgroundImage: 'linear-gradient(to right, #141414 12%, rgba(20,20,20,0.45) 55%, transparent 85%), linear-gradient(to top, #141414 6%, rgba(20,20,20,0.1) 40%, transparent 90%)'
          }}
        />
      </div>

      {/* Hero content container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-start pt-[90px] md:pt-[110px]">
        {/* Categories/Rating Badge */}
        <div className="flex items-center space-x-3 mb-3 md:mb-4 animate-fade-in text-xs sm:text-sm">
          <span className="text-red-500 uppercase tracking-[0.2em] font-extrabold text-[10px] md:text-xs">
            NETFLIX ORIGINAL {movie.category.toUpperCase().replace('-', ' ')}
          </span>
          <span className="text-zinc-400 font-bold">•</span>
          <span className="text-green-400 font-extrabold">{matchPercentage}% Match</span>
          <span className="text-zinc-300 font-medium">{movie.releaseYear}</span>
          <span className="border border-zinc-600 px-1.5 py-0.2 text-[10px] text-zinc-300 font-bold rounded">TV-MA</span>
          <span className="bg-zinc-800/60 text-zinc-300 px-2 py-0.5 text-xs rounded font-medium">{movie.duration}</span>
        </div>

        {/* Dynamic Title */}
        <h1
          id="hero-title"
          className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-4 max-w-xl md:max-w-3xl drop-shadow-lg"
        >
          {movie.title.toUpperCase()}
        </h1>

        {/* Dynamic description */}
        <p className="text-[#e5e5e5] text-sm sm:text-base md:text-lg leading-relaxed mb-6 max-w-lg md:max-w-2xl text-shadow font-medium">
          {movie.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {movie.genres.map((genre, index) => (
            <span
              key={index}
              className="text-xs bg-[#2f2f2f]/80 backdrop-blur-sm text-zinc-200 font-semibold px-3.5 py-1 rounded-sm border border-zinc-800"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            id="hero-play-btn"
            onClick={() => onPlay(movie)}
            className="flex items-center space-x-2 bg-white hover:bg-white/90 active:scale-95 text-black font-extrabold px-6 sm:px-8 py-3 rounded shadow-lg transition-all duration-205 cursor-pointer text-sm sm:text-base"
          >
            <Play size={22} fill="currentColor" className="fill-black text-black" />
            <span>Play</span>
          </button>

          <button
            id="hero-info-btn"
            onClick={() => onSelect(movie)}
            className="flex items-center space-x-2 bg-zinc-500/75 hover:bg-zinc-500/55 active:scale-95 text-white font-bold px-5 sm:px-7 py-3 rounded backdrop-blur-md border border-zinc-600/30 transition-all duration-205 cursor-pointer text-sm sm:text-base"
          >
            <Info size={22} />
            <span>More Info</span>
          </button>

          <button
            id="hero-mylist-btn"
            onClick={() => onToggleFavorite(movie)}
            className={`p-3 rounded border transition-all duration-200 cursor-pointer ${
              isFavorite
                ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                : 'bg-black/40 text-zinc-200 border-zinc-650 hover:bg-white/10'
            }`}
            title={isFavorite ? 'Remove from My List' : 'Add to My List'}
          >
            {isFavorite ? <Check size={22} className="stroke-[3]" /> : <Plus size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
}
