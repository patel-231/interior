import React, { useState } from 'react';
import { Project, SiteUpdate } from '../../types';
import { X, Camera, Upload, MapPin, Check } from 'lucide-react';

interface WorkerPhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onAddUpdate: (update: SiteUpdate) => void;
}

const SAMPLE_PHOTOS = [
  {
    title: 'Ceiling Framing & Cutouts',
    url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Wardrobe Shutter Joinery',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Bath Plumbing Pressure Test',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Wall Primer & Texture',
    url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
  },
];

export const WorkerPhotoUploadModal: React.FC<WorkerPhotoUploadModalProps> = ({
  isOpen,
  onClose,
  project,
  onAddUpdate,
}) => {
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>(SAMPLE_PHOTOS[0].url);
  const [room, setRoom] = useState<string>(project.rooms[0]?.name || 'Living Room');
  const [caption, setCaption] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUpdate: SiteUpdate = {
      id: `up-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      author: project.siteManager || 'Worker Team',
      authorRole: 'Site Worker',
      timestamp: 'Just now',
      room: room,
      description: caption || `Site progress photo uploaded for ${room}.`,
      type: 'Photo',
      imageUrl: selectedPhotoUrl,
      tags: ['Site Photo', room],
    };
    onAddUpdate(newUpdate);
    onClose();
  };

  return (
    <div
      id="worker-photo-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl border border-[#EAE7E1] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 bg-[#F9F8F6] border-b border-[#EAE7E1] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A68B67] block">
              Site Direct Action
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#2D2D2D]">
              Upload Site Photo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#EAE7E1] hover:bg-stone-100 flex items-center justify-center text-[#2D2D2D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Selected photo preview */}
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#EAE7E1] bg-stone-100">
            <img
              src={selectedPhotoUrl}
              alt="Site preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-xl text-white text-xs">
              <span className="truncate">{room}</span>
              <span className="text-[10px] font-bold uppercase">Ready</span>
            </div>
          </div>

          {/* Large Camera / File Inputs */}
          <div className="grid grid-cols-2 gap-2.5">
            <label className="p-3 rounded-xl bg-[#F9F8F6] border border-[#EAE7E1] hover:border-[#A68B67] flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs font-bold text-[#2D2D2D]">
              <Camera className="w-4 h-4 text-[#A68B67]" />
              <span>Camera</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedPhotoUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </label>

            <label className="p-3 rounded-xl bg-[#F9F8F6] border border-[#EAE7E1] hover:border-[#A68B67] flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs font-bold text-[#2D2D2D]">
              <Upload className="w-4 h-4 text-[#A68B67]" />
              <span>Gallery</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedPhotoUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </label>
          </div>

          {/* Quick sample site photos */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756F] block mb-1.5">
              Or tap sample site photo:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_PHOTOS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPhotoUrl(s.url)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedPhotoUrl === s.url
                      ? 'border-[#2D2D2D] ring-2 ring-[#2D2D2D]/20 scale-95'
                      : 'border-[#EAE7E1] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={s.url} alt={s.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Location / Room */}
          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1">
              Room / Location
            </label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-2xl px-4 py-3 text-xs font-semibold text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
            >
              {project.rooms.map((r, i) => (
                <option key={i} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Caption / Note */}
          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1">
              Short Description (Optional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Aluminum profiles snapped in; no visible joints."
              className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-2xl px-4 py-3 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
            />
          </div>

          <div className="pt-2">
            <button
              id="worker-submit-photo-btn"
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-[#2D2D2D] hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Check className="w-5 h-5 text-[#5B7B61]" />
              <span>Upload Site Photo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
