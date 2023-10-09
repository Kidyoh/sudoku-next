"use client";
import { useState, useEffect } from 'react';
import Cell from './Cell';
import GameControls from '../controllers/GameControlls';
import CongratulationsMessage from '../controllers/SolvedGame';
import Timer from './Timer';

type CellValue = number | null;
type BoardState = CellValue[][];

export enum Difficulty {
  Easy = 0,
  Medium = 1,
  Hard = 2,
}
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function generateBoard(): BoardState {
  const board: BoardState = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null));

  function backtrack(row: number, col: number): boolean {
    if (row === 9) {
      return true;
    }

    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = col === 8 ? 0 : col + 1;

    if (board[row][col] !== null) {
      return backtrack(nextRow, nextCol);
    }

    const candidates = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const candidate of candidates) {
      if (isValidMove(board, row, col, candidate)) {
        board[row][col] = candidate;
        if (backtrack(nextRow, nextCol)) {
          return true;
        }
        board[row][col] = null;
      }
    }

    return false;
  }

  backtrack(0, 0);

  return board;
}

function isValidMove(board: BoardState, row: number, col: number, value: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === value || board[i][col] === value) {
      return false;
    }
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (board[i][j] === value) {
        return false;
      }
    }
  }

  return true;
}

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generatePuzzle(difficulty: Difficulty): BoardState {
  const solution = generateBoard();
  const puzzle = cloneBoard(solution);

  const cells = shuffle(
    Array.from({ length: 81 }, (_, index) => [Math.floor(index / 9), index % 9]) // Generate an array of all cell coordinates
  );

  let numCellsToRemove: number;

  switch (difficulty) {
    case Difficulty.Easy:
      numCellsToRemove = 30;
      break;
    case Difficulty.Medium:
      numCellsToRemove = 40;
      break;
    case Difficulty.Hard:
      numCellsToRemove = 50;
      break;
    default:
      numCellsToRemove = 40;
  }

  let numCellsRemoved = 0;

  for (const [row, col] of cells) {
    const cellValue = puzzle[row][col];
    puzzle[row][col] = null;

    const solutions = findAllSolutions(puzzle);

    if (solutions.length !== 1) {
      puzzle[row][col] = cellValue;
    } else {
      numCellsRemoved++;
      if (numCellsRemoved === numCellsToRemove) {
        break;
      }
    }
  }

  return puzzle;
}

function cloneBoard(board: BoardState): BoardState {
  return board.map((row) => [...row]);
}

function findAllSolutions(board: BoardState): BoardState[] {
  const solutions: BoardState[] = [];

  function backtrack(row: number, col: number): void {
    if (row === 9) {
      solutions.push(cloneBoard(board));
      return;
    }

    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = col === 8 ? 0 : col + 1;

    if (board[row][col] !== null) {
      backtrack(nextRow, nextCol);
    } else {
      for (let candidate = 1; candidate <= 9; candidate++) {
        if (isValidMove(board, row, col, candidate)) {
          board[row][col] = candidate;
          backtrack(nextRow, nextCol);
          board[row][col] = null;
        }
      }
    }
  }

  backtrack(0, 0);

  return solutions;
}

function solveSudoku(board: BoardState): BoardState | null {
  function solve(row: number, col: number): boolean {
    if (row === 9) {
      return true;
    }

    if (board[row][col] !== null) {

      const nextRow = col === 8 ? row + 1 : row;
      const nextCol = col === 8 ? 0 : col + 1;
      return solve(nextRow, nextCol);
    }

    for (let num = 1; num <= 9; num++) {
      if (isValidMove(board, row, col, num)) {
        board[row][col] = num;

        const nextRow = col === 8 ? row + 1 : row;
        const nextCol = col === 8 ? 0 : col + 1;

        if (solve(nextRow, nextCol)) {
          return true;
        }


        board[row][col] = null;
      }
    }

    return false;
  }

  if (solve(0, 0)) {

    return board;
  } else {
    return null;
  }
}


