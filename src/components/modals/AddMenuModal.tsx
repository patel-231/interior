import React from 'react';
import { UserRole } from '../../types';
import {
  X,
  Camera,
  TrendingUp,
  PackagePlus,
  AlertOctagon,
  Building,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { ModalType } from './ActionModal';

interface AddMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectAction: (type: ModalType) => void;
}

export const AddMenuModal: React.FC<AddMenuModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#F9F8F6] w-full max-w-md sm:rounded-3xl rounded-t-3xl p-6 shadow-2xl border border-[#EAE7E1] animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE7E1] mb-5">
          <div>
            <h3 className="text-xl font-light text-[#2D2D2D]">
              {currentRole === 'OWNER' ? 'Studio ' : 'Record '}
              <span className="font-semibold">{currentRole === 'OWNER' ? 'Quick Action' : 'Site Update'}</span>
            </h3>
            <p className="text-xs text-[#7A756F] italic mt-0.5">
              {currentRole === 'OWNER' ? 'Deploy resources to field sites' : 'Log field progress and materials'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#EAE7E1] hover:bg-stone-100 text-[#2D2D2D] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Options */}
        <div className="grid grid-cols-2 gap-3">
          {currentRole === 'OWNER' && (
            <button
              onClick={() => onSelectAction('project')}
              className="p-4 rounded-2xl bg-white border border-[#EAE7E1] hover:border-[#A68B67] hover:shadow-sm text-left group transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-[#2D2D2D] text-[#A68B67] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Building className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#2D2D2D] block">New Site</span>
              <span className="text-[11px] text-[#7A756F] block leading-tight mt-0.5">
                Setup new client site
              </span>
            </button>
          )}

          <button
            onClick={() => onSelectAction('progress')}
            className="p-4 rounded-2xl bg-white border border-[#EAE7E1] hover:border-[#A68B67] hover:shadow-sm text-left group transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-[#2D2D2D] text-[#A68B67] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#2D2D2D] block">Progress Log</span>
            <span className="text-[11px] text-[#7A756F] block leading-tight mt-0.5">
              Update completion %
            </span>
          </button>

          <button
            onClick={() => onSelectAction('photo')}
            className="p-4 rounded-2xl bg-white border border-[#EAE7E1] hover:border-[#A68B67] hover:shadow-sm text-left group transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-[#A68B67] text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#2D2D2D] block">Upload Photo</span>
            <span className="text-[11px] text-[#7A756F] block leading-tight mt-0.5">
              Snap room progress
            </span>
          </button>

          <button
            onClick={() => onSelectAction('material')}
            className="p-4 rounded-2xl bg-white border border-[#EAE7E1] hover:border-[#A68B67] hover:shadow-sm text-left group transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-[#F9F8F6] border border-[#EAE7E1] text-[#2D2D2D] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <PackagePlus className="w-4 h-4 text-[#A68B67]" />
            </div>
            <span className="text-xs font-semibold text-[#2D2D2D] block">Material Order</span>
            <span className="text-[11px] text-[#7A756F] block leading-tight mt-0.5">
              Request ply, fittings
            </span>
          </button>

          <button
            onClick={() => onSelectAction('task')}
            className="p-4 rounded-2xl bg-white border border-[#EAE7E1] hover:border-[#A68B67] hover:shadow-sm text-left group transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-[#2D2D2D] text-[#A68B67] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#2D2D2D] block">Add Task</span>
            <span className="text-[11px] text-[#7A756F] block leading-tight mt-0.5">
              Assign trade checklist
            </span>
          </button>

          <button
            onClick={() => onSelectAction('issue')}
            className="p-4 rounded-2xl bg-white border border-[#FBEAEA] hover:border-[#B85C4E] hover:shadow-sm text-left group transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-[#FBEAEA] text-[#B85C4E] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#B85C4E] block">Report Snag</span>
            <span className="text-[11px] text-[#B85C4E]/80 block leading-tight mt-0.5">
              Flag leak or delay
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
