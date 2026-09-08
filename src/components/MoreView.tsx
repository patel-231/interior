import React, { useState } from 'react';
import { IssueReport, Project } from '../types';
import {
  AlertTriangle,
  Users,
  Building,
  Settings,
  Shield,
  FileCheck,
  CheckCircle2,
  Phone,
  ChevronRight,
  ExternalLink,
  Filter,
} from 'lucide-react';

interface MoreViewProps {
  issues: IssueReport[];
  projects: Project[];
  onResolveIssue: (issueId: string) => void;
  onSelectProject: (project: Project) => void;
  onOpenReportIssueModal: () => void;
}

export const MoreView: React.FC<MoreViewProps> = ({
  issues,
  projects,
  onResolveIssue,
  onSelectProject,
  onOpenReportIssueModal,
}) => {
  const [activeSection, setActiveSection] = useState<'issues' | 'team' | 'clients'>('issues');
  
  const openIssues = issues.filter((i) => i.status !== 'Resolved');

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light tracking-tight text-[#2D2D2D]">
          Studio <span className="font-semibold">Operations</span>
        </h1>
        <p className="text-xs text-[#7A756F] italic">Snag resolution, supervisor dispatch & client directory</p>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex bg-[#EAE7E1] p-1 rounded-full gap-1 text-xs font-semibold">
        <button
          onClick={() => setActiveSection('issues')}
          className={`flex-1 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
            activeSection === 'issues'
              ? 'bg-[#2D2D2D] text-white shadow-xs'
              : 'text-[#7A756F] hover:text-[#2D2D2D]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#B85C4E]" />
          <span>Snags ({openIssues.length})</span>
        </button>
        <button
          onClick={() => setActiveSection('team')}
          className={`flex-1 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
            activeSection === 'team'
              ? 'bg-[#2D2D2D] text-white shadow-xs'
              : 'text-[#7A756F] hover:text-[#2D2D2D]'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#A68B67]" />
          <span>Supervisors</span>
        </button>
        <button
          onClick={() => setActiveSection('clients')}
          className={`flex-1 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
            activeSection === 'clients'
              ? 'bg-[#2D2D2D] text-white shadow-xs'
              : 'text-[#7A756F] hover:text-[#2D2D2D]'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-[#A68B67]" />
          <span>Clients</span>
        </button>
      </div>

      {/* SECTION 1: ISSUES / SNAGS */}
      {activeSection === 'issues' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-[#7A756F] uppercase tracking-widest">
              Site Snag Log ({issues.length})
            </span>
            <button
              onClick={onOpenReportIssueModal}
              className="text-xs font-semibold text-[#A68B67] border-b border-[#A68B67] pb-0.5 hover:text-[#8E7554]"
            >
              + Log New Snag
            </button>
          </div>

          {issues.map((issue) => (
            <div
              key={issue.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3 transition-all ${
                issue.status === 'Resolved' ? 'border-[#EAE7E1] opacity-60' : 'border-[#EAE7E1] hover:border-[#D6D0C7]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#2D2D2D]">{issue.projectName}</span>
                    <span className="text-xs text-[#7A756F]">• {issue.room}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#2D2D2D]">{issue.title}</h3>
                </div>

                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded shrink-0 ${
                    issue.status === 'Resolved'
                      ? 'bg-[#E8F2EA] text-[#5B7B61]'
                      : issue.severity === 'Critical'
                      ? 'bg-[#FBEAEA] text-[#B85C4E]'
                      : 'bg-[#FDF3E7] text-[#D18C28]'
                  }`}
                >
                  {issue.status === 'Resolved' ? 'Resolved' : `${issue.severity} Severity`}
                </span>
              </div>

              <p className="text-xs text-[#555] leading-relaxed">{issue.description}</p>

              {issue.imageUrl && (
                <div className="aspect-[16/9] rounded-xl overflow-hidden border border-[#EAE7E1] bg-stone-100">
                  <img
                    src={issue.imageUrl}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {issue.actionTaken && (
                <div className="bg-[#F9F8F6] p-3 rounded-xl border border-[#EAE7E1] text-xs text-[#555]">
                  <strong className="text-[#2D2D2D] font-medium">Remedial Action:</strong> {issue.actionTaken}
                </div>
              )}

              <div className="pt-3 border-t border-[#EAE7E1] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#7A756F]">
                  Reported by {issue.reportedBy} ({issue.reportedAt})
                </span>
                {issue.status !== 'Resolved' && (
                  <button
                    onClick={() => onResolveIssue(issue.id)}
                    className="px-3.5 py-1.5 rounded-full bg-[#5B7B61] hover:bg-[#4E6B53] text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: TEAM / SUPERVISORS */}
      {activeSection === 'team' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-[#EAE7E1] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D6D0C7] text-[#2D2D2D] font-bold flex items-center justify-center text-xs">
                  RK
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#2D2D2D]">Ramesh Kumar</h4>
                  <p className="text-xs text-[#7A756F]">Senior Site Supervisor • 8 yrs exp</p>
                </div>
              </div>
              <a
                href="tel:+919845011234"
                className="px-3.5 py-1.5 rounded-full bg-[#F9F8F6] border border-[#EAE7E1] flex items-center gap-1 text-xs font-semibold text-[#2D2D2D] hover:bg-stone-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#A68B67]" />
                <span>Call</span>
              </a>
            </div>
            <div className="text-xs text-[#7A756F] pt-2.5 border-t border-[#EAE7E1]">
              <span>Assigned Sites: </span>
              <strong className="text-[#2D2D2D] font-medium">Shah Residence, Mehta Villa</strong>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAE7E1] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D2D2D] text-white font-bold flex items-center justify-center text-xs">
                  VS
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#2D2D2D]">Vikram Singh</h4>
                  <p className="text-xs text-[#7A756F]">Commercial MEP & Fitout Supervisor</p>
                </div>
              </div>
              <a
                href="tel:+919723044551"
                className="px-3.5 py-1.5 rounded-full bg-[#F9F8F6] border border-[#EAE7E1] flex items-center gap-1 text-xs font-semibold text-[#2D2D2D] hover:bg-stone-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#A68B67]" />
                <span>Call</span>
              </a>
            </div>
            <div className="text-xs text-[#7A756F] pt-2.5 border-t border-[#EAE7E1]">
              <span>Assigned Site: </span>
              <strong className="text-[#2D2D2D] font-medium">Patel Office (BKC)</strong>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CLIENTS DIRECTORY */}
      {activeSection === 'clients' && (
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-[#EAE7E1] p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#2D2D2D]">{p.client}</h4>
                  <p className="text-xs text-[#7A756F]">{p.name} ({p.type})</p>
                </div>
                <a
                  href={`tel:${p.clientPhone}`}
                  className="px-3.5 py-1.5 rounded-full bg-[#F9F8F6] border border-[#EAE7E1] text-xs font-semibold text-[#2D2D2D] flex items-center gap-1.5 hover:bg-stone-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#A68B67]" />
                  <span>Call</span>
                </a>
              </div>

              <div className="pt-2.5 border-t border-[#EAE7E1] flex items-center justify-between text-xs text-[#7A756F]">
                <span>Contact: {p.clientPhone}</span>
                <span className="font-semibold text-[#2D2D2D]">Deadline: {p.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Studio Settings Info */}
      <section className="bg-white rounded-3xl border border-[#EAE7E1] p-6 shadow-sm text-xs space-y-2">
        <h3 className="font-semibold text-sm text-[#2D2D2D]">Studio Credentials</h3>
        <p className="text-[#7A756F]">
          Sengupta Architecture & Interior Design Studio • Mumbai, India
        </p>
        <p className="text-[11px] text-[#7A756F]">
          SiteFlow v1.0.4 • Connected to Active Project Clusters
        </p>
      </section>
    </div>
  );
};
