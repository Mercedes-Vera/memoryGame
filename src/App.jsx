import { useState, useEffect } from 'react';
import { BsPlay } from "react-icons/bs";

function App () {
  const [gamePattern, setGamePattern] = useState([]);     
  const [userPattern, setUserPattern] = useState([]);     
  const [isPlaying, setIsPlaying] = useState(false);      
  const [score, setScore] = useState(0);                  
  const [activeColor, setActiveColor] = useState(null);   
  const [isDisplayingPattern, setIsDisplayingPattern] = useState(false); 
  const [gameOver, setGameOver] = useState(false);        

  const colors = ['red', 'green', 'blue', 'yellow'];      

  // Genera el siguiente paso del patrón del juego
  const generateNextStep = () => {
    const nextColor = colors[Math.floor(Math.random() * 4)];
    setGamePattern(prevPattern => [...prevPattern, nextColor]);
  };

  // Muestra el patrón actual al jugador
  const displayPattern = async () => {
    setIsDisplayingPattern(true);
    for (let i = 0; i < gamePattern.length; i++) {
      await highlightColor(gamePattern[i]);
    }
    setIsDisplayingPattern(false);
  };

  // Ilumina un color brevemente durante el patrón
  const highlightColor = (color) => {
    return new Promise((resolve) => {
      setActiveColor(color);
      setTimeout(() => {
        setActiveColor(null);
        setTimeout(resolve, 500);
      }, 700);
    });
  };

  // Inicia el juego, reiniciando todos los estados
  const startGame = () => {
    setGamePattern([]);
    setUserPattern([]);
    setScore(0);
    setIsPlaying(true);
    setGameOver(false);
    setIsDisplayingPattern(false);
    setActiveColor(null);

    setTimeout(() => {
      generateNextStep();
    }, 700);
  };

  // Reproduce el patrón cada vez que crece o comienza el juego
  useEffect(() => {
    if (gamePattern.length > 0 && isPlaying) {
      displayPattern();
    }
  }, [gamePattern, isPlaying]);

  // Maneja el clic del usuario y verifica el patrón
  const handleColorClick = (color) => {
    if (isDisplayingPattern || gameOver) return;

    const newUserPattern = [...userPattern, color];
    setUserPattern(newUserPattern);

    const currentIndex = newUserPattern.length - 1;
    if (newUserPattern[currentIndex] !== gamePattern[currentIndex]) {
      setGameOver(true);
      setIsPlaying(false);
    } else if (newUserPattern.length === gamePattern.length) {
      setScore(score + 1);
      setUserPattern([]);
      setTimeout(generateNextStep, 1000);
    }
  };

 
  return (
    <section className="game-container">
      <h1>Simon dice</h1>
      <div className="colors-grid">
        {colors.map((color) => (
          <div
            key={color}
            className={`color-button ${color} ${activeColor === color ? 'active' : ''}`}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>
      <div className="controls">
        {gameOver ? (
          <>
            <h2>Juego terminado.</h2>
            <h2>Puntuación final: {score}</h2>
            <button className="control-button reset-button" onClick={startGame}>Reiniciar</button>
          </>
        ) : (
          <>
            <button 
              className={`control-button start-button ${isPlaying ? 'no-hover' : ''}`} 
              onClick={startGame} 
              disabled={isPlaying}
            >
              <BsPlay />
            </button>
            <h2>Puntuación: {score}</h2>
          </>
        )}
      </div>
    </section>
  );
}

export default App;
