import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const RowLength = 20;
  const ColLength = 30;

  // const [gridLength, setGridlength] = useState(20);
  const [mode, setMode] = useState<'normal' | 'medium' | 'hard'>('normal');

  const [snakePos, setSnakePos] = useState([
    { row: 0, col: 2 },
    { row: 0, col: 1 },
    { row: 0, col: 0 }
  ]);

  const [apple, setApplyPos] = useState({ row: 7, col: 9 });

  const [direction, setDirection] = useState('r');

  const [snakeSpeed, setSnakeSpeed] = useState(150);

  const [gameOver, setGameOver] = useState(false);

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
        headPos.row < 0
      ) {
        setGameOver(true);
        return;
      }

      setSnakePos([headPos, ...snakePos.slice(0, -1)]);
    }, snakeSpeed);

    return () => {
      clearInterval(interval);
    };
  }, [snakePos, direction, snakeSpeed, gameOver]);

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

      <div className="game-area">
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
                    } ${apple.col === col && apple.row === row ? 'apple' : ''}
                    `}
                    key={`${row},${col}`}
                  ></div>
                );
              })
          )}
      </div>
    </div>
  );
}

export default App;
