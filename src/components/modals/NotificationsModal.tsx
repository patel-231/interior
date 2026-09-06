import React from 'react';
import { X, Bell, AlertTriangle, Package, CheckCircle2 } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMaterials: () => void;
  onNavigateToIssues: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToMaterials,
  onNavigateToIssues,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#F9F8F6] w-full max-w-md sm:rounded-3xl rounded-t-3xl p-6 shadow-2xl border border-[#EAE7E1] animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE7E1] mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#A68B67]" />
            <h3 className="text-base font-light text-[#2D2D2D]">
              Site <span className="font-semibold">Notifications</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#EAE7E1] hover:bg-stone-100 text-[#2D2D2D] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div
            onClick={() => {
              onClose();
              onNavigateToIssues();
            }}
            className="p-4 rounded-2xl bg-white border border-[#FBEAEA] cursor-pointer hover:border-[#B85C4E] transition-all space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#B85C4E] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#B85C4E]" />
                Urgent Snag: Shah Residence
              </span>
              <span className="text-[10px] text-[#B85C4E] font-medium">8:30 AM</span>
            </div>
            <p className="text-[#555] text-[11px] leading-relaxed">
              Plumbing seepage detected near vertical service shaft during pressure test.
            </p>
          </div>

          <div
            onClick={() => {
              onClose();
              onNavigateToMaterials();
            }}
            className="p-4 rounded-2xl bg-white border border-[#FDF3E7] cursor-pointer hover:border-[#D18C28] transition-all space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#D18C28] flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#D18C28]" />
                Material Approval Req: Patel Office
              </span>
              <span className="text-[10px] text-[#D18C28] font-medium">Yesterday</span>
            </div>
            <p className="text-[#555] text-[11px] leading-relaxed">
              Vikram Singh requested urgent clearance for 18 Italian Fluted Walnut panels (₹1,45,000).
            </p>
          </div>

          <div
            onClick={onClose}
            className="p-4 rounded-2xl bg-white border border-[#EAE7E1] space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#2D2D2D] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5B7B61]" />
                Flooring Inspection Passed: Shah Residence
              </span>
              <span className="text-[10px] text-[#7A756F]">25m ago</span>
            </div>
            <p className="text-[#7A756F] text-[11px] leading-relaxed">
              Mirror diamond polish on Italian Statuario marble signed off by supervisor.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-full bg-white border border-[#EAE7E1] hover:bg-stone-50 text-xs font-semibold text-[#2D2D2D] transition-colors"
        >
          Close Notifications
        </button>
      </div>
    </div>
  );
};
