'use client';

import { useGameStore } from '@/lib/game/store';
import { GRID_SIZE } from '@/lib/game/minesweeper';
import CellComponent from './cell';

export default function GameBoard() {
  const { board, reveal, flag, status } = useGameStore();

  if (!board || status === 'idle') {
    return null;
  }

  return (
    <div className="bg-gray-300 p-1 rounded-lg inline-block">
      <div
        className="grid gap-px"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
      >
        {board.cells.map((cell) => (
          <CellComponent
            key={cell.index}
            cell={cell}
            onReveal={() => reveal(cell.index)}
            onFlag={(e) => {
              e.preventDefault();
              flag(cell.index);
            }}
          />
        ))}
      </div>
    </div>
  );
}