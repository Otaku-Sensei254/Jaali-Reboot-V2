// src/pages/Home.jsx
import React from 'react';
import { useAuth } from '../Components/Context/AuthContext';
import { useChild } from '../Components/Context/useChild';
import { useLanguage } from '../Components/Context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa6';
import { IoMusicalNotes } from 'react-icons/io5';
import { CiHeart } from 'react-icons/ci';
import { MdKeyboardArrowRight } from 'react-icons/md';
import kidHome from '../Assets/fam.webp'
import '../styles/home.css';

const Home = () => {
  const { userName, setActivePage } = useAuth();
  const { selectedChild } = useChild();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isSwahili = language === 'sw';
  const text = isSwahili ? {
    welcome: 'Karibu tena', headline: 'Kuwawezesha watoto, kusaidia familia', intro: 'Jabali ni nafasi tulivu na jumuishi ya kujifunza, iliyoundwa kwa watoto wenye tawahudi na walezi wanaowaongoza.',
    age: 'Umri', start: 'Anza kujifunza', change: 'Badilisha wasifu', noProfile: 'Hakuna wasifu wa mtoto uliochaguliwa', create: 'Unda au chagua wasifu ili kuanza.', manage: 'Simamia wasifu wa watoto', offers: 'Tunachotoa', offerText: 'Rasilimali zilizoundwa kwa uangalifu ili kusaidia kujifunza, kukua na ratiba tulivu.', explore: 'Gundua', safe: 'Nafasi salama kwa kila mtu', safeText: 'Jabali imejengwa kwa kuzingatia ufikivu, ujumuishi na utulivu. Kila mtoto anastahili mahali anapojisikia kuungwa mkono na kueleweka.',
  } : {
    welcome: 'Welcome back', headline: 'Empowering children, supporting families', intro: 'Jabali offers a calm, inclusive learning space built for autistic children and the caregivers who guide them.',
    age: 'Age', start: 'Start Learning', change: 'Change Profile', noProfile: 'No child profile selected', create: 'Create or choose one to begin.', manage: 'Manage Child Profiles', offers: 'What we offer', offerText: 'Thoughtfully designed resources to support learning, growth, and calm routines.', explore: 'Explore', safe: 'A safe space for everyone', safeText: 'Jabali is built on accessibility, inclusivity, and calmness. Every child deserves a place where they feel supported and understood.',
  };

  const modules = [
    {
      id: 1,
      icon: <FaBookOpen />,
      name: isSwahili ? 'Moduli za kujifunza' : 'Learning Modules',
      description: isSwahili ? 'Masomo shirikishi yanayoundwa kwa mitindo tofauti ya kujifunza na mahitaji ya hisia.' : 'Interactive lessons designed for different learning styles and sensory needs.',
      link: '/app/learning',
    },
    {
      id: 2,
      icon: <IoMusicalNotes />,
      name: isSwahili ? 'Muziki na midundo' : 'Music & Melodies',
      description: isSwahili ? 'Muziki tulivu, shughuli za midundo na uchunguzi wa sauti kwa usawazishaji wa hisia.' : 'Calming music, rhythmic activities, and sound exploration for sensory regulation.',
      link: '/app/music',
    },
    {
      id: 3,
      icon: <CiHeart />,
      name: isSwahili ? 'Maendeleo na dashibodi' : 'Progress & Dashboard',
      description: isSwahili ? 'Fuatilia maendeleo ya kujifunza na safari ya mtoto wako.' : 'Track learning progress, save favorites, and monitor your child’s journey.',
      link: '/app/dashboard',
    },
  ];

  const handleStartLearning = () => {
    setActivePage('learning');
    navigate('/app/learning');
  };

  return (
    <div className="home-container">
      <section className="top-box">
        <div className="lft">
          <span className="userIn">{text.welcome}{userName ? `, ${userName}` : ''}!</span>
          <h2>{text.headline}</h2>
          <p className="intro-text">
            {text.intro}
          </p>

          {selectedChild ? (
            <div className="selected-profile">
              <div className="profile-header">
                <div className="profile-avatar">
                  <FaUser className="Uicon" />
                </div>
                <div className="profile-info">
                  <h3>{selectedChild.name}</h3>
                  <p className="profile-age">{text.age} {selectedChild.age}</p>
                </div>
              </div>

              <div className="profile-details">
                <span className="support-badge">{selectedChild.supportLevel}</span>
                {selectedChild.interests && selectedChild.interests.length > 0 && (
                  <div className="interests-tags">
                    {selectedChild.interests.map((interest, index) => (
                      <span key={index} className="interest-tag">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="profile-actions">
                <button className="start-learning-btn" onClick={handleStartLearning}>
                  {text.start} <MdKeyboardArrowRight />
                </button>
                <Link to="/app/profiles">
                  <button className="manage-profiles-btn">{text.change}</button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="profiles">
              <div className="profile-header">
                <div className="profile-avatar">
                  <FaUser className="Uicon" />
                </div>
                <div className="profile-info">
                  <h3>{text.noProfile}</h3><p>{text.create}</p>
                </div>
              </div>
              <Link to="/app/profiles">
                <button className="manage-btn">{text.manage}</button>
              </Link>
            </div>
          )}
        </div>

        <div className="rgt">
          <img src={kidHome} alt="Children learning together" />
        </div>
      </section>

      <section className="mid-box">
        <h1>{text.offers}</h1><p className="mid-subtext">{text.offerText}</p>
        <div className="grid">
          {modules.map((module) => (
            <div key={module.id} className="module-card">
              <i className="Micon">{module.icon}</i>
              <h3>{module.name}</h3>
              <p>{module.description}</p>
              <Link to={module.link}>
                <button>{text.explore} <MdKeyboardArrowRight /></button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="btm-box">
        <i className="Micon"><CiHeart /></i>
        <h2>{text.safe}</h2>
        <p>
          {text.safeText}
        </p>
      </section>
    </div>
  );
};

export default Home;
