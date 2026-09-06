import React from 'react';
import { Project } from '../types';
import { Calendar, UserCheck, AlertCircle, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const isDelayed = project.status === 'Delayed';

  return (
    <article
      id={`project-card-${project.id}`}
      onClick={() => onSelect(project)}
      className="bg-white rounded-2xl border border-[#EAE7E1] p-4 shadow-sm hover:border-[#D6D0C7] hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
    >
      {/* Top Media & Tags */}
      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-3.5 bg-stone-100">
        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

        {/* Status Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
              isDelayed
                ? 'bg-[#FBEAEA]/95 text-[#B85C4E]'
                : 'bg-[#E8F2EA]/95 text-[#5B7B61]'
            }`}
          >
            {isDelayed ? (
              <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
            {project.status}
          </span>
        </div>

        {/* Type / Area Tag */}
        <div className="absolute top-2.5 right-2.5">
          <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-md text-white/95 text-[10px] uppercase tracking-wider font-semibold">
            {project.area}
          </span>
        </div>

        {/* Bottom overlay: Name & Client */}
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-white drop-shadow-sm flex items-center justify-between">
            <span>{project.name}</span>
            <ChevronRight className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 transition-transform text-[#D6D0C7]" />
          </h3>
          <p className="text-xs text-white/85 font-medium">
            Client: {project.client}
          </p>
        </div>
      </div>

      {/* Progress Section: Geometric clean numbers */}
      <div className="space-y-2 mb-3.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] font-medium text-[#7A756F] uppercase tracking-widest">
            Overall Progress
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-light text-[#2D2D2D] tracking-tight">
              {project.progress}
            </span>
            <span className="text-xs font-medium text-[#7A756F]">%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-[#EAE7E1] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isDelayed ? 'bg-[#B85C4E]' : 'bg-[#2D2D2D]'
            }`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Footer Info: Deadline & Site Manager */}
      <div className="pt-3 border-t border-[#EAE7E1] grid grid-cols-2 gap-2 text-xs">
        {/* Deadline */}
        <div className="flex items-center gap-1.5 text-[#555]">
          <Calendar className="w-3.5 h-3.5 text-[#7A756F] shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-[#7A756F] uppercase tracking-wider block leading-none">Deadline</span>
            <span className="font-semibold text-[#2D2D2D] mt-0.5 block">{project.deadline}</span>
          </div>
        </div>

        {/* Site Manager */}
        <div className="flex items-center gap-1.5 text-[#555]">
          <UserCheck className="w-3.5 h-3.5 text-[#7A756F] shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-[#7A756F] uppercase tracking-wider block leading-none">Supervisor</span>
            <span className="font-semibold text-[#2D2D2D] mt-0.5 block truncate">{project.siteManager}</span>
          </div>
        </div>
      </div>

      {/* Address preview */}
      <div className="mt-2.5 flex items-center gap-1 text-[11px] text-[#7A756F] truncate">
        <MapPin className="w-3 h-3 text-[#A68B67] shrink-0" />
        <span className="truncate">{project.address}</span>
      </div>
    </article>
  );
};
