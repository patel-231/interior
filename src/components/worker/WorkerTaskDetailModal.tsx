import React, { useState } from 'react';
import { Task } from '../../types';
import {
  X,
  MapPin,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Image as ImageIcon,
  ArrowRight,
  ClipboardList,
  Eye,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';

interface WorkerTaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenUpdateProgress: (task: Task) => void;
  onToggleTaskCompletion?: (taskId: string) => void;
  onSelectPhoto?: (imageUrl: string, title?: string, room?: string) => void;
}

export const WorkerTaskDetailModal: React.FC<WorkerTaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onOpenUpdateProgress,
  onToggleTaskCompletion,
  onSelectPhoto,
}) => {
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  if (!isOpen || !task) return null;

  // Fallback instructions if not explicitly in mockData
  const displayInstructions =
    task.instructions ||
    (task.notes
      ? `Site guideline: ${task.notes}`
      : `1. Check site work area and clear dust.\n2. Execute work strictly according to approved room layout.\n3. Keep safety gear on at all times.\n4. Take progress photo and report any snags promptly.`);

  // Reference images (either specific task reference images or fallback references based on category)
  const displayReferenceImages =
    task.referenceImages && task.referenceImages.length > 0
      ? task.referenceImages
      : task.photos && task.photos.length > 0
      ? task.photos
      : [
          'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
        ];

  const currentProgress = task.progress ?? (task.isCompleted ? 100 : 25);
  const currentStatus = task.status || (task.isCompleted ? 'Completed' : 'In Progress');

  // Friendly progress label
  const getProgressLabel = (p: number) => {
    if (p >= 100) return 'Completed';
    if (p >= 75) return 'Almost Done';
    if (p >= 50) return 'Half Done';
    if (p > 0) return 'Started';
    return 'Not Started';
  };

  const handlePhotoClick = (url: string) => {
    if (onSelectPhoto) {
      onSelectPhoto(url, task.title, task.room);
    } else {
      setLightboxPhoto(url);
    }
  };

  return (
    <div
      id="worker-task-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="worker-task-detail-modal"
        className="bg-white w-full max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl border border-[#EAE7E1] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-[#F9F8F6] border-b border-[#EAE7E1] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#2D2D2D] text-white">
              {task.category}
            </span>
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                task.priority === 'High'
                  ? 'bg-[#FBEAEA] text-[#B85C4E]'
                  : task.priority === 'Medium'
                  ? 'bg-[#FDF3E7] text-[#D18C28]'
                  : 'bg-[#F5F4F0] text-[#7A756F]'
              }`}
            >
              {task.priority} Priority
            </span>
          </div>

          <button
            id="worker-task-close-btn"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-[#EAE7E1] hover:bg-stone-100 flex items-center justify-center text-[#2D2D2D] transition-colors shadow-xs"
            aria-label="Close task details"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* 1. Task Name & Location */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#A68B67] uppercase tracking-wider mb-1.5">
              <MapPin className="w-4 h-4 shrink-0 text-[#A68B67]" />
              <span>{task.room} • {task.projectName}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D2D2D] leading-snug tracking-tight">
              {task.title}
            </h2>
          </div>

          {/* 2. Progress & Deadline Overview Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Current Progress */}
            <div className="bg-[#F9F8F6] p-4 rounded-2xl border border-[#EAE7E1]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A756F] block mb-1">
                Current Progress
              </span>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-2xl font-bold text-[#2D2D2D]">{currentProgress}%</span>
                <span className="text-xs font-semibold text-[#A68B67]">
                  ({getProgressLabel(currentProgress)})
                </span>
              </div>
              <div className="w-full h-2 bg-[#EAE7E1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#5B7B61] rounded-full transition-all duration-500"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
            </div>

            {/* Deadline */}
            <div className="bg-[#F9F8F6] p-4 rounded-2xl border border-[#EAE7E1]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A756F] block mb-1">
                Deadline
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-4 h-4 text-[#B85C4E] shrink-0" />
                <span className="text-sm font-bold text-[#2D2D2D] leading-tight">
                  {task.deadline || task.dueDate}
                </span>
              </div>
              <span className="text-[11px] text-[#7A756F] block mt-1">
                Assigned: {task.assignedTo || 'Site Team'}
              </span>
            </div>
          </div>

          {/* 3. Instructions */}
          <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#E8DFC8]">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-5 h-5 text-[#A68B67]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#5C5346]">
                Site Instructions & Steps
              </h3>
            </div>
            <div className="text-sm text-[#2D2D2D] whitespace-pre-line leading-relaxed font-medium">
              {displayInstructions}
            </div>
          </div>

          {/* 4. Reference Images if available */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#2D2D2D]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#7A756F]">
                  Reference Drawings & Images
                </h3>
              </div>
              <span className="text-[11px] font-medium text-[#7A756F]">
                {displayReferenceImages.length} available (Tap to expand)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {displayReferenceImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => handlePhotoClick(imgUrl)}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#EAE7E1] bg-stone-100 cursor-pointer group shadow-xs hover:border-[#A68B67] transition-colors"
                >
                  <img
                    src={imgUrl}
                    alt={`Reference ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px] font-semibold bg-black/60 backdrop-blur-xs px-2 py-1 rounded-lg">
                    <span>Reference #{idx + 1}</span>
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick toggle completion option */}
          {onToggleTaskCompletion && (
            <div
              onClick={() => onToggleTaskCompletion(task.id)}
              className="p-3.5 rounded-2xl bg-[#F9F8F6] border border-[#EAE7E1] flex items-center gap-3 cursor-pointer hover:bg-stone-100 transition-colors"
            >
              {task.isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-[#5B7B61] shrink-0" />
              ) : (
                <Square className="w-6 h-6 text-[#A68B67] shrink-0" />
              )}
              <div className="flex-1">
                <span className="text-xs font-bold text-[#2D2D2D] block">
                  {task.isCompleted ? 'Marked as Finished' : 'Mark Task as Completed'}
                </span>
                <span className="text-[11px] text-[#7A756F]">
                  {task.isCompleted
                    ? 'Tap to re-open if further work is needed'
                    : 'Tap to instantly complete if all steps are done'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action: Prominent Update Progress Button */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#EAE7E1] shrink-0 space-y-2">
          <button
            id="worker-btn-modal-update-progress"
            onClick={() => {
              onClose();
              onOpenUpdateProgress(task);
            }}
            className="w-full py-4 px-6 rounded-2xl bg-[#2D2D2D] hover:bg-black text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] transition-all"
          >
            <TrendingUp className="w-5 h-5 text-[#A68B67]" />
            <span>Update Progress</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>

      {/* Embedded Lightbox if no parent lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxPhoto}
            alt="Reference preview"
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
};
