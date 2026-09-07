import React, { useState } from 'react';
import { Task, Project } from '../types';
import {
  CheckSquare,
  Square,
  CheckCircle2,
  Plus,
  Filter,
  Search,
  Calendar,
  AlertCircle,
  Tag,
} from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (taskId: string) => void;
  onOpenAddTaskModal: () => void;
  onOpenTaskDetail?: (task: Task) => void;
  currentProjectId?: string;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  projects,
  onToggleTask,
  onOpenAddTaskModal,
  onOpenTaskDetail,
  currentProjectId,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(currentProjectId || 'all');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('Pending');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter((t) => {
    const matchesProject = selectedProjectId === 'all' || t.projectId === selectedProjectId;
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Pending'
        ? !t.isCompleted
        : t.isCompleted;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesProject && matchesStatus && matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Carpentry', 'Electrical', 'Plumbing', 'Civil', 'Finishing'];

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-[#2D2D2D]">
            Site <span className="font-semibold">Tasks</span>
          </h1>
          <p className="text-xs text-[#7A756F] italic">Daily checklists & trade execution</p>
        </div>
        <button
          id="btn-add-task"
          onClick={onOpenAddTaskModal}
          className="px-4 py-2 rounded-full bg-[#2D2D2D] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#A68B67]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Project Selector & Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#2D2D2D] focus:outline-none focus:border-[#A68B67] shadow-xs flex-1 transition-colors"
          >
            <option value="all">All Construction Sites ({tasks.length} tasks)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#7A756F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, room or tradesperson..."
            className="w-full bg-white border border-[#EAE7E1] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#2D2D2D] placeholder:text-[#7A756F] focus:outline-none focus:border-[#A68B67] shadow-xs transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-4 py-1.5 rounded-full font-medium transition-all ${
                statusFilter === 'Pending'
                  ? 'bg-[#2D2D2D] text-white shadow-xs'
                  : 'bg-white border border-[#EAE7E1] text-[#7A756F]'
              }`}
            >
              Pending ({tasks.filter((t) => !t.isCompleted).length})
            </button>
            <button
              onClick={() => setStatusFilter('Completed')}
              className={`px-4 py-1.5 rounded-full font-medium transition-all ${
                statusFilter === 'Completed'
                  ? 'bg-[#5B7B61] text-white shadow-xs'
                  : 'bg-white border border-[#EAE7E1] text-[#7A756F]'
              }`}
            >
              Completed ({tasks.filter((t) => t.isCompleted).length})
            </button>
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-4 py-1.5 rounded-full font-medium transition-all ${
                statusFilter === 'All'
                  ? 'bg-[#2D2D2D] text-white shadow-xs'
                  : 'bg-white border border-[#EAE7E1] text-[#7A756F]'
              }`}
            >
              All ({tasks.length})
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EAE7E1] p-10 text-center shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-[#5B7B61] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#2D2D2D]">All caught up!</p>
            <p className="text-xs text-[#7A756F] mt-1">No tasks matching your active filters.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => {
                if (onOpenTaskDetail) {
                  onOpenTaskDetail(task);
                } else {
                  onToggleTask(task.id);
                }
              }}
              className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 shadow-xs hover:border-[#D6D0C7] ${
                task.isCompleted ? 'bg-[#F9F8F6] border-[#EAE7E1] opacity-70' : 'border-[#EAE7E1]'
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTask(task.id);
                }}
                className="mt-0.5 text-[#2D2D2D] shrink-0"
              >
                {task.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-[#5B7B61]" />
                ) : (
                  <Square className="w-5 h-5 text-[#7A756F] hover:text-[#2D2D2D]" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-xs font-semibold leading-snug ${
                      task.isCompleted ? 'line-through text-[#7A756F]' : 'text-[#2D2D2D]'
                    }`}
                  >
                    {task.title}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                      task.priority === 'High'
                        ? 'bg-[#FBEAEA] text-[#B85C4E]'
                        : task.priority === 'Medium'
                        ? 'bg-[#FDF3E7] text-[#D18C28]'
                        : 'bg-[#F9F8F6] text-[#7A756F] border border-[#EAE7E1]'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#7A756F] mt-1">
                  <span className="font-semibold text-[#2D2D2D] bg-[#F9F8F6] px-2 py-0.5 rounded border border-[#EAE7E1]">
                    {task.projectName}
                  </span>
                  <span>•</span>
                  <span>{task.room}</span>
                  <span>•</span>
                  <span>{task.category}</span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#EAE7E1] text-[11px] text-[#7A756F]">
                  <span>Assigned: {task.assignedTo}</span>
                  <span className="font-medium text-[#2D2D2D]">{task.dueDate}</span>
                </div>

                {task.notes && (
                  <p className="text-[11px] text-[#555] mt-1.5 bg-[#F9F8F6] p-2 rounded-xl text-xs border border-[#EAE7E1] italic">
                    {task.notes}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
