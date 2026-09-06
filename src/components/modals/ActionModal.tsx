import React, { useState } from 'react';
import {
  Project,
  Task,
  MaterialRequest,
  IssueReport,
  IssueCategory,
  IssuePriority,
  SiteUpdate,
  UrgencyLevel,
} from '../../types';
import {
  X,
  Camera,
  TrendingUp,
  PackagePlus,
  AlertOctagon,
  Building,
  CheckSquare,
  Upload,
  Check,
  Sparkles,
} from 'lucide-react';

export type ModalType = 'progress' | 'photo' | 'material' | 'issue' | 'project' | 'task' | null;

interface ActionModalProps {
  isOpen: boolean;
  type: ModalType;
  onClose: () => void;
  projects: Project[];
  activeProjectId?: string;
  onAddUpdate: (update: SiteUpdate) => void;
  onAddMaterialRequest: (request: MaterialRequest) => void;
  onAddIssue: (issue: IssueReport) => void;
  onAddProject: (project: Project) => void;
  onAddTask: (task: Task) => void;
  onUpdateProjectProgress: (projectId: string, newProgress: number) => void;
  currentRole: 'OWNER' | 'WORKER';
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  type,
  onClose,
  projects,
  activeProjectId,
  onAddUpdate,
  onAddMaterialRequest,
  onAddIssue,
  onAddProject,
  onAddTask,
  onUpdateProjectProgress,
  currentRole,
}) => {
  if (!isOpen || !type) return null;

  const defaultProjectId = activeProjectId || projects?.[0]?.id || 'proj-1';
  const [selectedProjectId, setSelectedProjectId] = useState(defaultProjectId);
  const selectedProject = (projects || []).find((p) => p.id === selectedProjectId) || (projects || [])[0];

  // Progress Update state
  const [newProgress, setNewProgress] = useState(selectedProject?.progress || 50);
  const [progressNotes, setProgressNotes] = useState('');
  const [progressRoom, setProgressRoom] = useState(selectedProject?.rooms[0]?.name || 'Living Room');

  // Photo Upload state
  const [photoRoom, setPhotoRoom] = useState('Living & Dining Foyer');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
  );
  const [photoTag, setPhotoTag] = useState('Carpentry');

  // Material Request state
  const [matItem, setMatItem] = useState('');
  const [matQty, setMatQty] = useState('');
  const [matCategory, setMatCategory] = useState('Hardware');
  const [matUrgency, setMatUrgency] = useState<UrgencyLevel>('Urgent');
  const [matVendor, setMatVendor] = useState('Hafele & Hettich Hub');
  const [matSpecs, setMatSpecs] = useState('');
  const [matEstCost, setMatEstCost] = useState('₹18,500');

  // Issue Report state
  const [issueTitle, setIssueTitle] = useState('');
  const [issueRoom, setIssueRoom] = useState('Master Bathroom');
  const [issueCategory, setIssueCategory] = useState<IssueCategory>('Civil');
  const [issuePriority, setIssuePriority] = useState<IssuePriority>('High');
  const [issueSeverity, setIssueSeverity] = useState<'Low' | 'Medium' | 'Critical'>('Critical');
  const [issueDesc, setIssueDesc] = useState('');
  const [issueAction, setIssueAction] = useState('Water main isolated; technician dispatched.');

  // Add Project state
  const [newProjName, setNewProjName] = useState('');
  const [newProjClient, setNewProjClient] = useState('');
  const [newProjDeadline, setNewProjDeadline] = useState('15 Dec 2026');
  const [newProjManager, setNewProjManager] = useState('Ramesh Kumar');
  const [newProjType, setNewProjType] = useState('Luxury Apartment');
  const [newProjArea, setNewProjArea] = useState('3,200 sq.ft');
  const [newProjAddress, setNewProjAddress] = useState('Worli Sea Face, Mumbai');

  // Add Task state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskRoom, setTaskRoom] = useState('Living Room');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High'>('High');
  const [taskCategory, setTaskCategory] = useState<'Carpentry' | 'Electrical' | 'Plumbing' | 'Civil' | 'Painting' | 'Finishing'>('Carpentry');
  const [taskDueDate, setTaskDueDate] = useState('Today, 5:00 PM');

  // Handlers
  const handleProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProjectProgress(selectedProjectId, newProgress);

    const newUpdate: SiteUpdate = {
      id: `up-${Date.now()}`,
      projectId: selectedProjectId,
      projectName: selectedProject.name,
      author: currentRole === 'OWNER' ? 'Archana Sengupta' : selectedProject.siteManager,
      authorRole: currentRole === 'OWNER' ? 'Principal Designer' : 'Site Supervisor',
      timestamp: 'Just now',
      room: progressRoom,
      description: progressNotes || `Site progress updated to ${newProgress}% in ${progressRoom}.`,
      type: 'Progress',
      progressPercentage: newProgress,
      tags: ['Progress', progressRoom, 'Milestone'],
    };
    onAddUpdate(newUpdate);
    onClose();
  };

  const handlePhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUpdate: SiteUpdate = {
      id: `up-${Date.now()}`,
      projectId: selectedProjectId,
      projectName: selectedProject.name,
      author: currentRole === 'OWNER' ? 'Archana Sengupta' : selectedProject.siteManager,
      authorRole: currentRole === 'OWNER' ? 'Principal Designer' : 'Site Supervisor',
      timestamp: 'Just now',
      room: photoRoom,
      description: photoCaption || `Site progress photo documented for ${photoRoom}.`,
      type: 'Photo',
      imageUrl: photoUrl,
      tags: ['Photo', photoRoom, photoTag],
    };
    onAddUpdate(newUpdate);
    onClose();
  };

  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matItem) return;
    const newRequest: MaterialRequest = {
      id: `mat-${Date.now()}`,
      projectId: selectedProjectId,
      projectName: selectedProject.name,
      itemName: matItem,
      quantity: matQty || 'As required per site drawings',
      category: matCategory,
      requestedBy: currentRole === 'OWNER' ? 'Archana Sengupta' : selectedProject.siteManager,
      requestedDate: 'Today, Just now',
      urgency: matUrgency,
      status: 'Pending',
      specs: matSpecs || 'Standard architectural grade',
      vendor: matVendor,
      estimatedCost: matEstCost || '₹15,000',
    };
    onAddMaterialRequest(newRequest);
    onClose();
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle) return;
    const newIssue: IssueReport = {
      id: `issue-${Date.now()}`,
      projectId: selectedProjectId,
      projectName: selectedProject.name,
      title: issueTitle,
      description: issueDesc || 'Immediate site supervisor attention required.',
      room: issueRoom,
      category: issueCategory,
      priority: issuePriority,
      severity: issuePriority === 'Urgent' ? 'Critical' : issuePriority === 'High' ? 'Medium' : 'Low',
      status: 'Open',
      reportedBy: currentRole === 'OWNER' ? 'Archana Sengupta' : selectedProject.siteManager,
      reportedAt: 'Today, Just now',
      actionTaken: issueAction,
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    };
    onAddIssue(newIssue);

    // Also add to timeline
    const snagUpdate: SiteUpdate = {
      id: `up-${Date.now()}`,
      projectId: selectedProjectId,
      projectName: selectedProject.name,
      author: currentRole === 'OWNER' ? 'Archana Sengupta' : selectedProject.siteManager,
      authorRole: currentRole === 'OWNER' ? 'Principal Designer' : 'Site Supervisor',
      timestamp: 'Just now',
      room: issueRoom,
      description: `[SNAG REPORTED]: ${issueTitle}. ${issueDesc}`,
      type: 'Snag',
      tags: ['Snag', issueRoom, issueSeverity],
    };
    onAddUpdate(snagUpdate);
    onClose();
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName) return;
    const project: Project = {
      id: `proj-${Date.now()}`,
      name: newProjName,
      client: newProjClient || 'Private Client',
      clientPhone: '+91 98200 12345',
      progress: 5,
      deadline: newProjDeadline,
      status: 'On Track',
      siteManager: newProjManager,
      managerPhone: '+91 98450 11234',
      address: newProjAddress,
      type: newProjType,
      area: newProjArea,
      startDate: 'Today',
      imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80',
      budgetSpent: '₹2,50,000',
      totalBudget: '₹75,000,000',
      notes: 'Initial demolition and site clearing initiated.',
      rooms: [
        { name: 'Entrance Foyer & Living', stage: 'Demolition & Wall Chasing', progress: 10 },
        { name: 'Master Bedroom', stage: 'Civil Rough-ins', progress: 5 },
        { name: 'Kitchen & Utility', stage: 'Plumbing Core Cutting', progress: 5 },
      ],
      milestones: [
        { id: 'm-new-1', name: 'Civil & Demolition', progress: 20, status: 'In Progress', targetDate: '30 Sep 2026' },
        { id: 'm-new-2', name: 'Electrical & Plumbing MEP', progress: 0, status: 'Upcoming', targetDate: '20 Oct 2026' },
        { id: 'm-new-3', name: 'Carpentry & Fixed Millwork', progress: 0, status: 'Upcoming', targetDate: '15 Nov 2026' },
      ],
    };
    onAddProject(project);
    onClose();
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    const task: Task = {
      id: `task-${Date.now()}`,
      projectId: selectedProjectId,
      projectName: selectedProject.name,
      title: taskTitle,
      room: taskRoom,
      assignedTo: `${selectedProject.siteManager} (${taskCategory})`,
      dueDate: taskDueDate,
      priority: taskPriority,
      isCompleted: false,
      category: taskCategory,
    };
    onAddTask(task);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#F9F8F6] w-full max-w-lg max-h-[90vh] sm:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl overflow-hidden border border-[#EAE7E1] animate-in fade-in slide-in-from-bottom duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-[#EAE7E1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2D2D2D] text-[#A68B67] flex items-center justify-center">
              {type === 'progress' && <TrendingUp className="w-4 h-4" />}
              {type === 'photo' && <Camera className="w-4 h-4" />}
              {type === 'material' && <PackagePlus className="w-4 h-4" />}
              {type === 'issue' && <AlertOctagon className="w-4 h-4 text-[#B85C4E]" />}
              {type === 'project' && <Building className="w-4 h-4" />}
              {type === 'task' && <CheckSquare className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-light text-[#2D2D2D]">
                {type === 'progress' && <span>Log <span className="font-semibold">Progress Update</span></span>}
                {type === 'photo' && <span>Upload <span className="font-semibold">Site Photo</span></span>}
                {type === 'material' && <span>Submit <span className="font-semibold">Material Request</span></span>}
                {type === 'issue' && <span>Report <span className="font-semibold">Site Snag</span></span>}
                {type === 'project' && <span>Create <span className="font-semibold">New Site</span></span>}
                {type === 'task' && <span>Add <span className="font-semibold">Site Task</span></span>}
              </h2>
              <span className="text-[11px] text-[#7A756F]">
                Target: {selectedProject.name}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#EAE7E1] hover:bg-stone-100 text-[#2D2D2D] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Forms */}
        <div className="p-6 overflow-y-auto">
          {/* Target Site Selector (common for all except create project) */}
          {type !== 'project' && (
            <div className="mb-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                Select Site:
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  const p = (projects || []).find((proj) => proj.id === e.target.value);
                  if (p) setNewProgress(p.progress);
                }}
                className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#2D2D2D] focus:outline-none focus:border-[#A68B67] shadow-xs transition-colors"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.progress}% completed)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 1. PROGRESS UPDATE FORM */}
          {type === 'progress' && (
            <form onSubmit={handleProgressSubmit} className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] space-y-3 shadow-xs">
                <div className="flex items-baseline justify-between">
                  <label className="text-xs font-semibold text-[#2D2D2D]">
                    Overall Site Progress:
                  </label>
                  <span className="text-2xl font-light text-[#2D2D2D]">
                    {newProgress}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full accent-[#2D2D2D] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                  Active Room / Zone:
                </label>
                <select
                  value={progressRoom}
                  onChange={(e) => setProgressRoom(e.target.value)}
                  className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                >
                  {selectedProject.rooms.map((r, i) => (
                    <option key={i} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                  <option value="General Whole Site">General Whole Site</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                  Supervisor Notes & Accomplishments:
                </label>
                <textarea
                  rows={3}
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  placeholder="e.g. Living room marble polishing completed; ceiling framework inspected."
                  className="w-full bg-white border border-[#EAE7E1] rounded-2xl p-3.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#2D2D2D] text-white text-xs font-semibold hover:bg-black shadow-sm transition-all"
              >
                Save Progress & Publish Log
              </button>
            </form>
          )}

          {/* 2. PHOTO UPLOAD FORM */}
          {type === 'photo' && (
            <form onSubmit={handlePhotoSubmit} className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-[#EAE7E1] space-y-3 text-center shadow-xs">
                <div className="aspect-[16/9] rounded-xl overflow-hidden border border-[#EAE7E1] bg-stone-100 relative group">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-semibold">
                      Photo Ready to Log
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoUrl(
                        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="px-3 py-1.5 rounded-full bg-[#F9F8F6] border border-[#EAE7E1] text-xs font-medium text-[#2D2D2D] hover:bg-stone-100 transition-colors"
                  >
                    Living Room Angle
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoUrl(
                        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="px-3 py-1.5 rounded-full bg-[#F9F8F6] border border-[#EAE7E1] text-xs font-medium text-[#2D2D2D] hover:bg-stone-100 transition-colors"
                  >
                    Kitchen Detail
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoUrl(
                        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="px-3 py-1.5 rounded-full bg-[#F9F8F6] border border-[#EAE7E1] text-xs font-medium text-[#2D2D2D] hover:bg-stone-100 transition-colors"
                  >
                    Bedroom Wardrobe
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                  Room / Area Captured:
                </label>
                <input
                  type="text"
                  value={photoRoom}
                  onChange={(e) => setPhotoRoom(e.target.value)}
                  className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                  Caption / Observation:
                </label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="e.g. Master wardrobe carcass leveled and fastened to back civil wall."
                  className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#A68B67] hover:bg-[#8E7554] text-white text-xs font-semibold shadow-sm transition-all"
              >
                Upload & Share to Timeline
              </button>
            </form>
          )}

          {/* 3. MATERIAL REQUEST FORM */}
          {type === 'material' && (
            <form onSubmit={handleMaterialSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                  Material / Item Name:
                </label>
                <input
                  type="text"
                  required
                  value={matItem}
                  onChange={(e) => setMatItem(e.target.value)}
                  placeholder="e.g. Marine Plywood 18mm (Gurjan 710)"
                  className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Quantity:
                  </label>
                  <input
                    type="text"
                    value={matQty}
                    onChange={(e) => setMatQty(e.target.value)}
                    placeholder="e.g. 24 sheets (8x4)"
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Urgency Level:
                  </label>
                  <select
                    value={matUrgency}
                    onChange={(e) => setMatUrgency(e.target.value as UrgencyLevel)}
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  >
                    <option value="Urgent">Urgent (Site Halted)</option>
                    <option value="High">High (Required in 24h)</option>
                    <option value="Medium">Medium (Required in 3-4 days)</option>
                    <option value="Low">Low (Next Week)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Category:
                  </label>
                  <select
                    value={matCategory}
                    onChange={(e) => setMatCategory(e.target.value)}
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  >
                    <option value="Hardware">Hardware & Fittings</option>
                    <option value="Woodwork">Woodwork & Ply</option>
                    <option value="Lighting & Electrical">Lighting & Electrical</option>
                    <option value="Paint & Polish">Paint & Polish</option>
                    <option value="Plumbing & Sanitary">Plumbing & Sanitary</option>
                    <option value="Civil & Waterproofing">Civil & Waterproofing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Estimated Cost:
                  </label>
                  <input
                    type="text"
                    value={matEstCost}
                    onChange={(e) => setMatEstCost(e.target.value)}
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                  Vendor Name / Brand Spec:
                </label>
                <input
                  type="text"
                  value={matVendor}
                  onChange={(e) => setMatVendor(e.target.value)}
                  className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                  Technical Specifications / Dimensions:
                </label>
                <textarea
                  rows={2}
                  value={matSpecs}
                  onChange={(e) => setMatSpecs(e.target.value)}
                  placeholder="Specify model code, finish, thickness or brand requirements"
                  className="w-full bg-white border border-[#EAE7E1] rounded-2xl p-3 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#2D2D2D] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
              >
                Send Request to Studio Designer
              </button>
            </form>
          )}

          {/* 4. REPORT ISSUE / SNAG FORM */}
          {type === 'issue' && (
            <form onSubmit={handleIssueSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                  Issue Summary:
                </label>
                <input
                  type="text"
                  required
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  placeholder="e.g. Wall plumb line deviation over 12mm on TV feature wall"
                  className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Category:
                  </label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value as IssueCategory)}
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  >
                    <option value="Civil">Civil</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Material">Material</option>
                    <option value="Design">Design</option>
                    <option value="Client">Client</option>
                    <option value="Safety">Safety</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Priority:
                  </label>
                  <select
                    value={issuePriority}
                    onChange={(e) => setIssuePriority(e.target.value as IssuePriority)}
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  >
                    <option value="Urgent">Urgent (Immediate halt)</option>
                    <option value="High">High (Resolve in 24h)</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Room / Zone:
                  </label>
                  <input
                    type="text"
                    value={issueRoom}
                    onChange={(e) => setIssueRoom(e.target.value)}
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Severity:
                  </label>
                  <select
                    value={issueSeverity}
                    onChange={(e) => setIssueSeverity(e.target.value as any)}
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  >
                    <option value="Critical">Critical (Blocker)</option>
                    <option value="Medium">Medium (Warning)</option>
                    <option value="Low">Low (Cosmetic Snag)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                  Detailed Description:
                </label>
                <textarea
                  rows={3}
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  placeholder="Describe root cause and affected trades (carpentry/civil/electrical)"
                  className="w-full bg-white border border-[#EAE7E1] rounded-2xl p-3 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                  Immediate Remedial Action:
                </label>
                <input
                  type="text"
                  value={issueAction}
                  onChange={(e) => setIssueAction(e.target.value)}
                  className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#B85C4E] hover:bg-[#A34E41] text-white text-xs font-semibold shadow-sm transition-all"
              >
                Log Snag & Alert Designer
              </button>
            </form>
          )}

          {/* 5. ADD PROJECT FORM (Owner) */}
          {type === 'project' && (
            <form onSubmit={handleProjectSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                  Project / Residence Name:
                </label>
                <input
                  type="text"
                  required
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="e.g. Kapoor Penthouse"
                  className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Client Name:
                  </label>
                  <input
                    type="text"
                    value={newProjClient}
                    onChange={(e) => setNewProjClient(e.target.value)}
                    placeholder="e.g. Rajiv Kapoor"
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Deadline:
                  </label>
                  <input
                    type="text"
                    value={newProjDeadline}
                    onChange={(e) => setNewProjDeadline(e.target.value)}
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Assigned Site Manager:
                  </label>
                  <select
                    value={newProjManager}
                    onChange={(e) => setNewProjManager(e.target.value)}
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  >
                    <option value="Ramesh Kumar">Ramesh Kumar</option>
                    <option value="Vikram Singh">Vikram Singh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Area (sq.ft):
                  </label>
                  <input
                    type="text"
                    value={newProjArea}
                    onChange={(e) => setNewProjArea(e.target.value)}
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                  Site Physical Address:
                </label>
                <input
                  type="text"
                  value={newProjAddress}
                  onChange={(e) => setNewProjAddress(e.target.value)}
                  className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#2D2D2D] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
              >
                Create Project & Setup Site
              </button>
            </form>
          )}

          {/* 6. ADD TASK FORM */}
          {type === 'task' && (
            <form onSubmit={handleTaskSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                  Task Title / Scope:
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Cut opening for AC return air diffuser"
                  className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Room / Zone:
                  </label>
                  <input
                    type="text"
                    value={taskRoom}
                    onChange={(e) => setTaskRoom(e.target.value)}
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Trade Category:
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as any)}
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  >
                    <option value="Carpentry">Carpentry</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Civil">Civil</option>
                    <option value="Finishing">Finishing</option>
                    <option value="Painting">Painting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Priority:
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A756F] mb-1.5">
                    Due By:
                  </label>
                  <input
                    type="text"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-white border border-[#EAE7E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:border-[#A68B67]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#2D2D2D] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
              >
                Assign Task to Site
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
