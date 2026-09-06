import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import {
  X,
  Calendar,
  User,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (taskId: string, newStatus: TaskStatus) => void;
  onUpdateProgress?: (taskId: string, newProgress: number) => void;
  onSelectPhoto?: (imageUrl: string, title?: string, room?: string) => void;
}

const ALL_STATUSES: TaskStatus[] = [
  'Not Started',
  'In Progress',
  'Waiting',
  'Review',
  'Completed',
];

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateProgress,
  onSelectPhoto,
}) => {
  if (!isOpen || !task) return null;

  const currentStatus: TaskStatus =
    task.status || (task.isCompleted ? 'Completed' : 'In Progress');

  const getStatusBadgeColor = (s: TaskStatus) => {
    switch (s) {
      case 'Completed':
        return 'bg-[#E8F2EA] text-[#5B7B61] border-[#5B7B61]/30';
      case 'In Progress':
        return 'bg-[#FDF3E7] text-[#D18C28] border-[#D18C28]/30';
      case 'Review':
        return 'bg-[#EDE9FE] text-[#6D28D9] border-[#6D28D9]/30';
      case 'Waiting':
        return 'bg-[#FFF1F2] text-[#E11D48] border-[#E11D48]/30';
      case 'Not Started':
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getPriorityBadgeColor = (p: string) => {
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

  return (
    <div
      id="task-detail-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#F9F8F6] w-full max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl border border-[#EAE7E1] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#EAE7E1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAE7E1] text-[#2D2D2D]">
              {task.category}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getPriorityBadgeColor(
                task.priority
              )}`}
            >
              {task.priority} Priority
            </span>
          </div>

          <button
            id="close-task-detail-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-[#2D2D2D] transition-colors"
            aria-label="Close task details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-[#2D2D2D] leading-snug">{task.title}</h3>
            <p className="text-xs text-[#7A756F] flex items-center gap-1.5 mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#A68B67]" />
              <span>Location / Room: <strong className="text-[#2D2D2D]">{task.room}</strong></span>
            </p>
          </div>

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-white rounded-xl border border-[#EAE7E1]">
              <span className="text-[10px] uppercase tracking-wider text-[#7A756F] font-semibold block">
                Assigned Tradesperson
              </span>
              <p className="font-semibold text-[#2D2D2D] mt-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#A68B67]" />
                {task.assignedTo}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#EAE7E1]">
              <span className="text-[10px] uppercase tracking-wider text-[#7A756F] font-semibold block">
                Target Deadline
              </span>
              <p className="font-semibold text-[#2D2D2D] mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#A68B67]" />
                {task.deadline || task.dueDate}
              </p>
              {task.startDate && (
                <span className="text-[10px] text-[#7A756F] block mt-0.5">
                  Started: {task.startDate}
                </span>
              )}
            </div>
          </div>

          {/* Status Selector */}
          <div className="p-4 bg-white rounded-2xl border border-[#EAE7E1] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A756F]">
                Task Execution Status
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadgeColor(
                  currentStatus
                )}`}
              >
                {currentStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
              {ALL_STATUSES.map((statusOption) => {
                const isSelected = currentStatus === statusOption;
                return (
                  <button
                    key={statusOption}
                    onClick={() => onUpdateStatus && onUpdateStatus(task.id, statusOption)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#2D2D2D] text-white border-[#2D2D2D] shadow-sm'
                        : 'bg-[#F9F8F6] text-[#7A756F] border-[#EAE7E1] hover:bg-stone-100 hover:text-[#2D2D2D]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-[#A68B67]" />}
                    <span>{statusOption}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Slider */}
          <div className="p-4 bg-white rounded-2xl border border-[#EAE7E1] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A756F]">
                Completion Progress
              </span>
              <span className="text-sm font-semibold text-[#2D2D2D]">
                {task.progress ?? (task.isCompleted ? 100 : 50)}%
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#EAE7E1] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#A68B67] transition-all"
                style={{ width: `${task.progress ?? (task.isCompleted ? 100 : 50)}%` }}
              />
            </div>

            {onUpdateProgress && (
              <div className="flex items-center gap-2 pt-2">
                {[0, 25, 50, 75, 100].map((val) => (
                  <button
                    key={val}
                    onClick={() => onUpdateProgress(task.id, val)}
                    className="flex-1 py-1 rounded-lg text-[10px] font-bold border border-[#EAE7E1] bg-[#F9F8F6] hover:bg-stone-200 text-[#2D2D2D]"
                  >
                    {val}%
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          {task.notes && (
            <div className="p-4 bg-white rounded-2xl border border-[#EAE7E1] space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A756F] flex items-center gap-1">
                <FileText className="w-3 h-3 text-[#A68B67]" />
                Supervisor & Specification Notes
              </span>
              <p className="text-xs text-[#444] leading-relaxed italic bg-[#F9F8F6] p-3 rounded-xl border border-[#EAE7E1]">
                "{task.notes}"
              </p>
            </div>
          )}

          {/* Photos */}
          {task.photos && task.photos.length > 0 && (
            <div className="p-4 bg-white rounded-2xl border border-[#EAE7E1] space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A756F] flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-[#A68B67]" />
                Site Photo Evidence ({task.photos.length})
              </span>
              <div className="grid grid-cols-2 gap-2">
                {task.photos.map((photo, i) => (
                  <div
                    key={i}
                    onClick={() => onSelectPhoto && onSelectPhoto(photo, task.title, task.room)}
                    className="group relative aspect-video rounded-xl overflow-hidden bg-stone-900 border border-[#EAE7E1] cursor-pointer"
                  >
                    <img
                      src={photo}
                      alt={`Task documentation photo ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#EAE7E1] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#2D2D2D] text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
