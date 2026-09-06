import React from 'react';
import { Project, IssueReport } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  Image as ImageIcon,
  Plus,
  Check,
} from 'lucide-react';

interface IssuesTabProps {
  project: Project;
  issues: IssueReport[];
  onResolveIssue?: (id: string) => void;
  onReportIssue?: () => void;
  onSelectPhoto: (imageUrl: string, title?: string, room?: string) => void;
}

export const IssuesTab: React.FC<IssuesTabProps> = ({
  project,
  issues,
  onResolveIssue,
  onReportIssue,
  onSelectPhoto,
}) => {
  // Filter issues for this project
  const projectIssues = issues.filter((i) => i.projectId === project.id);

  const getSeverityBadge = (s: string) => {
    switch (s) {
      case 'Critical':
        return 'bg-[#B85C4E] text-white';
      case 'High':
        return 'bg-[#FDF3E7] text-[#D18C28]';
      case 'Medium':
        return 'bg-[#FEF3C7] text-[#B45309]';
      case 'Low':
      default:
        return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Report Action */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#7A756F] uppercase tracking-widest block">
            Snags & Quality Assurance
          </span>
          <h4 className="text-sm font-semibold text-[#2D2D2D]">
            Issue Tracker ({projectIssues.length})
          </h4>
        </div>

        {onReportIssue && (
          <button
            onClick={onReportIssue}
            className="px-3.5 py-1.5 rounded-xl bg-[#2D2D2D] hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Snag</span>
          </button>
        )}
      </div>

      {projectIssues.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#EAE7E1] space-y-2">
          <CheckCircle2 className="w-8 h-8 text-[#5B7B61] mx-auto" />
          <h4 className="text-sm font-semibold text-[#2D2D2D]">Zero Active Snags</h4>
          <p className="text-xs text-[#7A756F]">
            All quality inspections on this site are cleared and signed off!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projectIssues.map((issue) => {
            const isResolved = issue.status === 'Resolved';

            return (
              <div
                key={issue.id}
                className="p-4 rounded-2xl bg-white border border-[#EAE7E1] space-y-3 shadow-sm"
              >
                {/* Header: Severity & Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getSeverityBadge(
                        issue.severity
                      )}`}
                    >
                      {issue.severity}
                    </span>
                    <span className="text-xs font-semibold text-[#2D2D2D]">{issue.title}</span>
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isResolved
                        ? 'bg-[#E8F2EA] text-[#5B7B61]'
                        : 'bg-[#FFF1F2] text-[#B85C4E]'
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>

                {/* Location & Reported meta */}
                <div className="flex flex-wrap items-center gap-x-3 text-xs text-[#7A756F]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A68B67]" />
                    {issue.room}
                  </span>
                  <span>•</span>
                  <span>Reported by {issue.reportedBy} ({issue.reportedAt})</span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#444] leading-relaxed">{issue.description}</p>

                {/* Photo Evidence if any */}
                {issue.imageUrl && (
                  <div
                    onClick={() =>
                      onSelectPhoto(issue.imageUrl!, issue.title, issue.room)
                    }
                    className="relative aspect-video max-h-48 rounded-xl overflow-hidden bg-stone-900 border border-[#EAE7E1] cursor-pointer group"
                  >
                    <img
                      src={issue.imageUrl}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <span className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 text-[10px] text-white flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      View Defect Photo
                    </span>
                  </div>
                )}

                {/* Action Taken Box */}
                {issue.actionTaken && (
                  <div className="p-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E1] text-xs text-[#555]">
                    <strong className="text-[#2D2D2D] block mb-0.5">Remedial Action Taken:</strong>
                    {issue.actionTaken}
                  </div>
                )}

                {/* Assigned Subcontractor & Resolve button */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EAE7E1] text-xs">
                  {issue.assignedTo && (
                    <span className="text-[#7A756F]">
                      Assigned to: <strong className="text-[#2D2D2D]">{issue.assignedTo}</strong>
                    </span>
                  )}

                  {!isResolved && onResolveIssue && (
                    <button
                      onClick={() => onResolveIssue(issue.id)}
                      className="ml-auto px-4 py-1.5 rounded-full bg-[#5B7B61] hover:bg-[#4E6B53] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
