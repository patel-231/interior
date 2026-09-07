import React, { useState } from 'react';
import { Project, MaterialRequest, MaterialRequestStatus } from '../../types';
import {
  Package,
  Plus,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  Building,
  DollarSign,
  Check,
} from 'lucide-react';

interface MaterialsTabProps {
  project: Project;
  materialRequests: MaterialRequest[];
  onApproveMaterial?: (id: string) => void;
  onRequestMaterial?: () => void;
}

const STATUS_FILTERS: Array<MaterialRequestStatus | 'All'> = [
  'All',
  'Pending',
  'Approved',
  'Ordered',
  'Delivered',
];

export const MaterialsTab: React.FC<MaterialsTabProps> = ({
  project,
  materialRequests,
  onApproveMaterial,
  onRequestMaterial,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<MaterialRequestStatus | 'All'>('All');

  // Filter materials for this project
  const projectMaterials = materialRequests.filter((m) => m.projectId === project.id);

  const filteredMaterials = projectMaterials.filter((m) => {
    return selectedStatus === 'All' || m.status === selectedStatus;
  });

  const getUrgencyBadge = (u: string) => {
    switch (u) {
      case 'Urgent':
        return 'bg-[#B85C4E] text-white';
      case 'High':
        return 'bg-[#FDF3E7] text-[#D18C28]';
      case 'Medium':
      case 'Low':
      default:
        return 'bg-stone-100 text-stone-600';
    }
  };

  const getStatusBadge = (s: MaterialRequestStatus) => {
    switch (s) {
      case 'Approved':
        return 'bg-[#E8F2EA] text-[#5B7B61]';
      case 'Ordered':
        return 'bg-[#EDE9FE] text-[#6D28D9]';
      case 'Delivered':
        return 'bg-[#E0F2FE] text-[#0284C7]';
      case 'Rejected':
        return 'bg-[#FBEAEA] text-[#B85C4E]';
      case 'Pending':
      default:
        return 'bg-[#FDF3E7] text-[#D18C28]';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Add Action */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all border ${
                selectedStatus === s
                  ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]'
                  : 'bg-white text-[#7A756F] border-[#EAE7E1] hover:text-[#2D2D2D]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {onRequestMaterial && (
          <button
            onClick={onRequestMaterial}
            className="px-3.5 py-1.5 rounded-xl bg-[#2D2D2D] hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Requisition</span>
          </button>
        )}
      </div>

      {/* Materials List */}
      {filteredMaterials.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#EAE7E1] space-y-2">
          <Package className="w-8 h-8 text-[#A68B67] mx-auto opacity-70" />
          <h4 className="text-sm font-semibold text-[#2D2D2D]">No materials match this filter</h4>
          <p className="text-xs text-[#7A756F]">
            No requisitions found under "{selectedStatus}".
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              className="p-4 rounded-2xl bg-white border border-[#EAE7E1] space-y-3 shadow-sm"
            >
              {/* Top Row: Category, Urgency, Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAE7E1] text-[#2D2D2D]">
                    {mat.category}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getUrgencyBadge(
                      mat.urgency
                    )}`}
                  >
                    {mat.urgency}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getStatusBadge(
                    mat.status
                  )}`}
                >
                  {mat.status}
                </span>
              </div>

              {/* Title & Quantity */}
              <div>
                <h4 className="text-sm font-semibold text-[#2D2D2D] leading-snug">{mat.itemName}</h4>
                <p className="text-xs text-[#7A756F] mt-1 font-medium">
                  Quantity Required: <strong className="text-[#2D2D2D]">{mat.quantity}</strong>
                </p>
              </div>

              {/* Specifications */}
              {mat.specs && (
                <div className="p-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E1] text-xs text-[#555]">
                  <strong className="text-[#2D2D2D] block mb-0.5">Specification:</strong>
                  {mat.specs}
                </div>
              )}

              {/* Vendor & Estimated Cost Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EAE7E1] text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#7A756F] uppercase tracking-wider block">
                    Vendor / Supplier
                  </span>
                  <span className="font-semibold text-[#2D2D2D] flex items-center gap-1">
                    <Building className="w-3 h-3 text-[#A68B67]" />
                    {mat.vendor || 'Preferred vendor pending'}
                  </span>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-[10px] text-[#7A756F] uppercase tracking-wider block">
                    Estimated Cost
                  </span>
                  <span className="text-sm font-semibold text-[#2D2D2D]">
                    {mat.estimatedCost || 'Quote Pending'}
                  </span>
                </div>
              </div>

              {/* Approval Actions */}
              {mat.status === 'Pending' && onApproveMaterial && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onApproveMaterial(mat.id)}
                    className="px-4 py-1.5 rounded-full bg-[#5B7B61] hover:bg-[#4E6B53] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Requisition</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
