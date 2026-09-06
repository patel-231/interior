import React from 'react';
import { X, MapPin } from 'lucide-react';

interface PhotoLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  room?: string;
  timestamp?: string;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  room,
  timestamp,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      id="photo-lightbox-modal"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="w-full max-w-4xl flex items-center justify-between text-white/90 py-3 px-2 mb-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-0.5">
          {room && (
            <span className="flex items-center gap-1.5 text-xs text-[#A68B67] font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {room}
            </span>
          )}
          {title && <h3 className="text-sm font-semibold text-white">{title}</h3>}
          {timestamp && <p className="text-[11px] text-stone-400">{timestamp}</p>}
        </div>

        <button
          id="close-lightbox-btn"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          aria-label="Close photo preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        className="max-w-4xl max-h-[80vh] w-full flex items-center justify-center overflow-hidden rounded-2xl border border-stone-800 bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title || 'Site photo preview'}
          className="max-w-full max-h-[80vh] object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};
