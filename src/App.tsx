import { useState } from 'react';
import './App.css';

function App() {
  const [gridLength, setGridlength] = useState(20);

  return (
    <div className="App block">
      <div className="text-[24px] mt-[10px]">Snake</div>
      <div className="mt-[10px]">Set the mode</div>
      <div className="grid grid-cols-3 max-w-[400px] mx-auto my-[10px]">
        <div>
          <input
            type="radio"
            onClick={() => {
              setGridlength(20);
            }}
          />
          <span>Normal</span>
        </div>
        <div>
          <input
            type="radio"
            onClick={() => {
              setGridlength(30);
            }}
          />
          <span>Medium</span>
        </div>
        <div>
          <input
            type="radio"
            onClick={() => {
              setGridlength(40);
            }}
          />
          <span>Hard</span>
        </div>
      </div>

      <div className="game-area">
        {Array(gridLength)
          .fill(0)
          .map((_, row) =>
            Array(gridLength)
              .fill(0)
              .map((_, col) => <div className="cell" key={`${row},${col}`}></div>)
          )}
      </div>
    </div>
  );
}

export default App;
