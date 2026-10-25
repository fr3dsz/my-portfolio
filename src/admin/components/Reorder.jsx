import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { Button } from "./ui";

export function DragHandle() {
  return <GripVertical aria-hidden="true" className="size-4 shrink-0 cursor-grab text-stone active:cursor-grabbing" />;
}

export function ReorderControls({ index, count, onMove, label }) {
  return (
    <div className="flex shrink-0">
      <Button variant="ghost" size="icon" icon={ArrowUp} aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => onMove(index, index - 1)} />
      <Button variant="ghost" size="icon" icon={ArrowDown} aria-label={`Move ${label} down`} disabled={index === count - 1} onClick={() => onMove(index, index + 1)} />
    </div>
  );
}
