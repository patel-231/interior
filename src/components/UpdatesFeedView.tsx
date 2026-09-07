import React, { useState } from 'react';
import { SiteUpdate, Project } from '../types';
import {
  Clock,
  Camera,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Filter,
  MessageSquare,
  Plus,
  Share2,
} from 'lucide-react';

interface UpdatesFeedViewProps {
  updates: SiteUpdate[];
  projects: Project[];
  onOpenAddUpdate: () => void;
  currentProjectId?: string;
}

export const UpdatesFeedView: React.FC<UpdatesFeedViewProps> = ({
  updates,
  projects,
  onOpenAddUpdate,
  currentProjectId,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(currentProjectId || 'all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredUpdates = updates.filter((u) => {
    const matchesProject = selectedProjectId === 'all' || u.projectId === selectedProjectId;
    const matchesType = typeFilter === 'all' || u.type === typeFilter;
    return matchesProject && matchesType;
  });

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-[#2D2D2D]">
            Site <span className="font-semibold">Updates & Logs</span>
          </h1>
          <p className="text-xs text-[#7A756F] italic">Real-time visual construction diary</p>
        </div>
        <button
          onClick={onOpenAddUpdate}
          className="px-4 py-2 rounded-full bg-[#2D2D2D] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#A68B67]" />
          <span>Add Log</span>
        </button>
      </div>

      {/* Filter controls */}
      <div className="space-y-3">
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#2D2D2D] focus:outline-none focus:border-[#A68B67] shadow-xs transition-colors"
        >
          <option value="all">All Sites Feed</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {['all', 'Progress', 'Photo', 'Snag', 'Inspection'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-1.5 rounded-full capitalize font-medium transition-all shrink-0 ${
                typeFilter === t
                  ? 'bg-[#2D2D2D] text-white shadow-xs'
                  : 'bg-white border border-[#EAE7E1] text-[#7A756F] hover:text-[#2D2D2D]'
              }`}
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filteredUpdates.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EAE7E1] p-10 text-center shadow-sm">
            <MessageSquare className="w-8 h-8 text-[#7A756F] mx-auto mb-2" />
            <p className="text-xs text-[#7A756F] italic">No updates recorded for this criteria.</p>
          </div>
        ) : (
          filteredUpdates.map((update) => (
            <article
              key={update.id}
              className="bg-white rounded-2xl border border-[#EAE7E1] p-5 shadow-sm hover:border-[#D6D0C7] transition-all space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#F9F8F6] text-[#2D2D2D] font-bold text-xs flex items-center justify-center border border-[#EAE7E1]">
                    {update.author.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#2D2D2D]">{update.author}</span>
                      <span className="text-[10px] text-[#7A756F]">({update.authorRole})</span>
                    </div>
                    <span className="text-[11px] text-[#7A756F] block">
                      {update.projectName} • {update.room}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      update.type === 'Snag'
                        ? 'bg-[#FBEAEA] text-[#B85C4E]'
                        : update.type === 'Inspection'
                        ? 'bg-[#E8F2EA] text-[#5B7B61]'
                        : 'bg-[#FDF3E7] text-[#D18C28]'
                    }`}
                  >
                    {update.type}
                  </span>
                  <span className="text-[10px] text-[#7A756F]">{update.timestamp}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#555] leading-relaxed">
                {update.description}
              </p>

              {/* Photo */}
              {update.imageUrl && (
                <div className="aspect-[16/10] sm:aspect-[21/9] rounded-xl overflow-hidden border border-[#EAE7E1] bg-stone-100">
                  <img
                    src={update.imageUrl}
                    alt={update.room}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Tags & Percentage */}
              <div className="pt-2.5 border-t border-[#EAE7E1] flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {update.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2.5 py-0.5 bg-[#F9F8F6] text-[#7A756F] rounded-full font-medium border border-[#EAE7E1]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {update.progressPercentage && (
                  <span className="text-xs font-semibold text-[#2D2D2D]">
                    Progress: {update.progressPercentage}%
                  </span>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
