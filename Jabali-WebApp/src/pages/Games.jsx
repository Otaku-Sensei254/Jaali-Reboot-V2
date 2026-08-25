// src/pages/Games.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useChild } from "../Components/Context/useChild";
import { FaClock, FaTrophy, FaRedo, FaHome } from "react-icons/fa";
import "../styles/games.css";

const ALL_SYMBOLS = ["🐶", "🐱", "🐰", "🐻", "🐼", "🐯", "🦁", "🐮"];

const getNumberOfCardsForLevel = (level) => {
  switch (level.toLowerCase()) {
    case "mild": return 8;
    case "moderate": return 12;
    case "high":
    case "substantial": return 16;
    default: return 8;
  }
};

const Games = () => {
  const { selectedChild } = useChild();
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: "memory",
      title: "Memory Match",
      description: "Find matching pairs of cards",
      icon: "🧠",
      color: "var(--primary)",
      difficulty: "Easy",
      skills: ["Memory", "Focus", "Visual Recognition"],
      duration: "5-10 min",
      difficultyRank: 2,
    },
    {
      id: "puzzle",
      title: "Shape Puzzle",
      description: "Drag and drop shapes to complete pictures",
      icon: "🧩",
      color: "var(--success)",
      difficulty: "Easy",
      skills: ["Problem Solving", "Fine Motor", "Spatial Awareness"],
      duration: "10-15 min",
      difficultyRank: 2,
    },
    {
      id: "coloring",
      title: "Color Therapy",
      description: "Relaxing coloring activities",
      icon: "🎨",
      color: "var(--pink)",
      difficulty: "Very Easy",
      skills: ["Creativity", "Calming", "Fine Motor"],
      duration: "15-20 min",
      difficultyRank: 1,
    },
    {
      id: "sounds",
      title: "Sound Match",
      description: "Match sounds to pictures",
      icon: "🔊",
      color: "var(--warning)",
      difficulty: "Medium",
      skills: ["Auditory Processing", "Memory", "Focus"],
      duration: "8-12 min",
      difficultyRank: 3,
    },
    {
      id: "patterns",
      title: "Pattern Play",
      description: "Complete colorful patterns",
      icon: "🔵",
      color: "var(--info)",
      difficulty: "Medium",
      skills: ["Logic", "Pattern Recognition", "Visual Processing"],
      duration: "10-15 min",
      difficultyRank: 3,
    },
    {
      id: "emotions",
      title: "Emotion Match",
      description: "Identify and match emotions",
      icon: "😊",
      color: "var(--purple)",
      difficulty: "Very Easy",
      skills: ["Emotional Intelligence", "Social Skills", "Empathy"],
      duration: "8-10 min",
      difficultyRank: 1,
    },
    {
      id: "letters",
      title: "Alphabet Fun",
      description: "Learn letters through play and sound!",
      icon: "🔤",
      color: "var(--teal)",
      difficulty: "Easy",
      skills: ["Language", "Focus", "Memory"],
      duration: "6-10 min",
      difficultyRank: 2,
    },
    {
      id: "numbers",
      title: "Number Match",
      description: "Learn numbers with colorful visuals!",
      icon: "🔢",
      color: "var(--yellow)",
      difficulty: "Easy",
      skills: ["Counting", "Math", "Memory"],
      duration: "6-10 min",
      difficultyRank: 2,
    },
  ];

  // Determine how many games to show based on support level
  const getGameCount = () => {
    if (!selectedChild || !selectedChild.supportLevel) return games.length;

    const level = selectedChild.supportLevel.toLowerCase();
    if (level === "mild") return 8;
    if (level === "moderate") return 6;
    if (level === "substantial" || level === "high") return 4;
    return games.length;
  };

  // Sort easier games first for substantial/high support kids
  const sortedGames = (() => {
    if (!selectedChild || !selectedChild.supportLevel) return games;
    const level = selectedChild.supportLevel.toLowerCase();
    if (level === "substantial" || level === "high") {
      return [...games].sort((a, b) => a.difficultyRank - b.difficultyRank);
    }
    return games;
  })();

  // Filter visible games based on level
  const visibleGames = sortedGames.slice(0, getGameCount());

  const GameWrapper = ({ game, children }) => (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={() => setSelectedGame(null)}>
          <FaHome /> Back to Games
        </button>
        <div className="game-info">
          <h1>
            {game.icon} {game.title}
          </h1>
          <p>{game.description}</p>
        </div>
        <div className="game-stats">
          <span className="difficulty-badge">{game.difficulty}</span>
          <span className="duration">
            <FaClock /> {game.duration}
          </span>
        </div>
      </div>
      {children}
    </div>
  );

  if (selectedGame) {
    const game = games.find((g) => g.id === selectedGame);

    switch (selectedGame) {
      case "memory":
        return (
          <GameWrapper game={game}>
            <MemoryMatchGame />
          </GameWrapper>
        );
      case "puzzle":
        return (
          <GameWrapper game={game}>
            <ShapePuzzleGame />
          </GameWrapper>
        );
      case "coloring":
        return (
          <GameWrapper game={game}>
            <ColoringGame />
          </GameWrapper>
        );
      case "sounds":
        return (
          <GameWrapper game={game}>
            <SoundMatchGame />
          </GameWrapper>
        );
      case "patterns":
        return (
          <GameWrapper game={game}>
            <PatternGame />
          </GameWrapper>
        );
      case "emotions":
        return (
          <GameWrapper game={game}>
            <EmotionGame />
          </GameWrapper>
        );
      case "letters":
        return (
          <GameWrapper game={game}>
            <AlphabetPlay />
          </GameWrapper>
        );
      case "numbers":
        return (
          <GameWrapper game={game}>
            <MathGames />
          </GameWrapper>
        );
      default:
        return null;
    }
  }

  return (
    <div className="games-container">
      <div className="games-header">
        <h1>Fun Learning Games</h1>
        {selectedChild ? (
          <p className="welcome-message">
            Hello {selectedChild.name}! Ready to play some fun games?
          </p>
        ) : (
          <p className="welcome-message">
            Choose a game to start playing and learning!
          </p>
        )}
      </div>

      <div className="games-grid">
        {visibleGames.map((game) => (
          <div
            key={game.id}
            className="game-card"
            onClick={() => setSelectedGame(game.id)}
            style={{ "--game-color": game.color }}
          >
            <div className="game-icon" style={{ backgroundColor: game.color }}>
              {game.icon}
            </div>
            <div className="game-content">
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <div className="game-meta">
                <span className="difficulty">{game.difficulty}</span>
                <span className="duration">
                  <FaClock /> {game.duration}
                </span>
              </div>
              <div className="skills">
                {game.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== Memory Match Game ====================
// Updated MemoryMatchGame that uses child context
const MemoryMatchGame = () => {
  const { selectedChild } = useChild(); // Get the selected child from context
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // master emoji set

  // Get level from selected child, default to "mild" if no child selected
  const level = selectedChild?.supportLevel || "mild";

  const initializeGame = useCallback(() => {
    const totalCards = getNumberOfCardsForLevel(level);
    const pairsNeeded = totalCards / 2;

    // Take only the symbols we need for this level
    const symbols = ALL_SYMBOLS.slice(0, pairsNeeded);

    const gameCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol, flipped: false }));

    setCards(gameCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameComplete(false);
  }, [level]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]); // re-initialize when level changes

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || solved.includes(id))
      return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      if (firstCard.symbol === secondCard.symbol) {
        setSolved([...solved, firstId, secondId]);
        setFlipped([]);
        if (solved.length + 2 === cards.length) setGameComplete(true);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  // Get grid class based on number of cards
  const getGridClass = () => {
    const totalCards = getNumberOfCardsForLevel(level);
    switch (totalCards) {
      case 8:
        return "grid-2-2"; // 2x2 grid for 8 cards
      case 12:
        return "grid-3-2"; // 3x2 grid for 12 cards
      case 16:
        return "grid-4-2"; // 4x2 grid for 16 cards
      default:
        return "grid-2-2";
    }
  };

  return (
    <div className="memory-game">
      <div className="game-stats">
        <span>Playing as: {selectedChild?.name || "Guest"}</span>
        <span>Level: {level}</span>
        <span>Moves: {moves}</span>
        <span>
          Pairs: {solved.length / 2} / {cards.length / 2}
        </span>
        <span>Cards: {cards.length}</span>
        <button className="restart-btn" onClick={initializeGame}>
          <FaRedo /> Restart
        </button>
      </div>

      <div className={`memory-grid ${getGridClass()}`}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`memory-card ${
              flipped.includes(card.id) || solved.includes(card.id)
                ? "flipped"
                : ""
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-front">?</div>
            <div className="card-back">{card.symbol}</div>
          </div>
        ))}
      </div>

      {gameComplete && (
        <div className="game-complete">
          <FaTrophy className="trophy-icon" />
          <h2>
            🎉 Congratulations{selectedChild ? ` ${selectedChild.name}` : ""}!
          </h2>
          <p>
            You completed the {level} level in {moves} moves!
          </p>
          <button className="play-again-btn" onClick={initializeGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

// ==================== Shape Puzzle Game ====================
const ShapePuzzleGame = () => {
  const [puzzles, setPuzzles] = useState([
    { id: 1, shape: "🔺", position: "A", correctPosition: "A1" },
    { id: 2, shape: "🔵", position: "A3", correctPosition: "A2" },
    { id: 3, shape: "🟦", position: "A1", correctPosition: "A3" },
    { id: 4, shape: "⭐", position: "B3", correctPosition: "B1" },
    { id: 5, shape: "❤️", position: "B2", correctPosition: "B2" },
    { id: 6, shape: "🔶", position: "B1", correctPosition: "B3" },
  ]);

  const handleDragStart = (e, puzzleId) =>
    e.dataTransfer.setData("puzzleId", puzzleId);
  const handleDrop = (e, position) => {
    e.preventDefault();
    const puzzleId = e.dataTransfer.getData("puzzleId");
    setPuzzles((prev) =>
      prev.map((p) => (p.id === Number(puzzleId) ? { ...p, position } : p))
    );
  };
  const handleDragOver = (e) => e.preventDefault();
  const checkCompletion = () =>
    puzzles.every((p) => p.position === p.correctPosition);

  return (
    <div className="puzzle-game">
      <h3>Drag the shapes to complete the puzzle!</h3>
      <div className="puzzle-area">
        <div className="puzzle-board">
          {["A1", "A2", "A3", "B1", "B2", "B3"].map((pos) => (
            <div
              key={pos}
              className="puzzle-slot"
              onDrop={(e) => handleDrop(e, pos)}
              onDragOver={handleDragOver}
            >
              {puzzles.find((p) => p.position === pos)?.shape}
            </div>
          ))}
        </div>
        <div className="puzzle-pieces">
          {puzzles.map((p) => (
            <div
              key={p.id}
              className="puzzle-piece"
              draggable
              onDragStart={(e) => handleDragStart(e, p.id)}
            >
              {p.shape}
            </div>
          ))}
        </div>
      </div>
      {checkCompletion() && <h3>Great job! Puzzle complete! 🎉</h3>}
    </div>
  );
};

// ==================== Coloring Game ====================
const ColoringGame = () => {
  const [selectedColor, setSelectedColor] = useState("#FF6B6B");
  const [currentImage, setCurrentImage] = useState("butterfly");

  const coloringPages = {
    butterfly: "🦋",
    flower: "🌺",
    tree: "🌳",
    house: "🏠",
    car: "🚗",
    fish: "🐠",
  };
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
    "#82E0AA",
  ];

  return (
    <div className="coloring-game">
      <div className="coloring-controls">
        <div className="color-palette">
          {colors.map((color) => (
            <button
              key={color}
              className={`color-swatch ${
                selectedColor === color ? "active" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
        <div className="image-selector">
          <h4>Choose a picture:</h4>
          <div className="image-options">
            {Object.entries(coloringPages).map(([key, emoji]) => (
              <button
                key={key}
                className={`image-option ${
                  currentImage === key ? "active" : ""
                }`}
                onClick={() => setCurrentImage(key)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="coloring-canvas">
        <div
          className="coloring-image"
          style={{
            fontSize: "8rem",
            color: selectedColor,
            filter: `drop-shadow(0 0 10px ${selectedColor}40)`,
          }}
        >
          {coloringPages[currentImage]}
        </div>
        <p className="coloring-hint">
          Click different colors to change the picture color!
        </p>
      </div>
    </div>
  );
};

// ==================== Placeholder Games ====================
// ==================== Coming soon Games ====================
const SoundMatchGame = () => (
  <div className="game-placeholder">
    <h2>Sound Match Game Coming Soon! 🎵</h2>
  </div>
);
const PatternGame = () => (
  <div className="game-placeholder">
    <h2>Pattern Play Coming Soon! 🔄</h2>
  </div>
);
const EmotionGame = () => (
  <div className="game-placeholder">
    <h2>Emotion Match Coming Soon! 😊</h2>
  </div>
);
const AlphabetPlay = () => {
  return (
    <div className="game-placeholder">
      <h2>Alphabet Play Coming Soon! 🔤</h2>
    </div>
  );
};
const MathGames = () => {
  return (
    <div className="game-placeholder">
      <h2>Math Games Coming Soon! 🔢</h2>
    </div>
  );
};
export default Games;
