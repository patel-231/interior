import React, { useState } from 'react';
import { MaterialRequest } from '../types';
import {
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  Truck,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

interface MaterialsViewProps {
  requests: MaterialRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onOpenNewRequestModal: () => void;
  isOwnerRole: boolean;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  requests,
  onApprove,
  onReject,
  onOpenNewRequestModal,
  isOwnerRole,
}) => {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved'>('All');

  const filteredRequests = requests.filter((r) => {
    if (filter === 'All') return true;
    return r.status === filter;
  });

  const pendingTotal = requests
    .filter((r) => r.status === 'Pending')
    .reduce((acc, curr) => {
      const num = parseInt((curr.estimatedCost || '0').replace(/[^0-9]/g, ''), 10);
      return acc + (isNaN(num) ? 0 : num);
    }, 0);

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-[#2D2D2D]">
            Material <span className="font-semibold">Procurement</span>
          </h1>
          <p className="text-xs text-[#7A756F] italic">Site POs, indent approvals & vendor tracking</p>
        </div>
        <button
          id="btn-new-material-request"
          onClick={onOpenNewRequestModal}
          className="px-4 py-2 rounded-full bg-[#2D2D2D] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#A68B67]" />
          <span>New Indent</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-[#7A756F] mb-2 font-medium">Pending Approval</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-light text-[#D18C28]">
              {requests.filter((r) => r.status === 'Pending').length}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D18C28] bg-[#FDF3E7] px-2 py-0.5 rounded">
              Needs Review
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-[#7A756F] mb-2 font-medium">Approved & Active</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-light text-[#5B7B61]">
              {requests.filter((r) => r.status === 'Approved').length}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B7B61] bg-[#E8F2EA] px-2 py-0.5 rounded">
              In Transit
            </span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-[#7A756F] mb-2 font-medium">Est. Pending Value</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-light text-[#2D2D2D]">
              ₹{(pendingTotal / 1000).toFixed(0)}k
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A756F] bg-[#F9F8F6] border border-[#EAE7E1] px-2 py-0.5 rounded">
              INR
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setFilter('All')}
          className={`px-4 py-1.5 rounded-full font-medium transition-all ${
            filter === 'All'
              ? 'bg-[#2D2D2D] text-white shadow-xs'
              : 'bg-white border border-[#EAE7E1] text-[#7A756F] hover:text-[#2D2D2D]'
          }`}
        >
          All Requests ({requests.length})
        </button>
        <button
          onClick={() => setFilter('Pending')}
          className={`px-4 py-1.5 rounded-full font-medium transition-all ${
            filter === 'Pending'
              ? 'bg-[#D18C28] text-white shadow-xs'
              : 'bg-white border border-[#EAE7E1] text-[#7A756F] hover:text-[#D18C28]'
          }`}
        >
          Pending ({requests.filter((r) => r.status === 'Pending').length})
        </button>
        <button
          onClick={() => setFilter('Approved')}
          className={`px-4 py-1.5 rounded-full font-medium transition-all ${
            filter === 'Approved'
              ? 'bg-[#5B7B61] text-white shadow-xs'
              : 'bg-white border border-[#EAE7E1] text-[#7A756F] hover:text-[#5B7B61]'
          }`}
        >
          Approved ({requests.filter((r) => r.status === 'Approved').length})
        </button>
      </div>

      {/* Materials List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EAE7E1] p-10 text-center shadow-sm">
            <Package className="w-8 h-8 text-[#7A756F] mx-auto mb-2" />
            <p className="text-xs text-[#7A756F] italic">No material requests found in this status.</p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-[#EAE7E1] p-5 shadow-sm hover:border-[#D6D0C7] transition-all space-y-3"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#2D2D2D]">
                      {req.projectName}
                    </span>
                    <span className="text-xs text-[#7A756F]">• {req.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#2D2D2D] leading-snug">
                    {req.itemName}
                  </h3>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      req.status === 'Pending'
                        ? 'bg-[#FDF3E7] text-[#D18C28]'
                        : 'bg-[#E8F2EA] text-[#5B7B61]'
                    }`}
                  >
                    {req.status}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      req.urgency === 'Urgent'
                        ? 'bg-[#FBEAEA] text-[#B85C4E]'
                        : req.urgency === 'High'
                        ? 'bg-[#FDF3E7] text-[#D18C28]'
                        : 'bg-[#F9F8F6] text-[#7A756F] border border-[#EAE7E1]'
                    }`}
                  >
                    {req.urgency} Urgency
                  </span>
                </div>
              </div>

              {/* Details grid */}
              <div className="bg-[#F9F8F6] p-3.5 rounded-xl border border-[#EAE7E1] grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-[#7A756F] uppercase tracking-wider block font-medium">Quantity</span>
                  <span className="font-semibold text-[#2D2D2D] mt-0.5 block">{req.quantity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A756F] uppercase tracking-wider block font-medium">Est. Amount</span>
                  <span className="font-bold text-[#2D2D2D] mt-0.5 block">{req.estimatedCost}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[#7A756F] uppercase tracking-wider block font-medium">Vendor Partner</span>
                  <span className="font-semibold text-[#2D2D2D] mt-0.5 block truncate">{req.vendor}</span>
                </div>
              </div>

              {/* Specs */}
              {req.specs && (
                <p className="text-xs text-[#555] italic">
                  <strong>Specifications:</strong> {req.specs}
                </p>
              )}

              {/* Footer: Requester info and Action Buttons */}
              <div className="pt-3 border-t border-[#EAE7E1] flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-[#7A756F]">
                  Requested by {req.requestedBy} • {req.requestedDate}
                </span>

                {isOwnerRole && req.status === 'Pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReject(req.id)}
                      className="px-3 py-1.5 rounded-full border border-[#EAE7E1] text-xs font-medium text-[#7A756F] hover:text-[#2D2D2D] hover:bg-stone-50 flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                    <button
                      onClick={() => onApprove(req.id)}
                      className="px-3.5 py-1.5 rounded-full bg-[#A68B67] hover:bg-[#8E7554] text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Indent</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
