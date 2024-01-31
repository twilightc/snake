import { useCallback, useEffect, useState } from 'react';
import './App.css';

function App() {
  const RowLength = 20;
  const ColLength = 30;

  const [mode, setMode] = useState<'normal' | 'medium' | 'hard'>('hard');

  const [snakeSpeed, setSnakeSpeed] = useState(50);

  const [snakePos, setSnakePos] = useState([
    { row: 0, col: 2 },
    { row: 0, col: 1 },
    { row: 0, col: 0 }
  ]);

  const [targetPos, setTargetPos] = useState({ row: 7, col: 9 });

  const [obstaclesPos, setObstaclesPos] = useState([
    [
      { row: 1, col: 8 },
      { row: 1, col: 9 },
      { row: 1, col: 10 }
    ],
    [
      { row: 4, col: 12 },
      { row: 5, col: 12 },
      { row: 5, col: 13 }
    ],
    [
      { row: 8, col: 20 },
      { row: 8, col: 21 },
      { row: 9, col: 20 }
    ]
  ]);

  const [direction, setDirection] = useState('r');

  const [score, setScore] = useState(0);

  const [gameOver, setGameOver] = useState(false);

  const setGameOverStatus = () => {
    setGameOver(true);

    setSnakePos([]);
  };

  const generateObstacles = useCallback(() => {
    const obstacleAmount = 3;
    const obstacleLength = 3;

    const isPosValid = (direction: string, axis: number) => {
      let isValid = true;
      switch (direction) {
        case 'l':
          if (axis < 0) {
            isValid = false;
          }
          break;
        case 'r':
          if (axis > ColLength) {
            isValid = false;
          }
          break;
        case 'u':
          if (axis < 0) {
            isValid = false;
          }
          break;
        case 'd':
          if (axis > RowLength) {
            isValid = false;
          }
          break;
        default:
          break;
      }

      return isValid;
    };

    const determineNewPos = (refPos: { row: number; col: number }) => {
      const direction = Math.floor(Math.random() * 4);

      let newPos = {
        row: 0,
        col: 0
      };

      switch (direction) {
        case 0:
          newPos = {
            ...refPos,
            col: isPosValid('l', refPos.col - 1) ? refPos.col - 1 : refPos.col + 1
          };
          break;
        case 1:
          newPos = {
            ...refPos,
            col: isPosValid('r', refPos.col + 1) ? refPos.col + 1 : refPos.col - 1
          };
          break;
        case 2:
          newPos = {
            ...refPos,
            row: isPosValid('u', refPos.row - 1) ? refPos.row - 1 : refPos.row + 1
          };
          break;
        case 3:
          newPos = {
            ...refPos,
            row: isPosValid('d', refPos.row + 1) ? refPos.row + 1 : refPos.row - 1
          };
          break;

        default:
          break;
      }

      return newPos;
    };

    for (let index = 0; index < obstacleAmount; index++) {
      const tempRowPos = Math.floor(Math.random() * RowLength);
      const tempColPos = Math.floor(Math.random() * RowLength);
      const initialPos = {
        row: tempRowPos,
        col:
          [0, 1, 2].includes(tempRowPos) &&
          Array.from({ length: 10 }, (_, index) => index).some((axis) => axis === tempColPos)
            ? 10
            : tempColPos
      };
      const obstacle: { row: number; col: number }[] = [];

      for (let obstaclePosIndex = 0; obstaclePosIndex < obstacleLength; obstaclePosIndex++) {
        if (obstaclePosIndex === 0) {
          obstacle.push(initialPos);
        } else {
          const newPos = determineNewPos(obstacle[obstaclePosIndex - 1]);

          obstacle.push(newPos);
        }
      }

      setObstaclesPos((oldData) => [...oldData, obstacle]);
    }
  }, []);

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
      let headPos = { ...snakePos[0] };

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

      switch (mode) {
        case 'normal':
          if (
            snakePos
              .slice(0, snakePos.length)
              .some(
                (restPart, index) =>
                  index !== 0 && restPart.col === headPos.col && restPart.row === headPos.row
              )
          ) {
            setGameOverStatus();
            return;
          } else if (headPos.col >= ColLength) {
            headPos = { ...headPos, col: 0 };
          } else if (headPos.col < 0) {
            headPos = { ...headPos, col: ColLength };
          } else if (headPos.row >= RowLength) {
            headPos = { ...headPos, row: 0 };
          } else if (headPos.row < 0) {
            headPos = { ...headPos, row: RowLength };
          }
          break;
        case 'medium':
          if (
            headPos.col >= ColLength ||
            headPos.col < 0 ||
            headPos.row >= RowLength ||
            headPos.row < 0 ||
            snakePos
              .slice(0, snakePos.length)
              .some(
                (restPart, index) =>
                  index !== 0 && restPart.col === headPos.col && restPart.row === headPos.row
              )
          ) {
            setGameOverStatus();
            return;
          }
          break;
        case 'hard':
          if (
            headPos.col >= ColLength ||
            headPos.col < 0 ||
            headPos.row >= RowLength ||
            headPos.row < 0 ||
            obstaclesPos.find((pos) =>
              pos.some(
                (obstacles) => obstacles.col === headPos.col && obstacles.row === headPos.row
              )
            ) ||
            snakePos
              .slice(0, snakePos.length)
              .some(
                (restPart, index) =>
                  index !== 0 && restPart.col === headPos.col && restPart.row === headPos.row
              )
          ) {
            setGameOverStatus();
            return;
          }
          break;
        default:
          break;
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
  }, [snakePos, direction, snakeSpeed, gameOver, targetPos, mode, obstaclesPos]);

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

        setObstaclesPos([]);
        generateObstacles();

        do {
          setTargetPos(oldValue => ({
            ...oldValue,
            row: Math.floor(Math.random() * RowLength),
            col: Math.floor(Math.random() * ColLength)
          }));
        } while (
          !obstaclesPos.find((pos) =>
            pos.every(
              (obstacle) => obstacle.row !== targetPos.row && obstacle.col !== targetPos.col
            )
          )
        );

        setGameOver(false);
      }
    };

    document.addEventListener('keydown', handleStartGame);

    return () => {
      document.removeEventListener('keydown', handleStartGame);
    };
  }, [gameOver, generateObstacles, obstaclesPos, targetPos]);

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
            setSnakePos([
              { row: 0, col: 2 },
              { row: 0, col: 1 },
              { row: 0, col: 0 }
            ]);
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
                      ${
                        mode === 'hard' &&
                        obstaclesPos.find((pos) =>
                          pos.some((obstacle) => obstacle.col === col && obstacle.row === row)
                        )
                          ? 'obstacle'
                          : ''
                      } 
                    `}
                    key={`${row},${col}`}
                  ></div>
                );
              })
          )}
      </div>
      {gameOver && (
        <>
          <div className="mt-[5px]">Game Over</div>

          <div>Press space or enter to restart the game</div>
        </>
      )}
    </div>
  );
}

export default App;
