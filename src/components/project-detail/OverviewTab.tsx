import React from 'react';
import { Project, Task, MaterialRequest, IssueReport, SiteUpdate, TaskStatus } from '../../types';
import {
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Phone,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckSquare,
} from 'lucide-react';

interface OverviewTabProps {
  project: Project;
  tasks: Task[];
  materialRequests: MaterialRequest[];
  issues: IssueReport[];
  updates: SiteUpdate[];
  onSelectTab: (tab: 'work' | 'materials' | 'updates' | 'issues' | 'files') => void;
  onSelectPhoto: (imageUrl: string, title?: string, room?: string, timestamp?: string) => void;
  onToggleTask?: (taskId: string) => void;
  onSelectTask?: (task: Task) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  project,
  tasks,
  materialRequests,
  issues,
  updates,
  onSelectTab,
  onSelectPhoto,
  onToggleTask,
  onSelectTask,
}) => {
  const isDelayed = project.status === 'Delayed';

  // Filter tasks for this project
  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  // Today's work: tasks with dueDate including "Today" or in progress
  const todaysTasks = projectTasks.filter(
    (t) =>
      t.dueDate.toLowerCase().includes('today') ||
      t.status === 'In Progress' ||
      t.status === 'Review'
  );

  // Fallback to top 4 tasks if none specifically say Today
  const activeTasks = todaysTasks.length > 0 ? todaysTasks.slice(0, 4) : projectTasks.slice(0, 4);

  // Material warnings: urgent or pending requisitions for this project
  const materialWarnings = materialRequests
    .filter((m) => m.projectId === project.id && (m.urgency === 'Urgent' || m.urgency === 'High' || m.status === 'Pending'))
    .slice(0, 3);

  // Current problems: open snags or critical issues for this project
  const currentProblems = issues
    .filter((i) => i.projectId === project.id && i.status !== 'Resolved')
    .slice(0, 3);

  // Recent site photos: gather photos from updates and tasks
  const recentPhotos: Array<{ url: string; room?: string; timestamp?: string; caption?: string }> = [];
  updates
    .filter((u) => u.projectId === project.id && u.imageUrl)
    .forEach((u) => {
      recentPhotos.push({
        url: u.imageUrl!,
        room: u.room,
        timestamp: u.timestamp,
        caption: u.description,
      });
    });

  projectTasks.forEach((t) => {
    if (t.photos && t.photos.length > 0) {
      t.photos.forEach((photo) => {
        if (!recentPhotos.some((p) => p.url === photo)) {
          recentPhotos.push({
            url: photo,
            room: t.room,
            timestamp: t.deadline || 'Recent',
            caption: t.title,
          });
        }
      });
    }
  });

  const displayPhotos = recentPhotos.slice(0, 6);

  // Status badge styling helper
  const getStatusBadge = (status?: TaskStatus, isCompleted?: boolean) => {
    const s = status || (isCompleted ? 'Completed' : 'In Progress');
    switch (s) {
      case 'Completed':
        return 'bg-[#E8F2EA] text-[#5B7B61]';
      case 'In Progress':
        return 'bg-[#FDF3E7] text-[#D18C28]';
      case 'Review':
        return 'bg-[#EDE9FE] text-[#6D28D9]';
      case 'Waiting':
        return 'bg-[#FFF1F2] text-[#E11D48]';
      case 'Not Started':
      default:
        return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Current Phase & Project Progress Card */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-[#7A756F] uppercase tracking-widest block">
              Active Project Phase
            </span>
            <h3 className="text-base font-semibold text-[#2D2D2D] mt-0.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#A68B67]" />
              {project.currentPhase || 'Phase 3: Millwork & MEP Execution'}
            </h3>
          </div>

          <div className="flex items-baseline gap-2 bg-[#F9F8F6] px-3.5 py-1.5 rounded-xl border border-[#EAE7E1] self-start sm:self-auto">
            <span className="text-[11px] text-[#7A756F] font-medium">Site Progress:</span>
            <span className="text-2xl font-light text-[#2D2D2D]">{project.progress}%</span>
          </div>
        </div>

        {/* Geometric Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2.5 rounded-full bg-[#EAE7E1] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isDelayed ? 'bg-[#B85C4E]' : 'bg-[#2D2D2D]'
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#7A756F]">
            <span>Started: {project.startDate}</span>
            <span>Handover: {project.deadline}</span>
          </div>
        </div>

        {/* Room / Zone Execution Highlights */}
        {project.rooms && project.rooms.length > 0 && (
          <div className="pt-2 border-t border-[#EAE7E1]">
            <span className="text-[10px] font-semibold text-[#7A756F] uppercase tracking-wider block mb-2">
              Zone Execution Status
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {project.rooms.slice(0, 4).map((r, i) => (
                <div key={i} className="p-2 rounded-xl bg-[#F9F8F6] border border-[#EAE7E1] text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-[#2D2D2D] truncate">{r.name}</span>
                    <span className="text-[11px] text-[#7A756F]">{r.progress}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-[#EAE7E1] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#A68B67]"
                      style={{ width: `${r.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Estimated Completion & Workers on Site Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Estimated Completion Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE7E1] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#7A756F] uppercase tracking-widest">
                Estimated Completion
              </span>
              <Calendar className="w-4 h-4 text-[#A68B67]" />
            </div>
            <p className="text-xl font-light text-[#2D2D2D] mt-2">{project.deadline}</p>
            <p className="text-xs text-[#7A756F] mt-1">
              {isDelayed ? (
                <span className="text-[#B85C4E] font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Currently delayed by 6 days
                </span>
              ) : (
                <span className="text-[#5B7B61] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Execution schedule on track
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EAE7E1] flex items-center justify-between text-xs text-[#7A756F]">
            <span>Total Sanctioned:</span>
            <span className="font-semibold text-[#2D2D2D]">{project.totalBudget || 'Sanctioned'}</span>
          </div>
        </div>

        {/* Workers On Site Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE7E1] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#7A756F] uppercase tracking-widest">
                Workers On Site
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#EAE7E1] text-[#2D2D2D]">
                {project.workersOnSiteCount || 18} Present Today
              </span>
            </div>

            <p className="text-xs text-[#555] mt-2 font-medium">
              {project.workersBreakdown ||
                '6 Carpenters, 4 Electricians, 3 Plumbers, 2 Polishers, 3 Helpers'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EAE7E1] flex items-center justify-between text-xs">
            <span className="text-[#7A756F]">Site Manager:</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#2D2D2D]">{project.siteManager}</span>
              <a
                href={`tel:${project.managerPhone}`}
                className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-[#A68B67]"
                aria-label={`Call ${project.siteManager}`}
              >
                <Phone className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Today's Work Section */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#7A756F] uppercase tracking-widest block">
              Daily Site Schedule
            </span>
            <h4 className="text-sm font-semibold text-[#2D2D2D]">Today's Work</h4>
          </div>
          <button
            onClick={() => onSelectTab('work')}
            className="text-xs font-semibold text-[#A68B67] hover:text-[#8E7554] flex items-center gap-1"
          >
            <span>View All ({projectTasks.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeTasks.length === 0 ? (
          <p className="text-xs text-[#7A756F] italic py-4 text-center">
            No pending tasks for today.
          </p>
        ) : (
          <div className="divide-y divide-[#EAE7E1]">
            {activeTasks.map((t) => (
              <div
                key={t.id}
                className="py-3 flex items-start justify-between gap-3 group cursor-pointer"
                onClick={() => onSelectTask && onSelectTask(t)}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusBadge(
                        t.status,
                        t.isCompleted
                      )}`}
                    >
                      {t.status || (t.isCompleted ? 'Completed' : 'In Progress')}
                    </span>
                    <span className="text-[10px] font-semibold text-[#A68B67] uppercase tracking-wider">
                      {t.category}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-[#2D2D2D] group-hover:text-[#A68B67] transition-colors line-clamp-1">
                    {t.title}
                  </h5>
                  <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-[#7A756F]">
                    <span>Room: {t.room}</span>
                    <span>•</span>
                    <span>Assigned: {t.assignedTo}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  {onToggleTask && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(t.id);
                      }}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${
                        t.isCompleted || t.status === 'Completed'
                          ? 'bg-[#5B7B61] text-white border-[#5B7B61]'
                          : 'border-[#EAE7E1] hover:border-stone-400 text-transparent'
                      }`}
                      aria-label="Toggle task completion"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Material Warnings Section */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#7A756F] uppercase tracking-widest block">
              Supply Chain & Requisitions
            </span>
            <h4 className="text-sm font-semibold text-[#2D2D2D] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#D18C28]" />
              Material Warnings & Pending Requests
            </h4>
          </div>
          <button
            onClick={() => onSelectTab('materials')}
            className="text-xs font-semibold text-[#A68B67] hover:text-[#8E7554] flex items-center gap-1"
          >
            <span>All Materials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {materialWarnings.length === 0 ? (
          <p className="text-xs text-[#7A756F] italic py-3 text-center">
            No critical material warnings for this site.
          </p>
        ) : (
          <div className="space-y-2.5">
            {materialWarnings.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#EAE7E1] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        m.urgency === 'Urgent'
                          ? 'bg-[#B85C4E] text-white'
                          : 'bg-[#FDF3E7] text-[#D18C28]'
                      }`}
                    >
                      {m.urgency}
                    </span>
                    <span className="text-xs font-semibold text-[#2D2D2D]">{m.itemName}</span>
                  </div>
                  <p className="text-[11px] text-[#7A756F]">
                    Qty: {m.quantity} • Vendor: {m.vendor || 'Awaiting quote'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span className="text-xs font-semibold text-[#2D2D2D] mr-2">
                    {m.estimatedCost || 'Est. TBD'}
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-1 rounded bg-[#EAE7E1] text-[#7A756F]">
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Recent Site Photos Gallery */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#7A756F] uppercase tracking-widest block">
              Visual Documentation
            </span>
            <h4 className="text-sm font-semibold text-[#2D2D2D] flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#A68B67]" />
              Recent Site Photos
            </h4>
          </div>
          <button
            onClick={() => onSelectTab('updates')}
            className="text-xs font-semibold text-[#A68B67] hover:text-[#8E7554] flex items-center gap-1"
          >
            <span>Updates Feed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {displayPhotos.length === 0 ? (
          <p className="text-xs text-[#7A756F] italic py-4 text-center">
            No site photos uploaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {displayPhotos.map((p, idx) => (
              <div
                key={idx}
                onClick={() => onSelectPhoto(p.url, p.caption, p.room, p.timestamp)}
                className="group relative aspect-video rounded-xl overflow-hidden bg-stone-900 cursor-pointer border border-[#EAE7E1]"
              >
                <img
                  src={p.url}
                  alt={p.caption || 'Site photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-1.5 left-2 right-2 text-white text-[10px]">
                  <p className="font-semibold truncate">{p.room || 'General'}</p>
                  <p className="text-stone-300 text-[9px] truncate">{p.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Current Problems / Open Snags Section */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#7A756F] uppercase tracking-widest block">
              Quality Assurance
            </span>
            <h4 className="text-sm font-semibold text-[#2D2D2D] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#B85C4E]" />
              Current Problems & Snags ({currentProblems.length})
            </h4>
          </div>
          <button
            onClick={() => onSelectTab('issues')}
            className="text-xs font-semibold text-[#A68B67] hover:text-[#8E7554] flex items-center gap-1"
          >
            <span>All Issues</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {currentProblems.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#E8F2EA]/40 border border-[#5B7B61]/20 flex items-center gap-2.5 text-xs text-[#5B7B61]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>No open snags recorded. Site quality inspection is clear!</span>
          </div>
        ) : (
          <div className="space-y-3">
            {currentProblems.map((issue) => (
              <div
                key={issue.id}
                className="p-3.5 rounded-xl bg-[#FFF9F9] border border-[#FBEAEA] space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-[#B85C4E] text-white px-2 py-0.5 rounded-full">
                        {issue.severity}
                      </span>
                      <span className="text-xs font-semibold text-[#2D2D2D]">
                        {issue.room}: {issue.title}
                      </span>
                    </div>
                    <p className="text-xs text-[#555] mt-1">{issue.description}</p>
                  </div>
                </div>

                {issue.actionTaken && (
                  <div className="text-[11px] bg-white p-2 rounded-lg border border-[#EAE7E1] text-[#7A756F]">
                    <strong className="text-[#2D2D2D]">Action Taken:</strong> {issue.actionTaken}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
