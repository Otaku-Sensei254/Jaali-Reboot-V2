// src/pages/Learning.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useChild } from '../Components/Context/useChild';
import { FaPlay, FaClock, FaBook, FaFilter, FaYoutube, FaSpinner } from 'react-icons/fa';
// import { MdOndemandVideo } from 'react-icons/md';
import { getMultipleVideoDetails, getVideoDetails } from '../Components/services/YTservice';
import StoryBook from '../Components/StoryBook/StoryBook';
import '../styles/learning.css';
import '../styles/storybook.css';

const Learning = () => {
  const { selectedChild } = useChild();
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [learningModules, setLearningModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Learning levels and categories
  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'math', name: 'Math', icon: '🔢' },
    { id: 'communication', name: 'Communication', icon: '💬' },
    { id: 'social', name: 'Social Skills', icon: '👥' },
    { id: 'visual', name: 'Visual Learning', icon: '👀' },
    { id: 'nature', name: 'Nature', icon: '🌿' },
    { id: 'language', name: 'Language', icon: '📚' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'stories', name: 'Interactive Stories', icon: '📖' }
  ];

  // Base module data with YouTube video IDs only
  const baseModules = useMemo(() => [
    {
      id: 1,
      level: "beginner",
      category: "math",
      videoId: "WWNlgvtYcEs",
      tags: ["numbers", "animals", "counting"],
      source: "youtube"
    },
    {
      id: 2,
      level: "intemediate",
      category: "math",
      videoId: "KSU-u8K5D84",
      tags: ["numbers", "animals"],
      source: "Ubongo kids"
    },
    {
      id: 3,
      level: "beginner",
      category: "social",
      videoId: "KFYtydkOLhs",
      tags: ["hygine", "grooming", "health"],
      source: "youtube"
    },
    {
      id: 4,
      level: "beginner",
      category: "visual",
      videoId: "NGzBZhLHn_w",
      tags: ["colors", "shapes", "visual"],
      source: "youtube"
    },
    {
      id: 5,
      level: "intermediate",
      category: "math",
      videoId: "aya6NOyVo3g",
      tags: ["addition", "math", "numbers"],
      source: "youtube"
    },
    {
      id: 6,
      level: "intermediate",
      category: "social",
      videoId: "IcUR8NxLdG4",
      tags: ["friendship", "sharing", "social"],
      source: "youtube"
    },
    {
      id: 7,
      level: "intermediate",
      category: "nature",
      videoId: "hewioIU4a64",
      tags: ["nature", "animals", "plants"],
      source: "youtube"
    },
    {
      id: 8,
      level: "intermediate",
      category: "language",
      videoId: "hQ1OwYu4GsY",
      tags: ["sentences", "language", "grammar"],
      source: "youtube"
    },
    {
      id: 9,
      level: "intermediate",
      category: "social",
      videoId: "pk9nLHZ4hdY",
      tags: ["Africa" ,"language", "nation"]
    },
    {
      id: 10,
      level: "intermediate",
      category: "science",
      videoId: "7men-dqc5is",
      tags: ["science", "experiments", "fun"],
      source: "youtube"
    },
      {
      id: 11,
      level: "beginner",
      category: "visual",
      videoId: "r5sxueS4egc",
      tags: ["science", "hygine", "fun"],
      source: "youtube"
    },
  ], []);

  // Fetch video details on component mount
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const videoIds = baseModules.map(module => module.videoId);
        const videoDetails = await getMultipleVideoDetails(videoIds);
        
        // Merge base module data with fetched YouTube details
        const updatedModules = baseModules.map((module, index) => {
          const details = videoDetails.find(detail => detail?.videoId === module.videoId);
          
          if (!details) {
            // Fallback if no details found
            return {
              ...module,
              title: `Learning Video ${module.id}`,
              description: "Educational content for children",
              duration: '0:00',
              thumbnail: `https://img.youtube.com/vi/${module.videoId}/mqdefault.jpg`,
              channelTitle: 'YouTube'
            };
          }
          
          return {
            ...module,
            title: details.title || `Learning Video ${module.id}`,
            description: details.description || "Educational content for children",
            duration: details.duration || '0:00',
            thumbnail: details.thumbnail || `https://img.youtube.com/vi/${module.videoId}/mqdefault.jpg`,
            channelTitle: details.channelTitle || 'YouTube'
          };
        });
        
        setLearningModules(updatedModules);
      } catch (err) {
        setError('Failed to load video details. Using default data.');
        console.error('Error fetching video details:', err);
        
        // Fallback to base modules with default data
        const fallbackModules = baseModules.map(module => ({
          ...module,
          title: `Learning Video ${module.id}`,
          description: "Educational content for children - loading...",
          duration: 'Loading...',
          thumbnail: `https://img.youtube.com/vi/${module.videoId}/mqdefault.jpg`,
          channelTitle: 'YouTube'
        }));
        
        setLearningModules(fallbackModules);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [baseModules]);

  // Refresh single video details
  const refreshVideoDetails = async (videoId) => {
    try {
      const details = await getVideoDetails(videoId);
      if (details) {
        setLearningModules(prev => prev.map(module => 
          module.videoId === videoId 
            ? { 
                ...module, 
                title: details.title || module.title,
                description: details.description || module.description,
                duration: details.duration || module.duration,
                thumbnail: details.thumbnail || module.thumbnail,
                channelTitle: details.channelTitle || module.channelTitle
              }
            : module
        ));
      }
    } catch (error) {
      console.error('Error refreshing video details:', error);
    }
  };

  const filteredModules = learningModules.filter(module => {
    const levelMatch = selectedLevel === 'all' || module.level === selectedLevel;
    const categoryMatch = selectedCategory === 'all' || module.category === selectedCategory;
    return levelMatch && categoryMatch;
  });

  const handlePlayVideo = (module) => {
    setSelectedVideo(module);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <div className="learning-container">
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <h3>Loading learning content...</h3>
          <p>Fetching the latest video information from YouTube</p>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-container">
      {/* Header and Filters */}
      <div className="learning-header">
        <h1>Learning Center</h1>
        {selectedChild ? (
          <p className="welcome-message">
            Welcome back, {selectedChild.name}! Let's continue learning about {selectedChild.interests?.[0] || 'new things'}.
          </p>
        ) : (
          <p className="welcome-message">
            Select a child profile to get personalized learning recommendations.
          </p>
        )}
        
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label><FaFilter /> Filter by Level:</label>
          <select 
            value={selectedLevel} 
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="filter-select"
          >
            {levels.map(level => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label><FaFilter /> Filter by Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Section */}
      {selectedCategory === 'stories' ? (
        <StoryBook />
      ) : (
        <div className="modules-grid">
          {filteredModules.map(module => {
          const category = categories.find(cat => cat.id === module.category);
          return (
            <div key={module.id} className="learning-module">
              <div className="module-thumbnail">
                <img 
                  src={module.thumbnail} 
                  alt={module.title}
                  className="thumbnail-image"
                  onError={(e) => {
                    // Fallback to YouTube default thumbnail
                    e.target.src = `https://img.youtube.com/vi/${module.videoId}/mqdefault.jpg`;
                  }}
                />
                <div className="play-overlay" onClick={() => handlePlayVideo(module)}>
                  <FaPlay className="play-icon" />
                </div>
                <div className="module-badge">
                  {category?.icon} {module.level}
                </div>
                <div className="youtube-badge">
                  <FaYoutube />
                </div>
                <div className="duration-badge">
                  <FaClock /> {module.duration}
                </div>
              </div>

              <div className="module-content">
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">
                  {module.description && module.description.length > 100 
                    ? `${module.description.substring(0, 100)}...` 
                    : module.description || "Educational content for children"
                  }
                </p>
                
                <div className="module-meta">
                  <span className="channel">
                    {module.channelTitle}
                  </span>
                  <span className="level-tag">{module.level}</span>
                </div>

                <div className="module-tags">
                  {module.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>

                <div className="module-actions">
                  <button 
                    className="play-btn"
                    onClick={() => handlePlayVideo(module)}
                  >
                    <FaPlay className="play-btn-icon" />
                    Watch Video
                  </button>

                  <button 
                    className="refresh-btn"
                    onClick={() => refreshVideoDetails(module.videoId)}
                    title="Refresh video info"
                  >
                    ↻
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="video-modal">
          <div className="modal-overlay" onClick={closeVideo}></div>
          <div className="video-modal-content">
            <button className="close-btn" onClick={closeVideo}>×</button>
            <h3>{selectedVideo.title}</h3>
            
            <div className="video-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="youtube-iframe"
              ></iframe>
            </div>
            
            <div className="video-info">
              <p>{selectedVideo.description}</p>
              <div className="video-meta">
                <span>Duration: {selectedVideo.duration}</span>
                <span>Channel: {selectedVideo.channelTitle}</span>
                <span>Level: {selectedVideo.level}</span>
                <span>Category: {categories.find(cat => cat.id === selectedVideo.category)?.name}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredModules.length === 0 && !loading && selectedCategory !== 'stories' && (
        <div className="no-results">
          <FaBook className="no-results-icon" />
          <h3>No learning modules found</h3>
          <p>Try adjusting your filters to see more content.</p>
        </div>
      )}
    </div>
  );
};

export default Learning;
