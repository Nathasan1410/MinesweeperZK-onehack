'use client';

import { Cell, getCellColor } from '@/lib/game/minesweeper';

interface CellProps {
  cell: Cell;
  onReveal: () => void;
  onFlag: (e: React.MouseEvent) => void;
}

export default function CellComponent({ cell, onReveal, onFlag }: CellProps) {
  const getCellContent = () => {
    switch (cell.state) {
      case 'hidden':
        return null;
      case 'flagged':
        return '🚩';
      case 'revealed':
        if (cell.neighborMines > 0) {
          return cell.neighborMines;
        }
        return '';
      case 'mine':
        return '💣';
      case 'exploded':
        return '💥';
      default:
        return null;
    }
  };

  const getCellClasses = () => {
    const base = 'w-10 h-10 flex items-center justify-center text-sm font-bold select-none transition-all ';

    switch (cell.state) {
      case 'hidden':
        return (
          base +
          'bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-sm border-b-2 border-r-2 border-gray-300'
        );
      case 'flagged':
        return (
          base +
          'bg-gray-200 cursor-pointer rounded-sm border-b-2 border-r-2 border-gray-300'
        );
      case 'revealed':
        return (
          base +
          'bg-white cursor-default rounded-sm text-lg ' +
          getCellColor(cell.neighborMines)
        );
      case 'mine':
        return base + 'bg-red-500 text-white rounded-sm text-lg';
      case 'exploded':
        return base + 'bg-red-600 text-white rounded-sm text-lg';
      default:
        return base;
    }
  };

  return (
    <div
      className={getCellClasses()}
      onClick={cell.state === 'hidden' ? onReveal : undefined}
      onContextMenu={cell.state === 'hidden' ? onFlag : undefined}
    >
      {getCellContent()}
    </div>
  );
}