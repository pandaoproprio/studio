// src/components/projects/kanban/TaskEditDialog.tsx
import * as React from 'react';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import type { Task, Subtask } from "@/lib/types";

interface TaskEditDialogProps {
    task: Task;
    onUpdate: (task: Task) => void;
    children: React.ReactNode;
}

export function TaskEditDialog({ task, onUpdate, children }: TaskEditDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editedTask, setEditedTask] = useState(task);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

    const handleSave = () => {
        onUpdate(editedTask);
        setIsOpen(false);
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
        setEditedTask(prev => ({ ...prev, tags }));
    }

    const handleSubtaskChange = (subtaskId: string, completed: boolean) => {
        setEditedTask(prev => ({
            ...prev,
            subtasks: prev.subtasks.map(st => st.id === subtaskId ? {...st, completed} : st)
        }))
    }

    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubtaskTitle.trim()) return;
        const newSubtask: Subtask = {
            id: `sub-${Date.now()}`,
            title: newSubtaskTitle.trim(),
            completed: false
        }
        setEditedTask(prev => ({...prev, subtasks: [...prev.subtasks, newSubtask]}));
        setNewSubtaskTitle("");
    }
    
    const handleRemoveSubtask = (subtaskId: string) => {
        setEditedTask(prev => ({
            ...prev,
            subtasks: prev.subtasks.filter(st => st.id !== subtaskId)
        }))
    }

    // Reset state if dialog is closed without saving
    React.useEffect(() => {
        if (isOpen) {
            setEditedTask(task);
        }
    }, [isOpen, task]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Editar Tarefa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input 
                            id="title" 
                            value={editedTask.title}
                            onChange={(e) => setEditedTask(prev => ({...prev, title: e.target.value}))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea 
                            id="description" 
                            rows={4}
                            value={editedTask.description}
                            onChange={(e) => setEditedTask(prev => ({...prev, description: e.target.value}))}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="priority">Prioridade</Label>
                            <Select 
                                value={editedTask.priority} 
                                onValueChange={(value: "low" | "medium" | "high" | "urgent") => setEditedTask(prev => ({...prev, priority: value}))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a prioridade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Baixa</SelectItem>
                                    <SelectItem value="medium">Média</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                    <SelectItem value="urgent">Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                            <Input 
                                id="tags" 
                                value={editedTask.tags.join(', ')}
                                onChange={handleTagsChange}
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <Label>Subtarefas</Label>
                        <div className="space-y-2">
                            {editedTask.subtasks.map(subtask => (
                                <div key={subtask.id} className="flex items-center gap-2 group">
                                    <Checkbox 
                                        id={subtask.id} 
                                        checked={subtask.completed}
                                        onCheckedChange={(checked) => handleSubtaskChange(subtask.id, !!checked)}
                                    />
                                    <label htmlFor={subtask.id} className="flex-1 text-sm">{subtask.title}</label>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveSubtask(subtask.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                         <form onSubmit={handleAddSubtask} className="flex gap-2">
                            <Input 
                                placeholder="Adicionar nova subtarefa..."
                                value={newSubtaskTitle}
                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                            />
                            <Button type="submit" variant="secondary">
                                <Plus className="h-4 w-4 mr-2" /> Adicionar
                            </Button>
                        </form>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Salvar Alterações</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
