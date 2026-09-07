import React, { useState } from 'react';
import { Project, Task, TaskCategory, TaskStatus } from '../../types';
import {
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Plus,
  SlidersHorizontal,
  Layers,
  Wrench,
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Armchair,
  Sparkles,
} from 'lucide-react';

interface WorkTabProps {
  project: Project;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onToggleTask?: (taskId: string) => void;
  onUpdateStatus?: (taskId: string, status: TaskStatus) => void;
  onSelectPhoto: (imageUrl: string, title?: string, room?: string) => void;
  onAddTask?: () => void;
}

const WORK_CATEGORIES: TaskCategory[] = [
  'Civil',
  'Electrical',
  'Plumbing',
  'Ceiling',
  'Carpentry',
  'Painting',
  'Furniture',
  'Finishing',
];

const ALL_STATUSES: Array<TaskStatus | 'All'> = [
  'All',
  'In Progress',
  'Waiting',
  'Review',
  'Completed',
  'Not Started',
];

export const WorkTab: React.FC<WorkTabProps> = ({
  project,
  tasks,
  onSelectTask,
  onToggleTask,
  onUpdateStatus,
  onSelectPhoto,
  onAddTask,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks belonging to this project
  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  // Apply filters
  const filteredTasks = projectTasks.filter((t) => {
    const taskStatus: TaskStatus = t.status || (t.isCompleted ? 'Completed' : 'In Progress');
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || taskStatus === selectedStatus;
    const matchesSearch =
      searchQuery.trim() === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesStatus && matchesSearch;
  });

  const getCategoryIcon = (cat: TaskCategory) => {
    switch (cat) {
      case 'Civil':
        return <Layers className="w-3.5 h-3.5" />;
      case 'Electrical':
        return <Zap className="w-3.5 h-3.5" />;
      case 'Plumbing':
        return <Droplets className="w-3.5 h-3.5" />;
      case 'Ceiling':
        return <SlidersHorizontal className="w-3.5 h-3.5" />;
      case 'Carpentry':
        return <Hammer className="w-3.5 h-3.5" />;
      case 'Painting':
        return <Paintbrush className="w-3.5 h-3.5" />;
      case 'Furniture':
        return <Armchair className="w-3.5 h-3.5" />;
      case 'Finishing':
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const getStatusBadge = (status?: TaskStatus, isCompleted?: boolean) => {
    const s: TaskStatus = status || (isCompleted ? 'Completed' : 'In Progress');
    switch (s) {
      case 'Completed':
        return { label: 'Completed', cls: 'bg-[#E8F2EA] text-[#5B7B61] border-[#5B7B61]/30' };
      case 'In Progress':
        return { label: 'In Progress', cls: 'bg-[#FDF3E7] text-[#D18C28] border-[#D18C28]/30' };
      case 'Review':
        return { label: 'Review', cls: 'bg-[#EDE9FE] text-[#6D28D9] border-[#6D28D9]/30' };
      case 'Waiting':
        return { label: 'Waiting', cls: 'bg-[#FFF1F2] text-[#E11D48] border-[#E11D48]/30' };
      case 'Not Started':
      default:
        return { label: 'Not Started', cls: 'bg-stone-100 text-stone-600 border-stone-200' };
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'High':
        return 'bg-[#FBEAEA] text-[#B85C4E]';
      case 'Medium':
        return 'bg-[#FDF3E7] text-[#D18C28]';
      case 'Low':
      default:
        return 'bg-stone-100 text-stone-600';
    }
  };

  // Group tasks by category if "All" is selected, or display list
  const categoriesToDisplay = selectedCategory === 'All' ? WORK_CATEGORIES : [selectedCategory];

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, workers, rooms..."
            className="w-full pl-3.5 pr-4 py-2 bg-white rounded-xl border border-[#EAE7E1] text-xs text-[#2D2D2D] placeholder-[#7A756F] focus:outline-none focus:border-[#A68B67]"
          />
        </div>

        {onAddTask && (
          <button
            id="add-task-worktab-btn"
            onClick={onAddTask}
            className="px-4 py-2 rounded-xl bg-[#2D2D2D] hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        )}
      </div>

      {/* Category Pills Slider */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756F] block">
          Work Trade Categories (8)
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
              selectedCategory === 'All'
                ? 'bg-[#2D2D2D] text-white border-[#2D2D2D] shadow-sm'
                : 'bg-white text-[#7A756F] border-[#EAE7E1] hover:text-[#2D2D2D]'
            }`}
          >
            <span>All Trades</span>
            <span className="text-[10px] opacity-75">({projectTasks.length})</span>
          </button>

          {WORK_CATEGORIES.map((cat) => {
            const count = projectTasks.filter((t) => t.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#2D2D2D] text-white border-[#2D2D2D] shadow-sm'
                    : 'bg-white text-[#7A756F] border-[#EAE7E1] hover:text-[#2D2D2D]'
                }`}
              >
                <span className={isSelected ? 'text-[#A68B67]' : 'text-[#7A756F]'}>
                  {getCategoryIcon(cat)}
                </span>
                <span>{cat}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter Row */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        {ALL_STATUSES.map((statusOpt) => (
          <button
            key={statusOpt}
            onClick={() => setSelectedStatus(statusOpt)}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedStatus === statusOpt
                ? 'bg-[#EAE7E1] text-[#2D2D2D] font-bold'
                : 'text-[#7A756F] hover:text-[#2D2D2D]'
            }`}
          >
            {statusOpt}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#EAE7E1] space-y-2">
          <Wrench className="w-8 h-8 text-[#A68B67] mx-auto opacity-70" />
          <h4 className="text-sm font-semibold text-[#2D2D2D]">No tasks match this filter</h4>
          <p className="text-xs text-[#7A756F] max-w-xs mx-auto">
            Try choosing a different category or status filter, or add a new task for this trade.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {categoriesToDisplay.map((category) => {
            const catTasks = filteredTasks.filter((t) => t.category === category);
            if (catTasks.length === 0) return null;

            return (
              <div key={category} className="space-y-2.5">
                {/* Category Header */}
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D] flex items-center gap-1.5">
                    <span className="text-[#A68B67]">{getCategoryIcon(category)}</span>
                    <span>{category}</span>
                    <span className="text-[11px] font-normal text-[#7A756F]">
                      ({catTasks.length} {catTasks.length === 1 ? 'task' : 'tasks'})
                    </span>
                  </h4>
                </div>

                {/* Cards for this category */}
                <div className="space-y-2.5">
                  {catTasks.map((task) => {
                    const statusInfo = getStatusBadge(task.status, task.isCompleted);
                    const taskProgress = task.progress ?? (task.isCompleted ? 100 : 50);

                    return (
                      <div
                        key={task.id}
                        onClick={() => onSelectTask(task)}
                        className="p-4 rounded-2xl bg-white border border-[#EAE7E1] hover:border-[#A68B67]/60 transition-all shadow-sm cursor-pointer space-y-3 group"
                      >
                        {/* Top Line: Category, Status, Priority */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusInfo.cls}`}
                            >
                              {statusInfo.label}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getPriorityBadge(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <span className="text-[11px] text-[#7A756F] font-medium">
                            {task.room}
                          </span>
                        </div>

                        {/* Title */}
                        <div>
                          <h5 className="text-sm font-semibold text-[#2D2D2D] group-hover:text-[#A68B67] transition-colors leading-snug">
                            {task.title}
                          </h5>
                        </div>

                        {/* Assigned Worker, Dates, & Progress */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#7A756F] pt-1 border-t border-[#EAE7E1]">
                          <div className="flex items-center gap-1.5 truncate">
                            <User className="w-3.5 h-3.5 text-[#A68B67] shrink-0" />
                            <span className="truncate">
                              Assigned: <strong className="text-[#2D2D2D]">{task.assignedTo}</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 justify-start sm:justify-end">
                            <Calendar className="w-3.5 h-3.5 text-[#A68B67] shrink-0" />
                            <span>
                              Deadline: <strong className="text-[#2D2D2D]">{task.deadline || task.dueDate}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-[#7A756F]">
                            <span>Progress</span>
                            <span className="font-semibold text-[#2D2D2D]">{taskProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#EAE7E1] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#2D2D2D] group-hover:bg-[#A68B67] transition-colors"
                              style={{ width: `${taskProgress}%` }}
                            />
                          </div>
                        </div>

                        {/* Photos & Notes Snippet */}
                        <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                          {task.photos && task.photos.length > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-[#7A756F] flex items-center gap-1">
                                <ImageIcon className="w-3.5 h-3.5 text-[#A68B67]" />
                                {task.photos.length} {task.photos.length === 1 ? 'photo' : 'photos'}
                              </span>
                              <div className="flex -space-x-1 overflow-hidden">
                                {task.photos.slice(0, 3).map((photo, i) => (
                                  <img
                                    key={i}
                                    src={photo}
                                    alt="thumb"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onSelectPhoto(photo, task.title, task.room);
                                    }}
                                    className="w-5 h-5 rounded-full object-cover border border-white"
                                    referrerPolicy="no-referrer"
                                  />
                                ))}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-stone-400 italic">No photos</span>
                          )}

                          {task.notes && (
                            <span className="text-[11px] text-[#7A756F] flex items-center gap-1 truncate max-w-[200px]">
                              <FileText className="w-3 h-3 text-[#A68B67] shrink-0" />
                              <span className="truncate italic">"{task.notes}"</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
