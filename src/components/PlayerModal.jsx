import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Heart, Film, MonitorPlay, ListOrdered, Calendar, Sparkles } from 'lucide-react';

export default function PlayerModal({
  movie,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  initialPlayMode = false,
}) {
  const [activeSeason, setActiveSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [currentIframeUrl, setCurrentIframeUrl] = useState('');
  const playerRef = useRef(null);

  useEffect(() => {
    if (movie) {
      if (movie.type === 'series' && movie.seasons && movie.seasons.length > 0) {
        // Set first season and first episode of that season by default
        const firstSeason = movie.seasons[0];
        setActiveSeason(firstSeason.seasonNumber);
        if (firstSeason.episodes && firstSeason.episodes.length > 0) {
          const firstEpisode = firstSeason.episodes[0];
          setCurrentEpisode(firstEpisode);
          setCurrentIframeUrl(firstEpisode.iframeUrl);
        }
      } else {
        // Simple movie/trailer has its own direct iframeUrl
        setCurrentEpisode(null);
        setCurrentIframeUrl(movie.iframeUrl || '');
      }
    }
  }, [movie]);

  if (!isOpen || !movie) return null;

  // Handle season changes
  const handleSeasonSelect = (seasonNum) => {
    setActiveSeason(seasonNum);
    const seasonData = movie.seasons?.find((s) => s.seasonNumber === seasonNum);
    if (seasonData && seasonData.episodes && seasonData.episodes.length > 0) {
      const firstEp = seasonData.episodes[0];
      setCurrentEpisode(firstEp);
      setCurrentIframeUrl(firstEp.iframeUrl);
      
      // Auto scroll back to player for immediate feedback
      playerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle episode select in TV Show/Anime
  const handleEpisodeSelect = (episode) => {
    setCurrentEpisode(episode);
    setCurrentIframeUrl(episode.iframeUrl);
    
    // Auto scroll back to player
    playerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      id="modal-root"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 md:p-6 select-none animate-fade-in"
    >
      {/* Container Card */}
      <div
        id="modal-card"
        className="relative bg-[#141414] w-full max-w-5xl rounded-sm overflow-hidden border border-zinc-800 shadow-2xl shadow-black flex flex-col max-h-[92vh]"
      >
        {/* Dynamic Header Close action */}
        <button
          id="modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/85 hover:bg-[#E50914] text-white p-2.5 rounded-full border border-zinc-700 transition-colors focus:outline-none cursor-pointer"
          title="Close Screen"
        >
          <X size={20} />
        </button>

        {/* Video Player Display Screen */}
        <div ref={playerRef} id="cinema-screen" className="relative w-full aspect-video bg-black border-b border-zinc-900">
          {currentIframeUrl ? (
            <iframe
              id="player-iframe"
              src={currentIframeUrl}
              title={movie.title}
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-zinc-900">
              <Film size={48} className="text-zinc-600 mb-3 animate-pulse" />
              <p className="text-zinc-400 font-medium">No playable video template embedded in JSON.</p>
            </div>
          )}

          {/* Now Playing HUD status banner */}
          <div className="absolute bottom-3 left-3 bg-black/90 backdrop-blur-md px-3.5 py-1.5 rounded-sm border border-zinc-800 text-xs text-zinc-300 pointer-events-none flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#E50914] animate-ping" />
            <span className="font-extrabold text-white uppercase tracking-wider text-[10px] bg-[#E50914]/30 px-1.5 py-0.2 rounded-sm border border-[#E50914]/20">
              {movie.category === 'tv-show' ? 'Playing S' + activeSeason + ':E' + (currentEpisode?.episodeNumber ?? 1) : 'NOW PLAYING'}
            </span>
            <span className="text-zinc-400">|</span>
            <span className="font-semibold text-zinc-200 truncate max-w-[200px]">
              {movie.type === 'series' && currentEpisode ? currentEpisode.title : movie.title}
            </span>
          </div>
        </div>

        {/* Details and Episodes Scrollable Drawer Section */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 bg-gradient-to-b from-[#141414] to-[#111] scrollbar-thin scrollbar-thumb-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left col: Core Meta Description (2/3 width on desktop) */}
            <div className="md:col-span-2 space-y-5">
              {/* Head Meta badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-green-400 font-black text-sm bg-green-950/40 px-2.5 py-1 rounded border border-green-900/30">
                  {Math.round(parseFloat(movie.rating) * 10)}% Match
                </span>
                
                <span className="text-zinc-350 text-xs sm:text-sm font-semibold flex items-center space-x-1 bg-[#1c1c1c] px-2.5 py-1 rounded-sm border border-zinc-800">
                  <Calendar size={14} className="text-zinc-500" />
                  <span>{movie.releaseYear}</span>
                </span>

                <span className="text-zinc-350 text-xs sm:text-sm font-semibold flex items-center space-x-1 bg-[#1c1c1c] px-2.5 py-1 rounded-sm border border-zinc-800">
                  <MonitorPlay size={14} className="text-zinc-500" />
                  <span>{movie.duration}</span>
                </span>

                <span className="border border-zinc-705 px-2 py-0.5 text-xs text-zinc-300 font-black rounded-sm uppercase">
                  TV-MA
                </span>

                <span className="bg-[#E50914]/10 text-[#E50914] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm border border-[#E50914]/20">
                  {movie.category.replace('-', ' ')}
                </span>
              </div>

              {/* Title heading */}
              <h2 id="modal-movie-title" className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {movie.title}
              </h2>

              {/* Description body */}
              <p className="text-zinc-350 text-sm sm:text-base leading-relaxed font-medium">
                {movie.description}
              </p>

              {/* Action Buttons list (Favorite toggle / Share indicator) */}
              <div className="flex items-center space-x-4 pt-2">
                <button
                  id="modal-favorite-toggle"
                  onClick={() => onToggleFavorite(movie)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-sm border font-bold text-sm transition-all cursor-pointer ${
                    isFavorite
                      ? 'bg-[#E50914] text-white border-[#E50914] hover:bg-red-700 hover:shadow-lg'
                      : 'bg-[#222] text-zinc-300 border-[#333] hover:border-zinc-650 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'scale-110' : ''} />
                  <span>{isFavorite ? 'In My List' : 'Add to My List'}</span>
                </button>

                <div className="text-xs text-zinc-500 flex items-center space-x-1 border border-[#222] px-3 py-2 rounded">
                  <Sparkles size={12} className="text-[#E50914]" />
                  <span>Simulated Stream Connection</span>
                </div>
              </div>

              {/* Genres list */}
              <div className="space-y-1.5 pt-3">
                <h4 className="text-xs uppercase tracking-widest font-black text-zinc-500">Genres</h4>
                <div className="flex flex-wrap gap-1.5">
                  {movie.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="text-xs bg-[#222]/80 text-zinc-400 px-3 py-1 rounded-sm border border-zinc-800"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right col: Season & Episode Selections if Series (1/3 width) */}
            <div className="md:col-span-1 space-y-6">
              {movie.type === 'series' && movie.seasons && movie.seasons.length > 0 ? (
                <div className="space-y-4">
                  {/* Title of navigation */}
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                    <ListOrdered size={18} className="text-[#E50914]" />
                    <h3 className="text-sm uppercase tracking-wider font-extrabold text-zinc-300">
                      Season & Episode Selection
                    </h3>
                  </div>

                  {/* Season Buttons Selector Row */}
                  <div id="seasons-selector-container" className="space-y-2">
                    <label className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest">Choose Season</label>
                    <div className="flex flex-wrap gap-2">
                      {movie.seasons.map((season) => (
                        <button
                          key={season.seasonNumber}
                          id={`season-btn-${season.seasonNumber}`}
                          onClick={() => handleSeasonSelect(season.seasonNumber)}
                          className={`px-3.5 py-1.5 rounded-sm font-extrabold text-xs transition-all cursor-pointer ${
                            activeSeason === season.seasonNumber
                              ? 'bg-[#E50914] text-white shadow-md border border-[#E50914]/50'
                              : 'bg-[#222] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                          }`}
                        >
                          Season {season.seasonNumber}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Episode List Container */}
                  <div id="episodes-list-container" className="space-y-2 mt-4 pt-1">
                    <label className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block">
                      Choose Episode ({movie.seasons.find((s) => s.seasonNumber === activeSeason)?.episodes.length || 0})
                    </label>
                    
                    <div className="space-y-2 overflow-y-auto max-h-[220px] rounded-sm border border-zinc-800 p-2 bg-[#121212]/80 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                      {movie.seasons
                        .find((s) => s.seasonNumber === activeSeason)
                        ?.episodes.map((episode) => {
                          const isNowPlaying = currentEpisode?.episodeNumber === episode.episodeNumber;
                          return (
                            <button
                              key={episode.episodeNumber}
                              id={`episode-btn-s${activeSeason}-e${episode.episodeNumber}`}
                              onClick={() => handleEpisodeSelect(episode)}
                              className={`w-full flex items-center justify-between p-2.5 rounded-sm text-left transition-all text-xs cursor-pointer ${
                                isNowPlaying
                                  ? 'bg-[#E50914]/15 hover:bg-[#E50914]/20 border border-[#E50914]/40 text-white font-bold'
                                  : 'bg-[#1c1c1c]/90 hover:bg-[#252525] border border-zinc-900 text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              <div className="flex items-center space-x-3 overflow-hidden">
                                <span className={`font-black tracking-wide shrink-0 ${isNowPlaying ? 'text-[#E50914]' : 'text-zinc-550'}`}>
                                  {episode.episodeNumber < 10 ? `0${episode.episodeNumber}` : episode.episodeNumber}
                                </span>
                                <span className="font-semibold truncate pr-2">{episode.title}</span>
                              </div>
                              <div className="shrink-0">
                                {isNowPlaying ? (
                                  <span className="text-[9px] bg-[#E50914]/30 border border-[#E50914]/40 text-red-400 px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-wider animate-pulse">
                                    LIVE
                                  </span>
                                ) : (
                                  <Play size={12} fill="currentColor" className="text-zinc-500 group-hover:text-white" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#222]/45 p-4 rounded-sm border border-zinc-800 text-center space-y-2.5">
                  <Film size={28} className="text-zinc-700 mx-auto" />
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Single Direct Play</h4>
                  <p className="text-zinc-550 text-xs leading-relaxed">
                    This selection is structured format as a full cinematic movie release or trailer preview and does not contain segmented episodic parts.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
