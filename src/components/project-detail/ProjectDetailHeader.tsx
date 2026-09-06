import React from 'react';
import { Project } from '../../types';
import { X, MapPin, Calendar, CheckCircle2, AlertTriangle, User } from 'lucide-react';

interface ProjectDetailHeaderProps {
  project: Project;
  onClose: () => void;
}

export const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({ project, onClose }) => {
  const isDelayed = project.status === 'Delayed';

  return (
    <div className="relative w-full bg-[#1C1A18] text-white shrink-0 overflow-hidden">
      {/* Background Image with Scrim */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[300px] w-full overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-full object-cover object-center brightness-75 scale-105 transition-transform duration-700 hover:scale-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A18] via-black/45 to-black/35" />

        {/* Top Controls */}
        <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-10">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase inline-flex items-center gap-1.5 shadow-sm ${
                isDelayed
                  ? 'bg-[#B85C4E] text-white'
                  : 'bg-[#5B7B61] text-white'
              }`}
            >
              {isDelayed ? (
                <AlertTriangle className="w-3 h-3" />
              ) : (
                <CheckCircle2 className="w-3 h-3" />
              )}
              {project.status}
            </span>

            {project.type && (
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-[11px] font-medium bg-white/20 backdrop-blur-md text-white/90">
                {project.type}
              </span>
            )}
          </div>

          {/* Close Modal Button */}
          <button
            id="close-project-header-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/90 text-white flex items-center justify-center transition-all border border-white/10"
            aria-label="Close project detail modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Hero Info */}
        <div className="absolute bottom-3 left-4 right-4 z-10 space-y-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#A68B67]">
              Interior Design Execution
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white mt-0.5">
              {project.name}
            </h1>
          </div>

          {/* Client & Address row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/90">
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-[#A68B67]" />
              <span className="text-stone-300">Client:</span> {project.client}
            </span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="flex items-center gap-1.5 font-normal text-white/80">
              <MapPin className="w-3.5 h-3.5 text-[#A68B67] shrink-0" />
              <span className="truncate max-w-[280px] sm:max-w-md">{project.address}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Meta Bar: Start Date, Expected Completion, Overall Progress */}
      <div className="bg-[#24211E] px-4 py-3 sm:px-6 border-b border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-6 divide-x divide-stone-700/60">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium block">
              Start Date
            </span>
            <span className="font-semibold text-stone-200 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#A68B67]" />
              {project.startDate}
            </span>
          </div>

          <div className="pl-6 space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium block">
              Expected Completion
            </span>
            <span className="font-semibold text-stone-200 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#A68B67]" />
              {project.deadline}
            </span>
          </div>
        </div>

        {/* Overall Progress Widget */}
        <div className="flex items-center gap-3 sm:w-64 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-700/60">
          <div className="flex-1 space-y-1">
            <div className="flex items-baseline justify-between text-[11px]">
              <span className="text-stone-400 font-medium uppercase tracking-wider text-[10px]">
                Overall Progress
              </span>
              <span className="font-semibold text-white text-sm">
                {project.progress}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isDelayed ? 'bg-[#B85C4E]' : 'bg-[#A68B67]'
                }`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