function Board({ difficulty }: { difficulty: Difficulty; }) {
  const [solution, setSolution] = useState(generateBoard());

  useEffect(() => {
    setSolution(generateBoard());
  }, []);
  const [board, setBoard] = useState(generatePuzzle(difficulty));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [time, setTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(formatTime(time));
  const [solvedTime, setSolvedTime] = useState<string | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null); // New state for selected number

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setCurrentTime(formatTime(time)); // Update current time with the formatted time
  }, [time]);

  useEffect(() => {
    setIsSolved(board.every((row) => row.every((cell) => cell !== null)));
    if (isSolved) {
      setSolvedTime(currentTime);
    }
  }, [board]);

  useEffect(() => {
    setIsSolved(board.every((row) => row.every((cell) => cell !== null)));
  }, [board]);


  const initiallyGeneratedCells: [number, number][] = [];
  const initialBoardSnapshot: BoardState = generatePuzzle(difficulty);

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (initialBoardSnapshot[row][col] !== null) {
        initiallyGeneratedCells.push([row, col]);
      }
    }
  }


  function handleCellClick(row: number, col: number) {
    const isInitiallyGenerated = initiallyGeneratedCells.some(
      ([generatedRow, generatedCol]) => generatedRow === row && generatedCol === col
    );

    if (!isInitiallyGenerated) {
      setSelectedCell([row, col]);
    }
  }


  function handleCellValueChange(row: number, col: number, value: CellValue) {
    const newBoard = [...board];
    newBoard[row][col] = value !== null ? value : selectedNumber; // Use selected number if not null
    setBoard(newBoard);
    setSelectedNumber(null); // Reset selected number
    checkSolution(newBoard);
  }




  function getBoxIndex(row: number, col: number): number {
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
  }

  const selectedBoxIndex = selectedCell ? getBoxIndex(selectedCell[0], selectedCell[1]) : -1;

  function getBoxStart(boxIndex: number): [number, number] {
    const row = Math.floor(boxIndex / 3) * 3;
    const col = (boxIndex % 3) * 3;
    return [row, col];
  }

  function checkSolution(newBoard: BoardState) {
    const isBoardSolved = newBoard.every((row, rowIndex) =>
      row.every((cellValue, colIndex) => cellValue === solution[rowIndex][colIndex])
    );
    setIsSolved(isBoardSolved);

    // Check each row for duplicates
    for (let row = 0; row < 9; row++) {
      const rowValues = new Set<number>();
      for (let col = 0; col < 9; col++) {
        const value = newBoard[row][col];
        if (value !== null) {
          if (rowValues.has(value)) {
            alert(`Duplicate value ${value} in row ${row + 1}`);
            return;
          }
          rowValues.add(value);
        }
      }
    }

    // Check each column for duplicates
    for (let col = 0; col < 9; col++) {
      const colValues = new Set<number>();
      for (let row = 0; row < 9; row++) {
        const value = newBoard[row][col];
        if (value !== null) {
          if (colValues.has(value)) {
            alert(`Duplicate value ${value} in column ${col + 1}`);
            return;
          }
          colValues.add(value);
        }
      }
    }

    // Check each box for duplicates
    for (let box = 0; box < 9; box++) {
      const boxValues = new Set<number>();
      const [startRow, startCol] = getBoxStart(box);
      for (let row = startRow; row < startRow + 3; row++) {
        for (let col = startCol; col < startCol + 3; col++) {
          const value = newBoard[row][col];
          if (value !== null) {
            if (boxValues.has(value)) {
              alert(`Duplicate value ${value} in box ${box + 1}`);
              return;
            }
            boxValues.add(value);
          }
        }
      }
    }

    setBoard(newBoard);
  }

  function resetBoard() {
    setBoard(generatePuzzle(difficulty));
    setSelectedCell(null);
    setIsSolved(false);
    setTime(0);
    setCurrentTime(formatTime(0));
  }


  function solvePuzzle() {
    const solvedBoard = solveSudoku([...board]);
    if (solvedBoard) {
      setBoard(solvedBoard);
      setIsSolved(true);
      setTime(0);
      setCurrentTime(formatTime(0));
    } else {
      alert("No solution exists for the given Sudoku puzzle.");
    }
  }
  function getHint(): void {
    const emptyCells: [number, number][] = [];

    // Create a map to count the number of valid candidates for each empty cell
    const candidateCounts = new Map<string, number>();

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          emptyCells.push([row, col]);
          const candidates = [];
          for (let candidate = 1; candidate <= 9; candidate++) {
            if (isValidMove(board, row, col, candidate)) {
              candidates.push(candidate);
            }
          }
          candidateCounts.set(`${row}-${col}`, candidates.length);
        }
      }
    }

    if (emptyCells.length === 0) {
      alert("The puzzle is already solved!");
      return;
    }

    // Sort empty cells by the number of candidates (fewest first)
    emptyCells.sort(
      (a, b) =>
        (candidateCounts.get(`${a[0]}-${a[1]}`) || 0) -
        (candidateCounts.get(`${b[0]}-${b[1]}`) || 0)
    );

    for (const [row, col] of emptyCells) {
      const candidates = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

      for (const candidate of candidates) {
        if (isValidMove(board, row, col, candidate)) {
          const newBoard = [...board];
          newBoard[row][col] = candidate;
          setBoard(newBoard);
          setSelectedCell([row, col]);
          return;
        }
      }
    }

    alert("No valid move found for the selected cell.");
  }


  function checkSolutionWrapper() {
    checkSolution(board); // Call the original checkSolution function with the board
  }

  const lockedCells = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => false)
  );

  for (const [row, col] of initiallyGeneratedCells) {
    lockedCells[row][col] = true;
  }

  const numberButtons = Array.from({ length: 9 }, (_, index) => index + 1);

  return (
    <div className=' container mx-auto p-4'>
       <h1 className="text-3xl font-semibold mb-4 text-center text-black">Shega Sudoku Game</h1>
      {board.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((cellValue, colIndex) => {
            const isSameRow = selectedCell && selectedCell[0] === rowIndex;
            const isSameCol = selectedCell && selectedCell[1] === colIndex;
            const isSameBox = selectedCell && getBoxIndex(rowIndex, colIndex) === selectedBoxIndex;
            const isHighlighted = isSameRow || isSameCol || isSameBox;
            const isIncorrect = cellValue !== null && cellValue !== solution[rowIndex][colIndex];
              <span>Shega Sudoku</span>

            return (
              <Cell
                isLocked={lockedCells[rowIndex][colIndex]}
                initiallyGeneratedCells={initiallyGeneratedCells}
                key={colIndex}
                value={cellValue}
                isSelected={
                  selectedCell !== null && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
                }
                isHighlighted={isHighlighted ? true : false}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onChange={(value) => handleCellValueChange(rowIndex, colIndex, value)}
                solutionValue={solution[rowIndex][colIndex]}
                initiallyGenerated={initiallyGeneratedCells.includes([rowIndex, colIndex])}
                isIncorrect={isIncorrect}
                selectedNumber={selectedNumber}
                setSelectedNumber={setSelectedNumber}
              />
            );
          })}

        </div>
      ))}
      <br />
     <div className="number-buttons">
        {numberButtons.map((number) => (
          <button
            key={number}
            className={`number-button${selectedNumber === number ? ' selected' : ''}`}
            onClick={() => setSelectedNumber(selectedNumber === number ? null : number)} // Set selected number
          >
            {number}
          </button>
        ))}
      </div>
      <GameControls checkSolution={checkSolutionWrapper} solvePuzzle={solvePuzzle} resetBoard={resetBoard} getHint={getHint} />
      {!isSolved && <Timer />}
      {isSolved && (
      <CongratulationsMessage isVisible={isSolved} time={formatTime(Number(solvedTime) || 0)} />
)}

    </div>
  );
}

export default Board;