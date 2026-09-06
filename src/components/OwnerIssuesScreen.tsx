import React, { useState } from 'react';
import {
  Project,
  Task,
  IssueReport,
  IssueStatus,
  IssuePriority,
  IssueCategory,
  TaskCategory,
} from '../types';
import {
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Plus,
  MessageSquare,
  Search,
  Filter,
  Camera,
  Film,
  Send,
  Check,
  RotateCcw,
  Building2,
  MapPin,
  CheckSquare,
  X,
  ChevronRight,
  Shield,
  Zap,
  Hammer,
  Wrench,
  Droplets,
  Compass,
  Users,
  ShieldAlert,
  HelpCircle,
  Package,
} from 'lucide-react';

interface OwnerIssuesScreenProps {
  issues: IssueReport[];
  projects: Project[];
  tasks: Task[];
  onAssignIssue: (issueId: string, assignedTo: string) => void;
  onAddComment: (issueId: string, text: string) => void;
  onChangePriority: (issueId: string, priority: IssuePriority) => void;
  onCreateTaskFromIssue: (issueId: string, taskData: Partial<Task>) => void;
  onToggleResolveIssue: (issueId: string) => void;
  onOpenReportIssueModal?: () => void;
  initialSelectedIssueId?: string | null;
}

const CATEGORY_ICONS: Record<IssueCategory, React.FC<{ className?: string }>> = {
  Material: Package,
  Electrical: Zap,
  Carpentry: Hammer,
  Civil: Wrench,
  Plumbing: Droplets,
  Design: Compass,
  Client: Users,
  Safety: ShieldAlert,
  Other: HelpCircle,
};

const COMMON_ASSIGNEES = [
  'Ramesh Kumar (Site Supervisor)',
  'Sunil M. (Plumbing Subcontractor)',
  'Rajesh Sharma (MEP & Electrical Sub)',
  'Asian Paints Pro Crew',
  'DecoTimber Woodwork (Mahesh)',
  'Apex Logistics Team',
  'Archana Sengupta (Principal Designer)',
  'Civil Subcontractor Team',
];

const PRESET_COMMENTS = [
  'Spoke with subcontractor; team dispatched to rectify today.',
  'Material replacement dispatched from supplier warehouse.',
  'Architect inspected detail. Revised dimension drawing uploaded.',
  'Site supervisor please inspect and re-test before drywall closing.',
  'Client updated regarding resolution timeline.',
];

