import { useEffect, useState } from 'react';
import './App.css';

function App() {
  // const [gridLength, setGridlength] = useState(20);
  const [mode, setMode] = useState<'normal' | 'medium' | 'hard'>('normal');

  const [snakePos, setSnakePos] = useState([
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 }
  ]);

  const [apple, setApplyPos] = useState({ row: 7, col: 9 });

  const [direction, setDirection] = useState('r');
  
  const [snakeSpeed, setSnakeSpeed] = useState(150);

  useEffect(() => {
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
      setSnakePos([headPos,...snakePos.slice(0, -1)]);
    }, snakeSpeed);
    return () => {
      clearInterval(interval);
    }
  }, [snakePos, direction, snakeSpeed]);

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
          <input id="normal" type="radio" name="difficulty" checked={mode === 'normal'} readOnly />
          <label htmlFor="normal" className="cursor-pointer">
            Normal
          </label>
        </div>
        <div
          onClick={() => {
            setMode('medium');
            setSnakeSpeed(100);
          }}
        >
          <input id="medium" type="radio" name="difficulty" checked={mode === 'medium'} readOnly />
          <label htmlFor="medium" className="cursor-pointer">
            Medium
          </label>
        </div>
        <div
          onClick={() => {
            setMode('hard');
            setSnakeSpeed(50);
          }}
        >
          <input id="hard" type="radio" name="difficulty" checked={mode === 'hard'} readOnly />
          <label htmlFor="hard" className="cursor-pointer">
            Hard
          </label>
        </div>
      </div>

      <div className="game-area" >
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
