import { useState } from "react";

// Native HTML5 drag-and-drop for a vertical list. Keyboard users get the
// up/down buttons in ReorderControls; this is the pointer shortcut.
export function useDragReorder(onMove) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const itemProps = (index) => ({
    draggable: true,
    onDragStart: (event) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(index));
      setDragIndex(index);
    },
    onDragOver: (event) => {
      if (dragIndex === null) return;
      event.preventDefault();
      if (overIndex !== index) setOverIndex(index);
    },
    onDrop: (event) => {
      event.preventDefault();
      if (dragIndex !== null && dragIndex !== index) onMove(dragIndex, index);
      setDragIndex(null);
      setOverIndex(null);
    },
    onDragEnd: () => {
      setDragIndex(null);
      setOverIndex(null);
    },
    "data-dragging": dragIndex === index || undefined,
    "data-drop-target": (overIndex === index && dragIndex !== index) || undefined,
  });

  return itemProps;
}

// Applied to each draggable row: dim the dragged row, mark the drop target.
export const dragRowClass = "data-[dragging]:opacity-40 data-[drop-target]:bg-elevated data-[drop-target]:outline data-[drop-target]:outline-1 data-[drop-target]:outline-accent";
