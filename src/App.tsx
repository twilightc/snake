import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const RowLength = 20;
  const ColLength = 30;

  // const [gridLength, setGridlength] = useState(20);
  const [mode, setMode] = useState<'normal' | 'medium' | 'hard'>('medium');

  const [snakeSpeed, setSnakeSpeed] = useState(100);

  const [snakePos, setSnakePos] = useState([
    { row: 0, col: 2 },
    { row: 0, col: 1 },
    { row: 0, col: 0 }
  ]);

  const [targetPos, setTargetPos] = useState({ row: 7, col: 9 });

  const [direction, setDirection] = useState('r');

  const [score, setScore] = useState(0);

  const [gameOver, setGameOver] = useState(false);

  const setGameOverStatus = () => {
    setGameOver(true);

    setSnakePos([]);
  };

  useEffect(() => {
    if (gameOver) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          if (direction !== 'r') {
            setDirection('l');
          }
          break;
        case 'ArrowRight':
          if (direction !== 'l') {
            setDirection('r');
          }
          break;
        case 'ArrowUp':
          if (direction !== 'd') {
            setDirection('u');
          }
          break;
        case 'ArrowDown':
          if (direction !== 'u') {
            setDirection('d');
          }
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver) {
      return;
    }

    const interval = setInterval(() => {
      const headPos = { ...snakePos[0] };

      switch (direction) {
        case 'l':
          headPos.col -= 1;
          break;
        case 'r':
          headPos.col += 1;
          break;
        case 'u':
          headPos.row -= 1;
          break;
        case 'd':
          headPos.row += 1;
          break;
        default:
          break;
      }
      
      if (
        headPos.col >= ColLength ||
        headPos.col < 0 ||
        headPos.row >= RowLength ||
        headPos.row < 0 ||
        snakePos
          .slice(1, snakePos.length)
          .some(
            (restPart, index) =>
              index !== 0 && restPart.col === headPos.col && restPart.row === headPos.row
          )
      ) {
        setGameOverStatus();
        return;
      }

      if (headPos.col === targetPos.col && headPos.row === targetPos.row) {
        setScore((score) => score + 1);

        setTargetPos({
          row: Math.floor(Math.random() * RowLength),
          col: Math.floor(Math.random() * ColLength)
        });

        setSnakePos([headPos, ...snakePos.slice()]);
      } else {
        setSnakePos([headPos, ...snakePos.slice(0, -1)]);
      }
    }, snakeSpeed);

    return () => {
      clearInterval(interval);
    };
  }, [snakePos, direction, snakeSpeed, gameOver, targetPos]);

  useEffect(() => {
    if (!gameOver) {
      return;
    }

    const handleStartGame = (e: KeyboardEvent) => {
      if ([' ', 'Enter'].includes(e.key)) {
        setScore(0);
        
        setDirection('r');

        setSnakePos([
          { row: 0, col: 2 },
          { row: 0, col: 1 },
          { row: 0, col: 0 }
        ]);

        setTargetPos({
          row: Math.floor(Math.random() * RowLength),
          col: Math.floor(Math.random() * ColLength)
        });

        setGameOver(false);
      }
    };

    document.addEventListener('keydown', handleStartGame);

    return () => {
      document.removeEventListener('keydown', handleStartGame);
    };
  }, [gameOver]);

  return (
    <div className="App block">
      <div className="text-[24px] mt-[10px]">Snake</div>
      <div className="mt-[10px]">Set the mode</div>
      <div className="grid grid-cols-3 max-w-[400px] mx-auto my-[10px]">
        <div
          onClick={() => {
            setMode('normal');
            setSnakeSpeed(150);
          }}
        >
          <input
            id="normal"
            type="radio"
            name="difficulty"
            checked={mode === 'normal'}
            readOnly
            onKeyDown={(e) => {
              e.preventDefault();
            }}
          />
          <label htmlFor="normal" className="ml-[5px] cursor-pointer">
            Normal
          </label>
        </div>
        <div
          onClick={() => {
            setMode('medium');
            setSnakeSpeed(100);
          }}
        >
          <input
            id="medium"
            type="radio"
            name="difficulty"
            checked={mode === 'medium'}
            readOnly
            onKeyDown={(e) => {
              e.preventDefault();
            }}
          />
          <label htmlFor="medium" className="ml-[5px] cursor-pointer">
            Medium
          </label>
        </div>
        <div
          onClick={() => {
            setMode('hard');
            setSnakeSpeed(50);
          }}
        >
          <input
            id="hard"
            type="radio"
            name="difficulty"
            checked={mode === 'hard'}
            readOnly
            onKeyDown={(e) => {
              e.preventDefault();
            }}
          />
          <label htmlFor="hard" className="ml-[5px] cursor-pointer">
            Hard
          </label>
        </div>
      </div>

      <div className="my-[5px]">Your score: {score}</div>
     
      <div className="mt-[5px] game-area">
        {Array(20)
          .fill(0)
          .map((_, row) =>
            Array(30)
              .fill(0)
              .map((_, col) => {
                return (
                  <div
                    className={`cell ${
                      snakePos.some((pos) => pos.col === col && pos.row === row) ? 'snake' : ''
                    } ${targetPos.col === col && targetPos.row === row ? 'apple' : ''}
                    `}
                    key={`${row},${col}`}
                  ></div>
                );
              })
          )}
      </div>
      {gameOver && (
        <>
          <div className='mt-[5px]'>Game Over</div>

          <div>Press space or enter to restart the game</div>
        </>
      )}
    </div>
  );
}

export default App;
