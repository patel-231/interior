import React from 'react';
import { Project, SiteUpdate } from '../../types';
import {
  Clock,
  User,
  MapPin,
  Image as ImageIcon,
  Tag,
  Plus,
  Layers,
  Sparkles,
  Search,
} from 'lucide-react';

interface UpdatesTabProps {
  project: Project;
  updates: SiteUpdate[];
  onSelectPhoto: (imageUrl: string, title?: string, room?: string, timestamp?: string) => void;
  onAddUpdate?: () => void;
}

export const UpdatesTab: React.FC<UpdatesTabProps> = ({
  project,
  updates,
  onSelectPhoto,
  onAddUpdate,
}) => {
  // Filter updates for this project
  const projectUpdates = updates.filter((u) => u.projectId === project.id);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Progress':
        return 'bg-[#E8F2EA] text-[#5B7B61]';
      case 'Inspection':
        return 'bg-[#EDE9FE] text-[#6D28D9]';
      case 'Snag':
        return 'bg-[#FBEAEA] text-[#B85C4E]';
      case 'Photo':
        return 'bg-[#FDF3E7] text-[#D18C28]';
      case 'Delivery':
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#7A756F] uppercase tracking-widest block">
            Daily Execution Log
          </span>
          <h4 className="text-sm font-semibold text-[#2D2D2D]">
            Site Updates & Timeline ({projectUpdates.length})
          </h4>
        </div>

        {onAddUpdate && (
          <button
            onClick={onAddUpdate}
            className="px-3.5 py-1.5 rounded-xl bg-[#2D2D2D] hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Update</span>
          </button>
        )}
      </div>

      {projectUpdates.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#EAE7E1] space-y-2">
          <Clock className="w-8 h-8 text-[#A68B67] mx-auto opacity-70" />
          <h4 className="text-sm font-semibold text-[#2D2D2D]">No updates recorded yet</h4>
          <p className="text-xs text-[#7A756F]">
            Site supervisor updates and progress photos will appear here.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#EAE7E1]">
          {projectUpdates.map((update) => (
            <div key={update.id} className="relative group">
              {/* Timeline marker node */}
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-[#A68B67] flex items-center justify-center shadow-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2D2D2D]" />
              </div>

              {/* Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#EAE7E1] shadow-sm space-y-3">
                {/* Meta row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getTypeBadge(
                        update.type
                      )}`}
                    >
                      {update.type}
                    </span>
                    <span className="text-xs font-semibold text-[#2D2D2D] flex items-center gap-1">
                      <User className="w-3 h-3 text-[#A68B67]" />
                      {update.author} ({update.authorRole})
                    </span>
                  </div>

                  <span className="text-[11px] text-[#7A756F] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {update.timestamp}
                  </span>
                </div>

                {/* Location / Room Tag */}
                <div className="flex items-center gap-1.5 text-xs text-[#7A756F]">
                  <MapPin className="w-3.5 h-3.5 text-[#A68B67]" />
                  <span>Zone: <strong className="text-[#2D2D2D]">{update.room}</strong></span>
                  {update.progressPercentage && (
                    <span className="ml-auto text-[11px] font-semibold text-[#5B7B61] bg-[#E8F2EA] px-2 py-0.5 rounded-full">
                      Site at {update.progressPercentage}%
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-[#333] leading-relaxed">{update.description}</p>

                {/* Attached Image if any */}
                {update.imageUrl && (
                  <div
                    onClick={() =>
                      onSelectPhoto(
                        update.imageUrl!,
                        update.description,
                        update.room,
                        update.timestamp
                      )
                    }
                    className="relative aspect-video rounded-xl overflow-hidden bg-stone-900 border border-[#EAE7E1] cursor-pointer group/img"
                  >
                    <img
                      src={update.imageUrl}
                      alt={update.description}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover/img:bg-transparent transition-colors" />
                    <span className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      View Full Photo
                    </span>
                  </div>
                )}

                {/* Tags */}
                {update.tags && update.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    {update.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#F9F8F6] text-[#7A756F] border border-[#EAE7E1]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
