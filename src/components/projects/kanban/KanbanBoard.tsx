// src/components/projects/kanban/KanbanBoard.tsx
"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { initialColumns } from './initial-data';
import type { Column, Task, ColumnId } from "@/lib/types";

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px
      },
    })
  );

  const findColumn = (id: ColumnId | string): Column | undefined => {
    return columns.find((col) => col.id === id);
  };
  
  const findTaskInColumns = (taskId: string, cols: Column[]): { column: Column, task: Task } | undefined => {
    for (const column of cols) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) {
        return { column, task };
      }
    }
    return undefined;
  }

  const updateTaskInColumns = (updatedTask: Task) => {
    setColumns(prev => 
        prev.map(col => ({
            ...col,
            tasks: col.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
        }))
    );
  }

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTaskData = findTaskInColumns(active.id.toString(), columns);
    if (!activeTaskData) return;

    const activeColumnId = activeTaskData.column.id;
    let overColumnId: ColumnId | string | undefined = over.id.toString();

    // Check if dropping on a column or a task
    if (over.data.current?.type === 'Task') {
      overColumnId = findTaskInColumns(over.id.toString(), columns)?.column.id;
    } else {
      overColumnId = over.id.toString();
    }

    if (!overColumnId || activeColumnId === overColumnId) {
       // Logic for reordering within the same column
       const activeColumn = findColumn(activeColumnId);
       if (!activeColumn) return;
 
       const oldIndex = activeColumn.tasks.findIndex(t => t.id === active.id);
       const newIndex = activeColumn.tasks.findIndex(t => t.id === over.id);
 
       if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
         setColumns(prev => {
             const newColumns = [...prev];
             const activeColumnIndex = newColumns.findIndex(c => c.id === activeColumnId);
             if (activeColumnIndex === -1) return prev;
 
             newColumns[activeColumnIndex] = {
                 ...newColumns[activeColumnIndex],
                 tasks: arrayMove(activeColumn.tasks, oldIndex, newIndex)
             }
             return newColumns;
         });
       }
       return;
    }

    // Logic for moving between columns is handled in onDragOver
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const isActiveATask = active.data.current?.type === "Task";
    if (!isActiveATask) return;
  
    const isOverAColumn = over.data.current?.type === "Column";
    const isOverATask = over.data.current?.type === "Task";
  
    if (isActiveATask && (isOverAColumn || isOverATask)) {
      setColumns((prev) => {
        const activeId = active.id.toString();
        const overId = over.id.toString();
        
        const activeTaskData = findTaskInColumns(activeId, prev);
        if (!activeTaskData) return prev;
        
        const { column: activeColumn, task: activeTask } = activeTaskData;
        
        const overColumnId = isOverAColumn ? overId : findTaskInColumns(overId, prev)?.column.id;
        
        if (!overColumnId || activeColumn.id === overColumnId) {
          // Handle reordering within the same column
           const column = findColumn(activeColumn.id);
           if (!column) return prev;
           const oldIndex = column.tasks.findIndex(t => t.id === activeId);
           const newIndex = isOverATask ? column.tasks.findIndex(t => t.id === overId) : column.tasks.length;
 
           if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
                const newColumns = [...prev];
                const colIndex = newColumns.findIndex(c => c.id === activeColumn.id);
                newColumns[colIndex].tasks = arrayMove(column.tasks, oldIndex, newIndex);
                return newColumns;
           }
           return prev;

        }
  
        // Handle moving to a different column
        const newColumns = [...prev];
        const originalColIndex = newColumns.findIndex(c => c.id === activeColumn.id);
        const targetColIndex = newColumns.findIndex(c => c.id === overColumnId);
  
        if (originalColIndex === -1 || targetColIndex === -1) return prev;
  
        const activeTaskIndex = newColumns[originalColIndex].tasks.findIndex(t => t.id === activeId);
        if (activeTaskIndex === -1) return prev;
  
        // Remove task from original column
        const [movedTask] = newColumns[originalColIndex].tasks.splice(activeTaskIndex, 1);
  
        // Add task to new column
        if (isOverATask) {
          const overTaskIndex = newColumns[targetColIndex].tasks.findIndex(t => t.id === overId);
          newColumns[targetColIndex].tasks.splice(overTaskIndex, 0, movedTask);
        } else {
          // Dropped on a column
          newColumns[targetColIndex].tasks.push(movedTask);
        }
  
        return newColumns;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      collisionDetection={closestCorners}
    >
      <div className="flex h-full w-full gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <KanbanColumn key={col.id} column={col} updateTask={updateTaskInColumns} />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <KanbanTaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
