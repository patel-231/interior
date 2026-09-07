import React, { useState } from 'react';
import { Project, MaterialRequest, UrgencyLevel } from '../../types';
import { X, PackagePlus, AlertCircle, Check } from 'lucide-react';

interface WorkerMaterialRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onAddMaterialRequest: (request: MaterialRequest) => void;
}

const COMMON_MATERIALS = [
  '12mm BWP Marine Plywood',
  '24V COB LED Strip (3000K Warm White)',
  'CPVC Solvent Cement (500ml)',
  'Gypsum Board 12.5mm (Saint Gobain)',
  'Asian Paints Royale Base Putty (40kg)',
  'Hafele Soft-Close Hinges (Cranked 8°)',
];

export const WorkerMaterialRequestModal: React.FC<WorkerMaterialRequestModalProps> = ({
  isOpen,
  onClose,
  project,
  onAddMaterialRequest,
}) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('Carpentry');
  const [room, setRoom] = useState(project.rooms[0]?.name || 'Living Room');
  const [urgency, setUrgency] = useState<UrgencyLevel>('Urgent');
  const [specs, setSpecs] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !quantity.trim()) return;

    const newRequest: MaterialRequest = {
      id: `mat-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      itemName: itemName.trim(),
      quantity: quantity.trim(),
      category: category,
      requestedBy: project.siteManager || 'Site Worker Team',
      requestedDate: 'Today',
      urgency: urgency,
      status: 'Pending',
      specs: specs ? `${room}: ${specs}` : `Needed for ${room}`,
    };

    onAddMaterialRequest(newRequest);
    onClose();
  };

  return (
    <div
      id="worker-material-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl border border-[#EAE7E1] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 bg-[#F9F8F6] border-b border-[#EAE7E1] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2D2D2D] text-white flex items-center justify-center">
              <PackagePlus className="w-4 h-4 text-[#A68B67]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#A68B67] block">
                Site Direct Action
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#2D2D2D]">
                Request Material (Indent)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#EAE7E1] hover:bg-stone-100 flex items-center justify-center text-[#2D2D2D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Quick Item Presets */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756F] block mb-1.5">
              Quick tap common site item:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_MATERIALS.map((mat, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setItemName(mat)}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F9F8F6] border border-[#EAE7E1] hover:border-[#A68B67] text-[#2D2D2D] transition-colors"
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1">
              Material / Item Name *
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. 19mm Commercial Ply or 4-inch Wire Nails"
              className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-2xl px-4 py-3 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
            />
          </div>

          {/* Quantity & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#2D2D2D] block mb-1">
                Quantity Needed *
              </label>
              <input
                type="text"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 6 sheets / 20 boxes"
                className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-2xl px-4 py-3 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#2D2D2D] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-2xl px-3 py-3 text-xs font-semibold text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
              >
                <option value="Carpentry">Carpentry</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Civil">Civil</option>
                <option value="Ceiling">Ceiling</option>
                <option value="Painting">Painting</option>
                <option value="Finishing">Finishing</option>
              </select>
            </div>
          </div>

          {/* Room / Location */}
          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1">
              Where is it needed?
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

          {/* Urgency */}
          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1.5">
              Urgency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'Urgent'] as UrgencyLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setUrgency(lvl)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                    urgency === lvl
                      ? lvl === 'Urgent'
                        ? 'bg-[#FBEAEA] text-[#B85C4E] border-[#B85C4E]'
                        : 'bg-[#2D2D2D] text-white border-[#2D2D2D]'
                      : 'bg-[#F9F8F6] text-[#7A756F] border-[#EAE7E1]'
                  }`}
                >
                  {lvl === 'Urgent' ? '🚨 Work Stopped' : lvl === 'Medium' ? '⚡ Tomorrow' : 'Standard'}
                </button>
              ))}
            </div>
          </div>

          {/* Notes / Specs */}
          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1">
              Specific Brand or Size (Optional)
            </label>
            <input
              type="text"
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              placeholder="e.g. Greenply Club Plus or Finolex heavy gauge"
              className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-2xl px-4 py-3 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
            />
          </div>

          <div className="pt-2">
            <button
              id="worker-submit-material-btn"
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-[#2D2D2D] hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Check className="w-5 h-5 text-[#5B7B61]" />
              <span>Send Material Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