export const OwnerIssuesScreen: React.FC<OwnerIssuesScreenProps> = ({
  issues,
  projects,
  tasks,
  onAssignIssue,
  onAddComment,
  onChangePriority,
  onCreateTaskFromIssue,
  onToggleResolveIssue,
  onOpenReportIssueModal,
  initialSelectedIssueId,
}) => {
  const [activeTab, setActiveTab] = useState<'Open' | 'In Progress' | 'Resolved'>('Open');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Interactive state for modals / inline drawers
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(initialSelectedIssueId || null);
  const [assigningIssueId, setAssigningIssueId] = useState<string | null>(null);
  const [newAssigneeInput, setNewAssigneeInput] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [taskEscalationIssue, setTaskEscalationIssue] = useState<IssueReport | null>(null);
  const [taskDueDate, setTaskDueDate] = useState('Tomorrow, 5:00 PM');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High'>('High');

  // Media preview modal state
  const [previewMediaUrl, setPreviewMediaUrl] = useState<{ url: string; title: string; type: 'photo' | 'video' } | null>(null);

  // Tab counts
  const openCount = issues.filter((i) => i.status === 'Open').length;
  const inProgressCount = issues.filter((i) => i.status === 'In Progress').length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;
  const urgentUnresolvedCount = issues.filter(
    (i) => (i.priority === 'Urgent' || i.severity === 'Critical') && i.status !== 'Resolved'
  ).length;

  // Filtered issues
  const filteredIssues = issues.filter((issue) => {
    // Tab filter
    if (issue.status !== activeTab) return false;

    // Project filter
    if (selectedProjectId !== 'all' && issue.projectId !== selectedProjectId) return false;

    // Category filter
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchDesc = issue.description.toLowerCase().includes(q);
      const matchProject = issue.projectName.toLowerCase().includes(q);
      const matchRoom = issue.room?.toLowerCase().includes(q);
      const matchReporter = issue.reportedBy.toLowerCase().includes(q);
      const matchAssigned = issue.assignedTo?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchProject && !matchRoom && !matchReporter && !matchAssigned) {
        return false;
      }
    }

    return true;
  });

  const handleSendComment = (issueId: string) => {
    const text = commentInputs[issueId]?.trim();
    if (!text) return;
    onAddComment(issueId, text);
    setCommentInputs((prev) => ({ ...prev, [issueId]: '' }));
  };

  const handleApplyPresetComment = (issueId: string, preset: string) => {
    onAddComment(issueId, preset);
  };

  const handleConfirmAssign = (issueId: string, name: string) => {
    if (!name.trim()) return;
    onAssignIssue(issueId, name.trim());
    setAssigningIssueId(null);
    setNewAssigneeInput('');
  };

  const handleConfirmTaskEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskEscalationIssue) return;

    // Map issue category to task category
    let cat: TaskCategory = 'Finishing';
    if (taskEscalationIssue.category === 'Carpentry') cat = 'Carpentry';
    else if (taskEscalationIssue.category === 'Electrical') cat = 'Electrical';
    else if (taskEscalationIssue.category === 'Plumbing') cat = 'Plumbing';
    else if (taskEscalationIssue.category === 'Civil') cat = 'Civil';

    onCreateTaskFromIssue(taskEscalationIssue.id, {
      title: `Fix: ${taskEscalationIssue.title}`,
      room: taskEscalationIssue.room || 'Site Area',
      assignedTo: taskEscalationIssue.assignedTo || 'Site Supervisor',
      dueDate: taskDueDate,
      priority: taskPriority,
      category: cat,
      notes: `Escalated from issue: ${taskEscalationIssue.description}`,
    });

    setTaskEscalationIssue(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Quick Overview */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EAE7E1] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#FBEAEA] text-[#B85C4E] border border-[#FBEAEA]">
                Studio Resolution Board
              </span>
              {urgentUnresolvedCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B85C4E] text-white flex items-center gap-1 animate-pulse">
                  <AlertOctagon className="w-3 h-3" />
                  <span>{urgentUnresolvedCount} Urgent</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#2D2D2D]">
              Site Issues & <span className="font-semibold">Snag Management</span>
            </h1>
            <p className="text-xs text-[#7A756F] mt-1">
              Assign subcontractors, change priorities, track resolution notes, or escalate issues into site schedule tasks.
            </p>
          </div>

          {onOpenReportIssueModal && (
            <button
              id="owner-log-new-issue-btn"
              onClick={onOpenReportIssueModal}
              className="px-4 py-2.5 rounded-full bg-[#2D2D2D] hover:bg-black text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4 text-[#A68B67]" />
              <span>Log New Snag</span>
            </button>
          )}
        </div>

        {/* Urgent Unresolved Notice Banner */}
        {urgentUnresolvedCount > 0 && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#2D2D2D] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border border-[#444]">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#B85C4E] animate-ping shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">
                  {urgentUnresolvedCount} Urgent {urgentUnresolvedCount === 1 ? 'Issue' : 'Issues'} currently flagged on active sites
                </p>
                <p className="text-[11px] text-stone-300">
                  These appear prominently in your Needs Attention dashboard until resolved.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab('Open');
                setSelectedCategory('all');
                setSelectedProjectId('all');
              }}
              className="px-3 py-1 bg-white text-[#2D2D2D] text-xs font-bold rounded-full hover:bg-stone-200 transition-colors self-start sm:self-auto shrink-0"
            >
              Filter Open Issues
            </button>
          </div>
        )}
      </div>

      {/* 2. Primary Status Navigation Tabs (Open | In Progress | Resolved) */}
      <div className="bg-[#EAE7E1] p-1.5 rounded-2xl flex items-center gap-1 shadow-xs">
        <button
          id="issues-tab-open"
          onClick={() => setActiveTab('Open')}
          className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'Open'
              ? 'bg-[#2D2D2D] text-white shadow-md'
              : 'text-[#7A756F] hover:text-[#2D2D2D]'
          }`}
        >
          <AlertOctagon className={`w-4 h-4 ${activeTab === 'Open' ? 'text-[#B85C4E]' : ''}`} />
          <span>Open</span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'Open' ? 'bg-[#B85C4E] text-white' : 'bg-white/70 text-[#7A756F]'
            }`}
          >
            {openCount}
          </span>
        </button>

        <button
          id="issues-tab-in-progress"
          onClick={() => setActiveTab('In Progress')}
          className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'In Progress'
              ? 'bg-[#2D2D2D] text-white shadow-md'
              : 'text-[#7A756F] hover:text-[#2D2D2D]'
          }`}
        >
          <Clock className={`w-4 h-4 ${activeTab === 'In Progress' ? 'text-[#A68B67]' : ''}`} />
          <span>In Progress</span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'In Progress' ? 'bg-[#A68B67] text-white' : 'bg-white/70 text-[#7A756F]'
            }`}
          >
            {inProgressCount}
          </span>
        </button>

        <button
          id="issues-tab-resolved"
          onClick={() => setActiveTab('Resolved')}
          className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'Resolved'
              ? 'bg-[#2D2D2D] text-white shadow-md'
              : 'text-[#7A756F] hover:text-[#2D2D2D]'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${activeTab === 'Resolved' ? 'text-[#5B7B61]' : ''}`} />
          <span>Resolved</span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'Resolved' ? 'bg-[#5B7B61] text-white' : 'bg-white/70 text-[#7A756F]'
            }`}
          >
            {resolvedCount}
          </span>
        </button>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE7E1] shadow-2xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#7A756F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search snags by title, contractor, room or trade..."
            className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-full pl-9 pr-4 py-2 text-xs font-medium text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Site Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Building2 className="w-4 h-4 text-[#7A756F] shrink-0 hidden sm:block" />
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-[#F9F8F6] border border-[#EAE7E1] rounded-full px-3 py-2 text-xs font-semibold text-[#2D2D2D] focus:outline-none focus:border-[#A68B67] flex-1 md:w-44"
          >
            <option value="all">All Sites</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#F9F8F6] border border-[#EAE7E1] rounded-full px-3 py-2 text-xs font-semibold text-[#2D2D2D] focus:outline-none focus:border-[#A68B67] flex-1 md:w-36"
          >
            <option value="all">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Civil">Civil</option>
            <option value="Material">Material</option>
            <option value="Safety">Safety</option>
            <option value="Design">Design</option>
            <option value="Client">Client</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* 4. Issues List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EAE7E1] p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[#F9F8F6] border border-[#EAE7E1] flex items-center justify-center mx-auto mb-3 text-[#7A756F]">
              <CheckCircle2 className="w-8 h-8 text-[#5B7B61]" />
            </div>
            <h3 className="text-base font-bold text-[#2D2D2D]">No {activeTab} Issues Found</h3>
            <p className="text-xs text-[#7A756F] mt-1 max-w-sm mx-auto">
              {searchQuery || selectedProjectId !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your search query or filters above.'
                : activeTab === 'Open'
                ? 'Great work! There are no unaddressed site snags currently open.'
                : `No issues currently recorded with status "${activeTab}".`}
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const CategoryIcon = CATEGORY_ICONS[issue.category] || AlertCircle;
            const isExpanded = expandedIssueId === issue.id;
            const isUrgent = issue.priority === 'Urgent' || issue.severity === 'Critical';

            return (
              <div
                key={issue.id}
                id={`issue-card-${issue.id}`}
                className={`bg-white rounded-3xl border transition-all shadow-sm overflow-hidden ${
                  isUrgent && issue.status !== 'Resolved'
                    ? 'border-[#B85C4E] ring-1 ring-[#B85C4E]/20'
                    : 'border-[#EAE7E1] hover:border-[#D6D0C7]'
                } ${issue.status === 'Resolved' ? 'opacity-75' : ''}`}
              >
                {/* Issue Card Main Header */}
                <div className="p-5 sm:p-6 space-y-3.5">
                  {/* Top Badges Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Project Name */}
                      <span className="text-xs font-bold text-[#2D2D2D] bg-[#F9F8F6] px-3 py-1 rounded-full border border-[#EAE7E1]">
                        {issue.projectName}
                      </span>

                      {/* Room / Zone */}
                      {issue.room && (
                        <span className="text-xs text-[#7A756F] flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3 text-[#A68B67]" />
                          <span>{issue.room}</span>
                        </span>
                      )}

                      {/* Category Badge */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F5F4F0] text-[#2D2D2D] border border-[#EAE7E1]">
                        <CategoryIcon className="w-3 h-3 text-[#A68B67]" />
                        <span>{issue.category}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Priority Badge */}
                      <div className="flex items-center gap-1">
                        <label className="text-[10px] font-bold uppercase text-[#7A756F] hidden sm:inline">
                          Priority:
                        </label>
                        <select
                          value={issue.priority}
                          onChange={(e) => onChangePriority(issue.id, e.target.value as IssuePriority)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-all ${
                            issue.priority === 'Urgent'
                              ? 'bg-[#FBEAEA] text-[#B85C4E] border-[#B85C4E] font-extrabold'
                              : issue.priority === 'High'
                              ? 'bg-[#FEF4E8] text-[#D18C28] border-[#F5E1C5]'
                              : issue.priority === 'Normal'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-stone-100 text-stone-600 border-stone-200'
                          }`}
                        >
                          <option value="Low">Low</option>
                          <option value="Normal">Normal</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>

                      {/* Resolve Status Toggle */}
                      <button
                        onClick={() => onToggleResolveIssue(issue.id)}
                        className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                          issue.status === 'Resolved'
                            ? 'bg-[#E8F2EA] text-[#5B7B61] hover:bg-[#d8eade]'
                            : 'bg-[#2D2D2D] hover:bg-black text-white'
                        }`}
                      >
                        {issue.status === 'Resolved' ? (
                          <>
                            <RotateCcw className="w-3 h-3" />
                            <span>Reopen</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Mark Resolved</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#2D2D2D] tracking-tight">
                      {issue.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555] mt-1 leading-relaxed whitespace-pre-wrap">
                      {issue.description}
                    </p>
                  </div>

                  {/* Linked Task & Escalation Status */}
                  {(issue.relatedTaskTitle || issue.createdTaskId) && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {issue.relatedTaskTitle && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-medium text-amber-900">
                          <CheckSquare className="w-3 h-3 text-amber-700" />
                          <span>Related Task: {issue.relatedTaskTitle}</span>
                        </div>
                      )}
                      {issue.createdTaskId && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-bold text-emerald-900">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Task created & scheduled on site #{issue.createdTaskId}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Media attachment thumbnail */}
                  {(issue.imageUrl || issue.videoUrl) && (
                    <div className="pt-1">
                      <div
                        onClick={() =>
                          setPreviewMediaUrl({
                            url: (issue.imageUrl || issue.videoUrl)!,
                            title: issue.title,
                            type: issue.videoUrl ? 'video' : 'photo',
                          })
                        }
                        className="inline-flex items-center gap-3 p-2 pr-4 rounded-2xl bg-[#F9F8F6] border border-[#EAE7E1] hover:border-[#A68B67] cursor-pointer transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0 relative">
                          <img
                            src={issue.imageUrl || issue.videoUrl}
                            alt="Attachment"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {issue.videoUrl && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Film className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A68B67] block">
                            {issue.videoUrl ? 'Site Video Clip' : 'Inspection Photo'}
                          </span>
                          <span className="text-xs font-semibold text-[#2D2D2D] group-hover:underline">
                            View Attachment
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Meta Bar: Assignee, Reporter & Actions */}
                  <div className="pt-3 border-t border-[#EAE7E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    {/* Assignee Information */}
                    <div className="flex items-center gap-2">
                      <span className="text-[#7A756F] font-medium">Assigned to:</span>
                      {assigningIssueId === issue.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={newAssigneeInput}
                            onChange={(e) => setNewAssigneeInput(e.target.value)}
                            placeholder="Enter person / team name"
                            className="bg-white border border-[#A68B67] rounded-full px-3 py-1 text-xs text-[#2D2D2D] focus:outline-none w-48"
                            autoFocus
                          />
                          <button
                            onClick={() => handleConfirmAssign(issue.id, newAssigneeInput)}
                            className="px-2.5 py-1 bg-[#2D2D2D] text-white rounded-full text-xs font-bold hover:bg-black"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setAssigningIssueId(null)}
                            className="text-stone-400 hover:text-stone-700 p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold px-2.5 py-0.5 rounded-full ${
                              issue.assignedTo
                                ? 'bg-[#EAE7E1] text-[#2D2D2D]'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {issue.assignedTo || 'Unassigned'}
                          </span>
                          <button
                            onClick={() => {
                              setAssigningIssueId(issue.id);
                              setNewAssigneeInput(issue.assignedTo || '');
                            }}
                            className="text-[11px] font-semibold text-[#A68B67] hover:underline"
                          >
                            {issue.assignedTo ? 'Change' : '+ Assign'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right side controls: Escalation & Comments count */}
                    <div className="flex items-center gap-2">
                      {!issue.createdTaskId && issue.status !== 'Resolved' && (
                        <button
                          onClick={() => setTaskEscalationIssue(issue)}
                          className="px-3 py-1 rounded-full bg-[#F9F8F6] border border-[#EAE7E1] hover:border-[#A68B67] text-[#2D2D2D] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <CheckSquare className="w-3.5 h-3.5 text-[#A68B67]" />
                          <span>Create Task</span>
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedIssueId(isExpanded ? null : issue.id)}
                        className="px-3 py-1 rounded-full bg-[#F9F8F6] border border-[#EAE7E1] hover:bg-stone-100 text-[#2D2D2D] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#7A756F]" />
                        <span>Comments ({issue.comments?.length || 0})</span>
                      </button>
                    </div>
                  </div>

                  {/* Reporter note */}
                  <div className="text-[11px] text-[#7A756F] italic">
                    Reported by <span className="font-semibold text-[#2D2D2D]">{issue.reportedBy}</span> ({issue.reportedAt})
                  </div>
                </div>

                {/* Expanded Activity & Comments Section */}
                {isExpanded && (
                  <div className="bg-[#F9F8F6] border-t border-[#EAE7E1] p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A756F] flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#A68B67]" />
                        <span>Owner Comments & Site Activity ({issue.comments?.length || 0})</span>
                      </h4>
                      <button
                        onClick={() => setExpandedIssueId(null)}
                        className="text-xs text-[#7A756F] hover:text-[#2D2D2D]"
                      >
                        Close
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {(!issue.comments || issue.comments.length === 0) ? (
                        <p className="text-xs text-stone-400 italic py-2">
                          No comments recorded yet. Add instructions or notes for your site supervisor below.
                        </p>
                      ) : (
                        issue.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-white p-3 rounded-2xl border border-[#EAE7E1] shadow-2xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#2D2D2D]">
                                {comment.author}{' '}
                                <span className="text-[10px] font-normal text-[#7A756F]">
                                  ({comment.authorRole})
                                </span>
                              </span>
                              <span className="text-[10px] text-stone-400">{comment.createdAt}</span>
                            </div>
                            <p className="text-xs text-[#444] leading-relaxed">{comment.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Preset Reply Chips */}
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A756F] block mb-1">
                        Quick studio response presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_COMMENTS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleApplyPresetComment(issue.id, preset)}
                            className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white border border-[#EAE7E1] hover:border-[#A68B67] text-[#2D2D2D] transition-colors"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment Input Box */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={commentInputs[issue.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [issue.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendComment(issue.id);
                        }}
                        placeholder="Add instruction or note as Archana Sengupta..."
                        className="flex-1 bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                      />
                      <button
                        onClick={() => handleSendComment(issue.id)}
                        className="px-4 py-2.5 rounded-2xl bg-[#2D2D2D] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. Create Task from Issue Modal */}
      {taskEscalationIssue && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-[#EAE7E1] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE7E1] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#2D2D2D] text-[#A68B67] flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2D2D2D]">Create Task from Issue</h3>
                  <p className="text-xs text-[#7A756F]">Escalate snag directly onto site work schedule</p>
                </div>
              </div>
              <button
                onClick={() => setTaskEscalationIssue(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmTaskEscalation} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A756F] block mb-1">
                  Site / Project
                </label>
                <div className="p-3 bg-[#F9F8F6] rounded-xl border border-[#EAE7E1] text-xs font-bold text-[#2D2D2D]">
                  {taskEscalationIssue.projectName} • {taskEscalationIssue.room || 'General Area'}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A756F] block mb-1">
                  New Task Title
                </label>
                <input
                  type="text"
                  defaultValue={`Fix: ${taskEscalationIssue.title}`}
                  className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-xl p-3 text-xs font-medium text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A756F] block mb-1">
                    Assign To
                  </label>
                  <input
                    type="text"
                    defaultValue={taskEscalationIssue.assignedTo || 'Ramesh Kumar (Site Supervisor)'}
                    className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-xl p-3 text-xs font-medium text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A756F] block mb-1">
                    Completion Deadline
                  </label>
                  <input
                    type="text"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-xl p-3 text-xs font-medium text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A756F] block mb-1.5">
                  Task Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Low', 'Medium', 'High'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTaskPriority(p)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                        taskPriority === p
                          ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]'
                          : 'bg-[#F9F8F6] text-[#7A756F] border-[#EAE7E1]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                This will create a new task in the site worker checklist and shift this issue status to &quot;In Progress&quot;.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTaskEscalationIssue(null)}
                  className="px-4 py-2.5 rounded-full border border-[#EAE7E1] text-xs font-semibold text-[#7A756F] hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#2D2D2D] hover:bg-black text-white text-xs font-bold shadow-md transition-all"
                >
                  Create & Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Media Fullscreen Preview Modal */}
      {previewMediaUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewMediaUrl(null)}
        >
          <div
            className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-stone-700 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-[#2D2D2D] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A68B67]">
                  {previewMediaUrl.type === 'video' ? 'Video Attachment' : 'Photo Attachment'}
                </span>
                <h4 className="text-sm font-semibold text-white truncate max-w-md">
                  {previewMediaUrl.title}
                </h4>
              </div>
              <button
                onClick={() => setPreviewMediaUrl(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-black aspect-video max-h-[70vh] flex items-center justify-center overflow-hidden">
              <img
                src={previewMediaUrl.url}
                alt={previewMediaUrl.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
