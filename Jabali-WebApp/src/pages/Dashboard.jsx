// src/pages/Dashboard.jsx
import React, { useState, useContext } from 'react';
import { ChildContext } from '../Components/Context/ChildContext';
import { 
  FaChartLine, 
  FaGamepad, 
  FaMusic, 
  FaVideo, 
  FaClock, 
  FaStar, 
  FaTrophy,
  FaChild,
  
} from 'react-icons/fa';
import { IoMdTrendingUp } from "react-icons/io";
import '../styles/dashboard.css';

const Dashboard = () => {
  const { childProfiles, selectedChild, setSelectedChild } = useContext(ChildContext);
  const [timeRange, setTimeRange] = useState('week'); // week, month, all
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in a real app, this would come from your backend
  const [childProgress] = useState({
    games: {
      totalPlayTime: 45, // minutes
      favoriteGame: 'Memory Match',
      gamesPlayed: 12,
      completionRate: '75%',
      recentActivity: [
        { game: 'Memory Match', duration: 15, date: '2024-01-15' },
        { game: 'Shape Puzzle', duration: 20, date: '2024-01-14' },
        { game: 'Color Therapy', duration: 10, date: '2024-01-13' }
      ]
    },
    music: {
      totalListenTime: 120, // minutes
      favoriteTrack: 'Twinkle Twinkle Little Star',
      tracksListened: 8,
      favoriteMood: 'Sleep & Relax',
      recentPlays: [
        { track: 'Twinkle Twinkle', mood: 'sleep', duration: 15 },
        { track: 'Ocean Waves', mood: 'calm', duration: 30 },
        { track: 'Happy Tune', mood: 'happy', duration: 5 }
      ]
    },
    learning: {
      videosWatched: 6,
      favoriteCategory: 'Math',
      totalWatchTime: 45,
      skillsDeveloped: ['Memory', 'Focus', 'Problem Solving'],
      recentVideos: [
        { title: 'Counting 1-10', category: 'math', duration: '5:22' },
        { title: 'Understanding Emotions', category: 'social', duration: '7:15' }
      ]
    },
    achievements: [
      { id: 1, title: 'Memory Master', description: 'Completed Memory Match 5 times', icon: '🏆', earned: true },
      { id: 2, title: 'Music Lover', description: 'Listened to 10 different tracks', icon: '🎵', earned: true },
      { id: 3, title: 'Puzzle Pro', description: 'Solved 10 puzzles', icon: '🧩', earned: false },
      { id: 4, title: 'Focus Champion', description: 'Focused for 30 minutes straight', icon: '🎯', earned: false }
    ]
  });

  // Calculate overall progress metrics
  const overallMetrics = {
    totalEngagement: childProgress.games.totalPlayTime + childProgress.music.totalListenTime + childProgress.learning.totalWatchTime,
    favoriteActivity: childProgress.games.totalPlayTime > childProgress.music.totalListenTime ? 'Games' : 'Music',
    dailyAverage: Math.round((childProgress.games.totalPlayTime + childProgress.music.totalListenTime) / 7),
    skillProgress: {
      memory: 75,
      focus: 60,
      creativity: 80,
      motor: 65
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'var(--success)';
    if (percentage >= 60) return 'var(--warning)';
    return 'var(--error)';
  };

  if (!selectedChild && childProfiles.length > 0) {
    setSelectedChild(childProfiles[0]);
  }

  if (childProfiles.length === 0) {
    return (
      <div className="dashboard-container">
        <div className="no-profiles-dashboard">
          <div className="no-profiles-icon">
            <FaChild />
          </div>
          <h2>Welcome to Your Dashboard</h2>
          <p>Create a child profile to start tracking progress and activities.</p>
          <button 
            className="create-profile-btn"
            onClick={() => window.location.href = '/profiles'}
          >
            Create Child Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>
            <FaChartLine /> Progress Dashboard
          </h1>
          <p>Track {selectedChild?.name}'s learning journey and activities</p>
        </div>
        <div className="header-controls">
          <select 
            value={selectedChild?.id || ''} 
            onChange={(e) => {
              const child = childProfiles.find(c => c.id === e.target.value);
              setSelectedChild(child);
            }}
            className="child-selector"
          >
            {childProfiles.map(child => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-selector"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <IoMdTrendingUp /> Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          <FaGamepad /> Games
        </button>
        <button 
          className={`tab-btn ${activeTab === 'music' ? 'active' : ''}`}
          onClick={() => setActiveTab('music')}
        >
          <FaMusic /> Music
        </button>
        <button 
          className={`tab-btn ${activeTab === 'learning' ? 'active' : ''}`}
          onClick={() => setActiveTab('learning')}
        >
          <FaVideo /> Learning
        </button>
        <button 
          className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          <FaTrophy /> Achievements
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="overview-tab">
          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div className="stat-info">
                <h3>{overallMetrics.totalEngagement} min</h3>
                <p>Total Engagement</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaGamepad />
              </div>
              <div className="stat-info">
                <h3>{childProgress.games.gamesPlayed}</h3>
                <p>Games Played</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaMusic />
              </div>
              <div className="stat-info">
                <h3>{childProgress.music.tracksListened}</h3>
                <p>Tracks Listened</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaStar />
              </div>
              <div className="stat-info">
                <h3>{overallMetrics.favoriteActivity}</h3>
                <p>Favorite Activity</p>
              </div>
            </div>
          </div>

          {/* Skill Progress */}
          <div className="progress-section">
            <h3>Skill Development</h3>
            <div className="skills-grid">
              {Object.entries(overallMetrics.skillProgress).map(([skill, percentage]) => (
                <div key={skill} className="skill-card">
                  <div className="skill-header">
                    <span className="skill-name">{skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
                    <span className="skill-percentage">{percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: getProgressColor(percentage)
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {childProgress.games.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    <FaGamepad />
                  </div>
                  <div className="activity-details">
                    <h4>Played {activity.game}</h4>
                    <p>{activity.duration} minutes • {new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {childProgress.music.recentPlays.map((play, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    <FaMusic />
                  </div>
                  <div className="activity-details">
                    <h4>Listened to {play.track}</h4>
                    <p>{play.duration} minutes • {play.mood} mood</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Games Tab */}
      {activeTab === 'games' && (
        <div className="games-tab">
          <div className="games-stats">
            <div className="game-metric">
              <h3>Favorite Game</h3>
              <p className="metric-value">{childProgress.games.favoriteGame}</p>
            </div>
            <div className="game-metric">
              <h3>Total Play Time</h3>
              <p className="metric-value">{childProgress.games.totalPlayTime} min</p>
            </div>
            <div className="game-metric">
              <h3>Completion Rate</h3>
              <p className="metric-value">{childProgress.games.completionRate}</p>
            </div>
          </div>

          <div className="games-history">
            <h3>Game Sessions</h3>
            <div className="sessions-list">
              {childProgress.games.recentActivity.map((session, index) => (
                <div key={index} className="session-item">
                  <div className="session-game">{session.game}</div>
                  <div className="session-duration">{session.duration} min</div>
                  <div className="session-date">{new Date(session.date).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Music Tab */}
      {activeTab === 'music' && (
        <div className="music-tab">
          <div className="music-stats">
            <div className="music-metric">
              <h3>Favorite Track</h3>
              <p className="metric-value">{childProgress.music.favoriteTrack}</p>
            </div>
            <div className="music-metric">
              <h3>Total Listen Time</h3>
              <p className="metric-value">{childProgress.music.totalListenTime} min</p>
            </div>
            <div className="music-metric">
              <h3>Favorite Mood</h3>
              <p className="metric-value">{childProgress.music.favoriteMood}</p>
            </div>
          </div>

          <div className="music-history">
            <h3>Recently Played</h3>
            <div className="tracks-list">
              {childProgress.music.recentPlays.map((play, index) => (
                <div key={index} className="track-item">
                  <div className="track-info">
                    <div className="track-name">{play.track}</div>
                    <div className="track-mood">{play.mood}</div>
                  </div>
                  <div className="track-duration">{play.duration} min</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Learning Tab */}
      {activeTab === 'learning' && (
        <div className="learning-tab">
          <div className="learning-stats">
            <div className="learning-metric">
              <h3>Videos Watched</h3>
              <p className="metric-value">{childProgress.learning.videosWatched}</p>
            </div>
            <div className="learning-metric">
              <h3>Favorite Category</h3>
              <p className="metric-value">{childProgress.learning.favoriteCategory}</p>
            </div>
            <div className="learning-metric">
              <h3>Total Watch Time</h3>
              <p className="metric-value">{childProgress.learning.totalWatchTime} min</p>
            </div>
          </div>

          <div className="skills-developed">
            <h3>Skills Being Developed</h3>
            <div className="skills-list">
              {childProgress.learning.skillsDeveloped.map((skill, index) => (
                <div key={index} className="skill-tag">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="videos-history">
            <h3>Recently Watched</h3>
            <div className="videos-list">
              {childProgress.learning.recentVideos.map((video, index) => (
                <div key={index} className="video-item">
                  <div className="video-title">{video.title}</div>
                  <div className="video-category">{video.category}</div>
                  <div className="video-duration">{video.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="achievements-tab">
          <div className="achievements-grid">
            {childProgress.achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
              >
                <div className="achievement-icon">
                  {achievement.earned ? achievement.icon : '🔒'}
                </div>
                <div className="achievement-info">
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                </div>
                <div className="achievement-status">
                  {achievement.earned ? 'Earned' : 'Locked'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
