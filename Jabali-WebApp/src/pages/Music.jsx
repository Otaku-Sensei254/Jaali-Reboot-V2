// src/pages/Music.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useChild } from '../Components/Context/useChild';
import { 
  FaPlay, 
  FaPause, 
  FaVolumeUp, 
  FaVolumeMute, 
  FaHeart, 
  FaRegHeart,
  FaMusic,
  FaHeadphones,
  FaSearch,
  FaSpinner
} from 'react-icons/fa';
import { GiViolin, GiPianoKeys, GiHarp } from 'react-icons/gi';
import { IoMdLeaf } from 'react-icons/io';
import '../styles/music.css';
const Music = () => {
  const { selectedChild } = useChild();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedMood, setSelectedMood] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  // Music categories and moods
  const moods = [
    { id: 'all', name: 'All Moods', icon: '🎵', color: 'var(--primary)' },
    { id: 'calm', name: 'Calm & Peaceful', icon: '😌', color: 'var(--success)' },
    { id: 'sleep', name: 'Sleep & Relax', icon: '😴', color: 'var(--info)' },
    { id: 'focus', name: 'Focus & Study', icon: '🎯', color: 'var(--warning)' },
    { id: 'happy', name: 'Happy & Playful', icon: '😊', color: 'var(--pink)' },
    { id: 'nature', name: 'Nature Sounds', icon: '🌿', color: 'var(--teal)' }
  ];

  // Soothing music tracks for children - using your local audio files
  const musicTracks = [
    {
      id: 1,
      title: "Twinkle Twinkle Little Star",
      artist: "Lullaby Classics",
      duration: "2:12",
      mood: "sleep",
      category: "lullaby",
      audioUrl: "/audio/twinkle.mp3",
      coverArt: "🎵",
      color: "var(--red)",
      description: "Gentle piano version of the classic lullaby",
      bpm: 60,
      instruments: ["piano", "strings"]
    },
    {
      id: 2,
      title: "Gentle Ocean Waves",
      artist: "Nature Sounds",
      duration: "3:13",
      mood: "calm",
      category: "nature",
      audioUrl: "/audio/waves.mp3",
      coverArt: "🌊",
      color: "var(--teal)",
      description: "Soothing ocean waves for relaxation",
      bpm: 50,
      instruments: ["nature"]
    },
    {
      id: 3,
      title: "Moonlight Sonata",
      artist: "Beethoven",
      duration: "7:24",
      mood: "focus",
      category: "classical",
      audioUrl: "/audio/moonlight.mp3",
      coverArt: "🌙",
      color: "var(--blue)",
      description: "Calming classical piece for concentration",
      bpm: 65,
      instruments: ["piano"]
    },
    {
      id: 4,
      title: "Forest Whisper",
      artist: "Nature Sounds",
      duration: "4:07",
      mood: "nature",
      category: "nature",
      audioUrl: "/audio/forest.mp3",
      coverArt: "🌲",
      color: "var(--green)",
      description: "Gentle forest sounds with bird songs",
      bpm: 55,
      instruments: ["nature"]
    },
    {
      id: 5,
      title: "Brahms' Lullaby",
      artist: "Classical Lullabies",
      duration: "1:57",
      mood: "sleep",
      category: "lullaby",
      audioUrl: "/audio/lullaby.mp3",
      coverArt: "🎶",
      color: "var(--yellow)",
      description: "Soothing violin and piano lullaby",
      bpm: 58,
      instruments: ["violin", "piano"]
    },
    {
      id: 6,
      title: "Celestial Harp",
      artist: "Healing Sounds",
      duration: "2:44",
      mood: "calm",
      category: "ambient",
      audioUrl: "/audio/harp2.mp3",
      coverArt: "✨",
      color: "var(--purple)",
      description: "Ethereal harp music for deep relaxation",
      bpm: 62,
      instruments: ["harp", "strings"]
    },
    {
      id: 7,
      title: "Rainfall Meditation",
      artist: "Nature Sounds",
      duration: "00:58",
      mood: "calm",
      category: "nature",
      audioUrl: "/audio/rain.mp3",
      coverArt: "🌧️",
      color: "var(--indigo)",
      description: "Gentle rainfall for meditation and sleep",
      bpm: 48,
      instruments: ["nature"]
    },
    {
      id: 8,
      title: "Happy Little Tune",
      artist: "Children's Music",
      duration: "2:41",
      mood: "happy",
      category: "children",
      audioUrl: "/audio/hype.mp3",
      coverArt: "🎪",
      color: "var(--pink)",
      description: "Playful melody for happy moments",
      bpm: 85,
      instruments: ["xylophone", "flute"]
    }
  ];

  // Initialize audio
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = (e) => {
      console.error('Audio error:', e);
      setIsLoading(false);
      setIsPlaying(false);
      alert('Error loading audio. Please check if the audio file exists.');
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  // Update audio when currentTrack changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const audio = audioRef.current;
      audio.src = currentTrack.audioUrl;
    }
  }, [currentTrack]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle mute changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Filter tracks based on mood and search
  const filteredTracks = musicTracks.filter(track => {
    const moodMatch = selectedMood === 'all' || track.mood === selectedMood;
    const searchMatch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       track.description.toLowerCase().includes(searchQuery.toLowerCase());
    return moodMatch && searchMatch;
  });

  // Play/Pause functionality
  const togglePlayPause = async (track = null) => {
    if (track && track !== currentTrack) {
      setCurrentTrack(track);
      setIsLoading(true);
      setIsPlaying(true);
    } else if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Toggle favorite
  const toggleFavorite = (trackId, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(trackId)) {
        newFavorites.delete(trackId);
      } else {
        newFavorites.add(trackId);
      }
      return newFavorites;
    });
  };

  // Format time
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (!audioRef.current || !duration) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Get instrument icons
  const getInstrumentIcon = (instrument) => {
    switch (instrument) {
      case 'piano': return <GiPianoKeys />;
      case 'violin': return <GiViolin />;
      case 'harp': return <GiHarp />;
      case 'nature': return <IoMdLeaf />;
      default: return <FaMusic />;
    }
  };

  // Get mood icon
  const getMoodIcon = (moodId) => {
    const mood = moods.find(m => m.id === moodId);
    return mood ? mood.icon : '🎵';
  };

  return (
    <div className="music-container">
      {/* Header Section */}
      <div className="music-header">
        <div className="header-content">
          <h1>Soothing Melodies</h1>
          {selectedChild ? (
            <p className="welcome-message">
              Hello {selectedChild.name}! Let's find some calming music for you.
            </p>
          ) : (
            <p className="welcome-message">
              Discover calming music and sounds for relaxation and focus.
            </p>
          )}
        </div>
        <div className="header-stats">
          <div className="stat">
            <FaHeadphones />
            <span>{filteredTracks.length} Tracks</span>
          </div>
          <div className="stat">
            <FaHeart />
            <span>{favorites.size} Favorites</span>
          </div>
        </div>
      </div>

      {/* Mood Filters */}
      <div className="mood-filters">
        <h2>Choose Your Mood</h2>
        <div className="mood-grid">
          {moods.map(mood => (
            <button
              key={mood.id}
              className={`mood-btn ${selectedMood === mood.id ? 'active' : ''}`}
              onClick={() => setSelectedMood(mood.id)}
              style={{ '--mood-color': mood.color }}
            >
              <span className="mood-icon">{mood.icon}</span>
              <span className="mood-name">{mood.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for music, artists, or sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Music Grid */}
      <div className="music-grid">
        {filteredTracks.map(track => (
          <div
            key={track.id}
            className={`music-card ${currentTrack?.id === track.id ? 'active' : ''} ${
              favorites.has(track.id) ? 'favorite' : ''
            }`}
            onClick={() => togglePlayPause(track)}
          >
            <div 
              className="cover-art"
              style={{ backgroundColor: track.color }}
            >
              <span className="cover-icon">{track.coverArt}</span>
              <div className="play-overlay">
                {isLoading && currentTrack?.id === track.id ? (
                  <FaSpinner className="play-icon spinning" />
                ) : currentTrack?.id === track.id && isPlaying ? (
                  <FaPause className="play-icon" />
                ) : (
                  <FaPlay className="play-icon" />
                )}
              </div>
            </div>

            <div className="track-info">
              <h3 className="track-title">{track.title}</h3>
              <p className="track-artist">{track.artist}</p>
              <p className="track-description">{track.description}</p>
              
              <div className="track-meta">
                <span className="duration">
                  <FaMusic /> {track.duration}
                </span>
                <span className="bpm">♫ {track.bpm} BPM</span>
              </div>

              <div className="track-tags">
                <span className="mood-tag">
                  {getMoodIcon(track.mood)} {moods.find(m => m.id === track.mood)?.name}
                </span>
                <div className="instruments">
                  {track.instruments.map((instrument, index) => (
                    <span key={index} className="instrument-tag">
                      {getInstrumentIcon(instrument)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="favorite-btn"
              onClick={(e) => toggleFavorite(track.id, e)}
              title={favorites.has(track.id) ? "Remove from favorites" : "Add to favorites"}
            >
              {favorites.has(track.id) ? (
                <FaHeart className="favorite-icon" />
              ) : (
                <FaRegHeart className="favorite-icon" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Now Playing Bar */}
      {currentTrack && (
        <div className="now-playing-bar">
          <div className="now-playing-content">
            <div className="track-display">
              <div 
                className="current-cover"
                style={{ backgroundColor: currentTrack.color }}
              >
                {currentTrack.coverArt}
              </div>
              <div className="track-details">
                <h4 className="current-title">{currentTrack.title}</h4>
                <p className="current-artist">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="player-controls">
              <button
                className="control-btn"
                onClick={() => togglePlayPause()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <FaSpinner className="spinning" />
                ) : isPlaying ? (
                  <FaPause />
                ) : (
                  <FaPlay />
                )}
              </button>
            </div>

            <div className="progress-section">
              <span className="current-time">{formatTime(currentTime)}</span>
              <div 
                className="progress-bar"
                onClick={handleProgressClick}
              >
                <div 
                  className="progress-fill" 
                  style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                ></div>
              </div>
              <span className="total-time">{formatTime(duration)}</span>
            </div>

            <div className="volume-controls">
              <button
                className="volume-btn"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredTracks.length === 0 && (
        <div className="no-results">
          <FaMusic className="no-results-icon" />
          <h3>No music found</h3>
          <p>Try adjusting your search or mood filter</p>
        </div>
      )}

      {/* Quick Play Sections */}
      <div className="quick-sections">
        <div className="section">
          <h3>🌙 Bedtime Lullabies</h3>
          <div className="quick-tracks">
            {musicTracks
              .filter(track => track.mood === 'sleep')
              .slice(0, 3)
              .map(track => (
                <div
                  key={track.id}
                  className="quick-track"
                  onClick={() => togglePlayPause(track)}
                >
                  <span className="quick-cover" style={{ backgroundColor: track.color }}>
                    {track.coverArt}
                  </span>
                  <div className="quick-info">
                    <span className="quick-title">{track.title}</span>
                    <span className="quick-artist">{track.artist}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="section">
          <h3>🎯 Focus & Study</h3>
          <div className="quick-tracks">
            {musicTracks
              .filter(track => track.mood === 'focus')
              .slice(0, 3)
              .map(track => (
                <div
                  key={track.id}
                  className="quick-track"
                  onClick={() => togglePlayPause(track)}
                >
                  <span className="quick-cover" style={{ backgroundColor: track.color }}>
                    {track.coverArt}
                  </span>
                  <div className="quick-info">
                    <span className="quick-title">{track.title}</span>
                    <span className="quick-artist">{track.artist}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Music;
