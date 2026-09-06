import React, { useState } from 'react';
import { Project, Task, SiteUpdate } from '../types';
import {
  HardHat,
  Camera,
  TrendingUp,
  PackagePlus,
  AlertOctagon,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ChevronRight,
  Square,
  ArrowRight,
  Check,
  Calendar,
  Layers,
} from 'lucide-react';

interface WorkerHomeProps {
  currentProject: Project;
  allProjects: Project[];
  onSelectCurrentProject: (projectId: string) => void;
  tasks: Task[];
  onToggleTaskCompletion: (taskId: string) => void;
  onOpenTaskDetail: (task: Task) => void;
  onOpenUpdateProgress: (task?: Task) => void;
  onOpenPhotoUpload: () => void;
  onOpenMaterialRequest: () => void;
  onOpenReportProblem: () => void;
  onViewAllTasks?: () => void;
}

export const WorkerHome: React.FC<WorkerHomeProps> = ({
  currentProject,
  allProjects,
  onSelectCurrentProject,
  tasks,
  onToggleTaskCompletion,
  onOpenTaskDetail,
  onOpenUpdateProgress,
  onOpenPhotoUpload,
  onOpenMaterialRequest,
  onOpenReportProblem,
  onViewAllTasks,
}) => {
  // Filter tasks for current site
  const siteTasks = tasks.filter((t) => t.projectId === currentProject.id);

  // Today's tasks: tasks due today or currently active/in-progress
  const todaysTasks = siteTasks.filter(
    (t) =>
      t.dueDate.toLowerCase().includes('today') ||
      t.deadline?.toLowerCase().includes('today') ||
      !t.isCompleted
  );

  const completedCount = siteTasks.filter((t) => t.isCompleted).length;
  const pendingCount = siteTasks.filter((t) => !t.isCompleted).length;

  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Done'>('All');

  const filteredTasks = todaysTasks.filter((t) => {
    if (activeFilter === 'Pending') return !t.isCompleted;
    if (activeFilter === 'Done') return t.isCompleted;
    return true;
  });

  // Friendly progress label
  const getProgressLabel = (p: number) => {
    if (p >= 100) return 'Completed';
    if (p >= 75) return 'Almost Done';
    if (p >= 50) return 'Half Done';
    if (p > 0) return 'Started';
    return 'Not Started';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ================= 1. CURRENT SITE ================= */}
      <section id="section-current-site">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5B7B61] animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#7A756F]">
              Current Site
            </h2>
          </div>

          {/* Quick site switcher for workers on multiple sites */}
          {allProjects.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#7A756F] hidden sm:inline">Switch Site:</span>
              <select
                id="worker-site-select"
                value={currentProject.id}
                onChange={(e) => onSelectCurrentProject(e.target.value)}
                className="text-xs font-bold bg-white border border-[#EAE7E1] text-[#2D2D2D] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#A68B67] shadow-xs cursor-pointer"
              >
                {allProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.progress}%)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Current Site Card */}
        <div className="bg-white rounded-3xl border border-[#EAE7E1] overflow-hidden shadow-sm">
          {/* Site Banner with Photo */}
          <div className="relative aspect-[16/8] sm:aspect-[21/8] bg-stone-100 overflow-hidden">
            <img
              src={currentProject.imageUrl}
              alt={currentProject.name}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

            {/* Site Details Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 backdrop-blur-md text-white/90 inline-block mb-1">
                    {currentProject.type}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm truncate">
                    {currentProject.name}
                  </h1>
                  <p className="text-xs text-white/85 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A68B67] shrink-0" />
                    <span className="truncate">{currentProject.address}</span>
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider block ${
                      currentProject.status === 'Delayed'
                        ? 'bg-[#FBEAEA] text-[#B85C4E]'
                        : 'bg-[#E8F2EA] text-[#5B7B61]'
                    }`}
                  >
                    {currentProject.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Site Progress & Team Info (No finance/budget) */}
          <div className="p-4 sm:p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A756F] block">
                  Overall Site Progress
                </span>
                <span className="text-xs font-semibold text-[#2D2D2D]">
                  Target: {currentProject.deadline}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-[#2D2D2D]">
                  {currentProject.progress}
                </span>
                <span className="text-sm font-bold text-[#7A756F]">%</span>
              </div>
            </div>

            {/* Geometric Clean Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[#EAE7E1] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#2D2D2D] transition-all duration-500"
                style={{ width: `${currentProject.progress}%` }}
              />
            </div>

            {/* Site In-Charge / Supervisor */}
            <div className="pt-2 border-t border-[#EAE7E1] flex items-center justify-between text-xs text-[#7A756F]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#F5F4F0] flex items-center justify-center text-[#2D2D2D]">
                  <HardHat className="w-3.5 h-3.5 text-[#A68B67]" />
                </div>
                <span>Supervisor: <strong className="text-[#2D2D2D]">{currentProject.siteManager}</strong></span>
              </div>
              <span>{siteTasks.length} total tasks</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. QUICK ACTIONS ================= */}
      <section id="section-quick-actions">
        <div className="mb-2.5 px-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#7A756F]">
            Quick Actions
          </h2>
        </div>

        {/* 4 Large Touch-Friendly Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* 1. Update Progress */}
          <button
            id="worker-quick-action-update-progress"
            onClick={() => onOpenUpdateProgress()}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EAE7E1] hover:border-[#2D2D2D] hover:shadow-md transition-all text-left group flex flex-col justify-between shadow-xs active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#2D2D2D] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <TrendingUp className="w-6 h-6 text-[#A68B67] stroke-[2.2]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#2D2D2D] block">
                Update Progress
              </span>
              <span className="text-xs text-[#7A756F] mt-0.5 block leading-tight">
                Log stage % & photos
              </span>
            </div>
          </button>

          {/* 2. Upload Site Photos */}
          <button
            id="worker-quick-action-upload-photos"
            onClick={onOpenPhotoUpload}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EAE7E1] hover:border-[#A68B67] hover:shadow-md transition-all text-left group flex flex-col justify-between shadow-xs active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#A68B67] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <Camera className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#2D2D2D] block">
                Upload Site Photos
              </span>
              <span className="text-xs text-[#7A756F] mt-0.5 block leading-tight">
                Snap rooms & proof
              </span>
            </div>
          </button>

          {/* 3. Request Material */}
          <button
            id="worker-quick-action-request-material"
            onClick={onOpenMaterialRequest}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EAE7E1] hover:border-[#2D2D2D] hover:shadow-md transition-all text-left group flex flex-col justify-between shadow-xs active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F5F4F0] border border-[#EAE7E1] text-[#2D2D2D] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <PackagePlus className="w-6 h-6 text-[#2D2D2D] stroke-[2.2]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#2D2D2D] block">
                Request Material
              </span>
              <span className="text-xs text-[#7A756F] mt-0.5 block leading-tight">
                Ply, hardware, paint
              </span>
            </div>
          </button>

          {/* 4. Report Problem */}
          <button
            id="worker-quick-action-report-problem"
            onClick={onOpenReportProblem}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EAE7E1] hover:border-[#B85C4E] hover:shadow-md transition-all text-left group flex flex-col justify-between shadow-xs active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#B85C4E] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <AlertOctagon className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#B85C4E] block">
                Report Problem
              </span>
              <span className="text-xs text-[#7A756F] mt-0.5 block leading-tight">
                Leak, mismatch, hazard
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* ================= 3. TODAY'S WORK ================= */}
      <section id="section-todays-work">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#7A756F]">
              Today's Work
            </h2>
            <p className="text-xs text-[#7A756F]">
              Tap any task card to view instructions and reference images
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-[#EAE7E1]/60 p-1 rounded-xl gap-1">
            {(['All', 'Pending', 'Done'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === filter
                    ? 'bg-white text-[#2D2D2D] shadow-xs'
                    : 'text-[#7A756F] hover:text-[#2D2D2D]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Large Touch-Friendly Cards */}
        <div className="space-y-3.5">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#EAE7E1] shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-[#5B7B61] mx-auto mb-2" />
              <h3 className="text-base font-bold text-[#2D2D2D]">
                No Pending Tasks for Today!
              </h3>
              <p className="text-xs text-[#7A756F] mt-1 max-w-xs mx-auto">
                All scheduled work for today is up to date on this site.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const currentProgress = task.progress ?? (task.isCompleted ? 100 : 25);
              return (
                <div
                  key={task.id}
                  id={`worker-task-card-${task.id}`}
                  onClick={() => onOpenTaskDetail(task)}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer group shadow-sm hover:shadow-md ${
                    task.isCompleted
                      ? 'bg-[#F9F8F6] border-[#EAE7E1] opacity-75'
                      : 'bg-white border-[#EAE7E1] hover:border-[#A68B67]'
                  }`}
                >
                  {/* Top Bar: Category, Room & Priority */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#2D2D2D] text-white">
                        {task.category}
                      </span>
                      <span className="text-xs font-semibold text-[#A68B67] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#A68B67]" />
                        {task.room}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        task.priority === 'High'
                          ? 'bg-[#FBEAEA] text-[#B85C4E]'
                          : task.priority === 'Medium'
                          ? 'bg-[#FDF3E7] text-[#D18C28]'
                          : 'bg-[#F5F4F0] text-[#7A756F]'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Task Name - Large, legible, touch-friendly */}
                  <h3
                    className={`text-base sm:text-lg font-bold leading-snug tracking-tight mb-3 ${
                      task.isCompleted ? 'line-through text-[#7A756F]' : 'text-[#2D2D2D]'
                    }`}
                  >
                    {task.title}
                  </h3>

                  {/* Progress & Deadline Bar */}
                  <div className="bg-[#F9F8F6] p-3 rounded-2xl border border-[#EAE7E1] mb-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#B85C4E]" />
                        <span className="font-semibold text-[#2D2D2D]">
                          {task.deadline || task.dueDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 font-bold">
                        <span className="text-[#2D2D2D]">{currentProgress}%</span>
                        <span className="text-[#7A756F]">
                          ({getProgressLabel(currentProgress)})
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-[#EAE7E1] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#5B7B61] rounded-full transition-all duration-300"
                        style={{ width: `${currentProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Bottom Touch Actions */}
                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#EAE7E1]/70">
                    {/* Quick Complete Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTaskCompletion(task.id);
                      }}
                      className="flex items-center gap-2 text-xs font-semibold text-[#7A756F] hover:text-[#2D2D2D] py-1"
                    >
                      {task.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-[#5B7B61]" />
                      ) : (
                        <Square className="w-5 h-5 text-[#A68B67]" />
                      )}
                      <span>{task.isCompleted ? 'Finished' : 'Mark Done'}</span>
                    </button>

                    {/* Prominent Update Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenUpdateProgress(task);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#2D2D2D] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs group-hover:scale-105 transition-all"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-[#A68B67]" />
                      <span>Update</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
