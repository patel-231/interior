import React from 'react';
import { Project, MaterialRequest, IssueReport, SiteUpdate } from '../types';
import { ProjectCard } from './ProjectCard';
import {
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Package,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Phone,
} from 'lucide-react';

interface OwnerHomeProps {
  projects: Project[];
  materialRequests: MaterialRequest[];
  issues: IssueReport[];
  updates: SiteUpdate[];
  onSelectProject: (project: Project) => void;
  onNavigateToMaterials: () => void;
  onNavigateToProjects: () => void;
  onNavigateToIssues: (issueId?: string) => void;
  onQuickApproveMaterial: (requestId: string) => void;
}

export const OwnerHome: React.FC<OwnerHomeProps> = ({
  projects,
  materialRequests,
  issues,
  updates,
  onSelectProject,
  onNavigateToMaterials,
  onNavigateToProjects,
  onNavigateToIssues,
  onQuickApproveMaterial,
}) => {
  // Statistics calculations
  const activeSitesCount = projects.filter((p) => p.status !== 'Completed').length;
  const onTrackCount = projects.filter((p) => p.status === 'On Track').length;
  const delayedCount = projects.filter((p) => p.status === 'Delayed').length;
  const pendingMaterialsCount = materialRequests.filter((m) => m.status === 'Pending').length;
  const unresolvedProblemsCount = issues.filter((i) => i.status !== 'Resolved').length;
  const totalPendingTasksCount = 14; // Specified in prompt requirement

  // Urgent attention items (urgent unresolved issues and urgent materials)
  const urgentMaterials = materialRequests.filter((m) => m.urgency === 'Urgent' && m.status === 'Pending');
  const urgentUnresolvedIssues = issues.filter(
    (i) => (i.priority === 'Urgent' || i.severity === 'Critical') && i.status !== 'Resolved'
  );

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Greeting & Hero Statement */}
      <section className="bg-white p-6 rounded-3xl border border-[#EAE7E1] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light text-[#2D2D2D] tracking-tight mb-1">
              Good morning, <span className="font-semibold">Archana.</span>
            </h1>
            <p className="text-[#7A756F] text-sm italic">
              You have {activeSitesCount} active sites and {urgentMaterials.length + urgentUnresolvedIssues.length} urgent items requiring attention today.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="w-10 h-10 rounded-full bg-[#D6D0C7] flex items-center justify-center text-xs font-bold text-[#2D2D2D] shadow-xs">
              AD
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-semibold text-[#2D2D2D] block">Archana Sengupta</span>
              <span className="text-[10px] text-[#7A756F] block uppercase tracking-wider">Studio Principal</span>
            </div>
          </div>
        </div>

        {/* Studio Quick Status Bar */}
        <div className="mt-4 pt-3 border-t border-[#EAE7E1] flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 text-[#7A756F] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#5B7B61] animate-pulse" />
            Field teams active across {activeSitesCount} Mumbai project sites
          </span>
          <button
            onClick={onNavigateToProjects}
            className="text-xs text-[#A68B67] font-semibold border-b border-[#A68B67] pb-0.5 hover:text-[#8E7554] flex items-center gap-1 transition-colors"
          >
            <span>View All Sites</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 2. Key Numbers Grid (Geometric Balance Clean Numerals) */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[10px] uppercase tracking-widest text-[#7A756F] font-bold">
            Operational Overview
          </h2>
          <span className="text-[11px] text-[#7A756F]">Live execution status</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Active Sites */}
          <div
            onClick={onNavigateToProjects}
            className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-sm hover:border-[#D6D0C7] transition-all cursor-pointer"
          >
            <p className="text-[10px] uppercase tracking-widest text-[#7A756F] mb-2 font-medium">Active Sites</p>
            <p className="text-3xl sm:text-4xl font-light text-[#2D2D2D]">
              {activeSitesCount < 10 ? `0${activeSitesCount}` : activeSitesCount}
            </p>
          </div>

          {/* On-Track Sites */}
          <div
            onClick={onNavigateToProjects}
            className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-sm hover:border-[#D6D0C7] transition-all cursor-pointer"
          >
            <p className="text-[10px] uppercase tracking-widest text-[#7A756F] mb-2 font-medium">On Track</p>
            <p className="text-3xl sm:text-4xl font-light text-[#5B7B61]">
              {onTrackCount < 10 ? `0${onTrackCount}` : onTrackCount}
            </p>
          </div>

          {/* Delayed Sites */}
          <div
            onClick={onNavigateToProjects}
            className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-sm hover:border-[#D6D0C7] transition-all cursor-pointer"
          >
            <p className="text-[10px] uppercase tracking-widest text-[#7A756F] mb-2 font-medium">Delayed</p>
            <p className="text-3xl sm:text-4xl font-light text-[#B85C4E]">
              {delayedCount < 10 ? `0${delayedCount}` : delayedCount}
            </p>
          </div>

          {/* Pending Material Requests */}
          <div
            onClick={onNavigateToMaterials}
            className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-sm hover:border-[#D6D0C7] transition-all cursor-pointer"
          >
            <p className="text-[10px] uppercase tracking-widest text-[#7A756F] mb-2 font-medium">Pending Indents</p>
            <p className="text-3xl sm:text-4xl font-light text-[#2D2D2D]">
              {pendingMaterialsCount < 10 ? `0${pendingMaterialsCount}` : pendingMaterialsCount}
            </p>
          </div>

          {/* Unresolved Snags */}
          <div
            onClick={() => onNavigateToIssues()}
            className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-sm hover:border-[#D6D0C7] transition-all cursor-pointer"
          >
            <p className="text-[10px] uppercase tracking-widest text-[#7A756F] mb-2 font-medium">Open Snags</p>
            <p className="text-3xl sm:text-4xl font-light text-[#B85C4E]">
              {unresolvedProblemsCount < 10 ? `0${unresolvedProblemsCount}` : unresolvedProblemsCount}
            </p>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-sm">
            <p className="text-[10px] uppercase tracking-widest text-[#7A756F] mb-2 font-medium">Pending Tasks</p>
            <p className="text-3xl sm:text-4xl font-light text-[#7A756F]">
              {totalPendingTasksCount < 10 ? `0${totalPendingTasksCount}` : totalPendingTasksCount}
            </p>
          </div>
        </div>
      </section>

      {/* 3. "Needs Attention" Section (Geometric Balance Dark Container Archetype) */}
      <section className="bg-[#2D2D2D] text-white p-6 rounded-3xl shadow-xl flex flex-col gap-4 border border-[#3D3D3D]">
        <div className="flex items-center justify-between border-b border-[#444444] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#B85C4E] animate-ping" />
            <h2 className="text-lg font-medium tracking-tight text-white">
              Needs Attention
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-[#B85C4E] text-white rounded-full">
            {urgentMaterials.length + urgentUnresolvedIssues.length} Immediate
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {/* Urgent Unresolved Issue Items */}
          {urgentUnresolvedIssues.map((issue) => (
            <div
              key={issue.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#232323] border border-[#B85C4E]/40"
            >
              <div className="flex gap-3 items-start">
                <div className="w-2.5 h-2.5 rounded-full bg-[#B85C4E] mt-1.5 shrink-0 animate-pulse" />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-[#B85C4E]/20 text-[#B85C4E] border border-[#B85C4E]/30 rounded font-bold">
                      Urgent {issue.category} Snag
                    </span>
                    <span className="text-xs font-medium text-stone-300">{issue.projectName}</span>
                    <span className="text-xs text-[#A0A0A0]">• {issue.room || 'Site Area'}</span>
                    {issue.assignedTo && (
                      <span className="text-[10px] text-stone-400">
                        (Assigned: {issue.assignedTo})
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white">{issue.title}</p>
                  <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">
                    {issue.description}
                  </p>
                  <p className="text-[11px] text-[#A0A0A0] mt-0.5">
                    Reported by {issue.reportedBy} ({issue.reportedAt})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <a
                  href="tel:+919845011234"
                  className="px-3 py-1.5 rounded-full border border-[#555] hover:bg-[#333] text-xs font-medium text-stone-200 flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#A68B67]" />
                  <span>Call Site</span>
                </a>
                <button
                  onClick={() => onNavigateToIssues(issue.id)}
                  className="px-3.5 py-1.5 rounded-full bg-[#B85C4E] hover:bg-[#9e4b3e] text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span>Review &amp; Resolve</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Urgent Material Item */}
          {urgentMaterials.map((mat) => (
            <div
              key={mat.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#232323] border border-[#383838]"
            >
              <div className="flex gap-3 items-start">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D18C28] mt-1.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-[#D18C28]/20 text-[#D18C28] border border-[#D18C28]/30 rounded font-bold">
                      PO Approval
                    </span>
                    <span className="text-xs font-medium text-stone-300">{mat.projectName}</span>
                    <span className="text-xs text-[#A0A0A0]">• Est. {mat.estimatedCost}</span>
                  </div>
                  <p className="text-sm font-medium text-white">
                    {mat.itemName} ({mat.quantity})
                  </p>
                  <p className="text-[11px] text-[#A0A0A0] mt-0.5">
                    Requested by {mat.requestedBy} • Vendor: {mat.vendor}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => onQuickApproveMaterial(mat.id)}
                  className="px-3.5 py-1.5 rounded-full bg-[#A68B67] hover:bg-[#8E7554] text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve PO</span>
                </button>
                <button
                  onClick={onNavigateToMaterials}
                  className="px-3 py-1.5 rounded-full border border-[#555] hover:bg-[#333] text-xs font-medium text-stone-200 transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Active Interior Sites */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-lg font-medium text-[#2D2D2D] tracking-tight">
              Active Design Sites
            </h2>
            <p className="text-xs text-[#7A756F]">Real-time site progress and field supervisors</p>
          </div>
          <button
            onClick={onNavigateToProjects}
            className="text-xs text-[#A68B67] font-semibold border-b border-[#A68B67] pb-0.5 hover:text-[#8E7554] flex items-center gap-0.5 transition-colors"
          >
            <span>View All ({projects.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
            />
          ))}
        </div>
      </section>

      {/* 5. Latest Site Updates Feed (Geometric Balance Clean White Card) */}
      <section className="bg-white rounded-3xl border border-[#EAE7E1] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAE7E1]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#7A756F]">
            Recent Updates
          </h2>
          <span className="text-[11px] text-[#7A756F]">Field activity timeline</span>
        </div>

        <div className="space-y-4">
          {updates.slice(0, 3).map((up) => (
            <div key={up.id} className="flex gap-4 pb-4 border-b border-[#F4F2ED] last:border-0 last:pb-0">
              {/* Photo Thumbnail */}
              {up.imageUrl ? (
                <img
                  src={up.imageUrl}
                  alt={up.room}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#EAE7E1] bg-stone-100"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#EAE7E1] text-[#2D2D2D] flex items-center justify-center shrink-0 font-bold text-xs">
                  {up.author.slice(0, 2).toUpperCase()}
                </div>
              )}

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-xs font-bold text-[#2D2D2D] truncate">
                    {up.projectName}
                  </span>
                  <span className="text-[10px] text-[#7A756F] shrink-0">{up.timestamp}</span>
                </div>

                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#7A756F]">
                  <span className="font-semibold text-[#2D2D2D]">{up.room}</span>
                  <span>•</span>
                  <span>{up.author} ({up.authorRole})</span>
                </div>

                <p className="text-xs text-[#555] line-clamp-2 leading-relaxed">
                  {up.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {up.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 bg-[#F9F8F6] border border-[#EAE7E1] text-[#7A756F] rounded font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                  {up.progressPercentage && (
                    <span className="text-[10px] px-2 py-0.5 bg-[#2D2D2D] text-white rounded font-bold">
                      {up.progressPercentage}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
