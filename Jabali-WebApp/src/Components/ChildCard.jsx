// src/Components/ChildCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useChild } from "../Components/Context/useChild";
import { useAuth } from "../Components/Context/AuthContext";
import "../styles/ChildCard.css";

const ChildCard = ({ child, onDelete }) => {
  const { selectChild, selectedChild } = useChild();
  const { setActivePage } = useAuth();
  const navigate = useNavigate();

  const isSelected = selectedChild && selectedChild.id === child.id;

  const handleSelectChild = () => {
    selectChild(child);
    setActivePage("home");
    navigate("/");
  };

  return (
    <div 
      className={`child-card ${isSelected ? 'selected' : ''}`}
      onClick={handleSelectChild}
    >
      <div className="card-header">
        <div className="user-avatar">
          <FaUser className="Uicon" />
        </div>
        <div className="user-info">
          <h3 className="user-name">{child.name}</h3>
          <p className="user-age">Age {child.age}</p>
        </div>
        <button 
          className="delete-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(child.id);
          }}
        >
          <FaTrash />
        </button>
      </div>

      <div className="support-level">
        <span className="support-badge">{child.supportLevel}</span>
      </div>

      <div className="interests-section">
        <div className="interests-tags">
          {child.interests.map((interest, i) => (
            <span key={i} className="interest-tag">
              {interest}
            </span>
          ))}
        </div>
      </div>

      <button className="select-profile-btn">
        {isSelected ? 'Selected' : 'Select Profile'}
      </button>
    </div>
  );
};

export default ChildCard;