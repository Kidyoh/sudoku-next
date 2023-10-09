interface GameControlsProps {
  checkSolution: () => void;
  resetBoard: () => void;
  solvePuzzle: () => void;
  getHint: () => void;
}

function GameControls({ checkSolution, resetBoard, solvePuzzle, getHint }: GameControlsProps) {
  return (
    <div className="flex justify-center space-x-4 my-4">
      <button
        onClick={checkSolution}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Check Solution
      </button>
      <button
        onClick={resetBoard}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Reset
      </button>
      <button
        onClick={solvePuzzle}
        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Solve Puzzle
      </button>
      <button
        onClick={getHint}
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
      >
        Get Hint
      </button>
    </div>
  );
}

export default GameControls;
