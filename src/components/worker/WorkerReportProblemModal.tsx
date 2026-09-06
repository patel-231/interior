import React, { useState } from 'react';
import { Project, Task, IssueReport, IssueCategory, IssuePriority } from '../../types';
import {
  X,
  AlertOctagon,
  Camera,
  Video,
  Upload,
  Check,
  Package,
  Zap,
  Hammer,
  Wrench,
  Droplets,
  Compass,
  Users,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  Building2,
  MapPin,
  User,
  Film,
} from 'lucide-react';

interface WorkerReportProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  tasks?: Task[];
  onAddIssue: (issue: IssueReport) => void;
}

const CATEGORIES: { key: IssueCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'Material', label: 'Material', icon: Package },
  { key: 'Electrical', label: 'Electrical', icon: Zap },
  { key: 'Carpentry', label: 'Carpentry', icon: Hammer },
  { key: 'Civil', label: 'Civil', icon: Wrench },
  { key: 'Plumbing', label: 'Plumbing', icon: Droplets },
  { key: 'Design', label: 'Design', icon: Compass },
  { key: 'Client', label: 'Client', icon: Users },
  { key: 'Safety', label: 'Safety', icon: ShieldAlert },
  { key: 'Other', label: 'Other', icon: HelpCircle },
];

const PRIORITIES: { key: IssuePriority; label: string; sub: string; badgeColor: string }[] = [
  { key: 'Low', label: 'Low', sub: 'Minor cosmetic snag', badgeColor: 'bg-stone-100 text-stone-700 border-stone-300' },
  { key: 'Normal', label: 'Normal', sub: 'Standard site issue', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { key: 'High', label: 'High', sub: 'Action needed today', badgeColor: 'bg-amber-50 text-amber-800 border-amber-300' },
  { key: 'Urgent', label: 'Urgent', sub: 'Work stopped / Hazard', badgeColor: 'bg-rose-50 text-rose-700 border-rose-300' },
];

const CATEGORY_SUGGESTIONS: Record<IssueCategory, string[]> = {
  Material: [
    'Damaged veneer sheet batch received',
    'Shortage of 18mm marine plywood',
    'Hardware finish mismatch (brass vs black)',
  ],
  Electrical: [
    'Main DB breaker tripping under load',
    'Conduit clash with HVAC duct hanger',
    'Switchboard box cut-out misplaced',
  ],
  Carpentry: [
    'Carcass out of plumb by >8mm',
    'Veneer grain alignment mismatch on wardrobe',
    'Soft-close drawer slider jammed',
  ],
  Civil: [
    'Hollow sound detected in floor tiles',
    'Screed depression >6mm before vinyl laying',
    'Plaster crack along column beam joint',
  ],
  Plumbing: [
    'CPVC hot water joint seepage in shaft',
    'Drainage slope reverse in bathroom trap',
    'Water pressure dropped during 6-bar test',
  ],
  Design: [
    'Drawing dimension clash with site column',
    'Ceiling cove detail missing on CAD sheet',
    'Wall sconce height not aligning with door frame',
  ],
  Client: [
    'Client requested wall paint tone change',
    'Client visited and halted ceiling framing',
    'Custom handle sample rejected by client',
  ],
  Safety: [
    'Exposed 3-phase live cable across pathway',
    'Unstable scaffolding frame in double-height area',
    'Missing dust ventilation mask in spray room',
  ],
  Other: [
    'Society security halting heavy delivery vehicle',
    'Site water tanker delivery delayed',
    'Noise restriction during afternoon hours',
  ],
};

const SAMPLE_MEDIA = [
  {
    type: 'photo' as const,
    title: 'Plumbing Seepage',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  },
  {
    type: 'photo' as const,
    title: 'Veneer Scratch',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  },
  {
    type: 'photo' as const,
    title: 'Ceiling Level Defect',
    url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
  },
  {
    type: 'video' as const,
    title: 'Leak Video (Clip)',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  },
];

export const WorkerReportProblemModal: React.FC<WorkerReportProblemModalProps> = ({
  isOpen,
  onClose,
  project,
  tasks = [],
  onAddIssue,
}) => {
  const projectId = project?.id || '';
  const projectTasks = (tasks || []).filter((t) => !projectId || t.projectId === projectId);

  const [category, setCategory] = useState<IssueCategory>('Plumbing');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [relatedTaskId, setRelatedTaskId] = useState<string>('');
  const [priority, setPriority] = useState<IssuePriority>('Urgent');
  const [personResponsible, setPersonResponsible] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSelectMediaSample = (sample: (typeof SAMPLE_MEDIA)[0]) => {
    setMediaUrl(sample.url);
    setMediaType(sample.type);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video');
      setMediaType(isVideo ? 'video' : 'photo');
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const chosenTask = (projectTasks || []).find((t) => t.id === relatedTaskId);

    const newIssue: IssueReport = {
      id: `issue-${Date.now()}`,
      projectId: project?.id || 'proj-1',
      projectName: project?.name || 'Current Site',
      category,
      title: title.trim(),
      description: description.trim() || `Problem reported by site worker under ${category} category.`,
      priority,
      status: 'Open',
      room: chosenTask?.room || project?.rooms?.[0]?.name || 'General Site Area',
      relatedTaskId: chosenTask?.id || undefined,
      relatedTaskTitle: chosenTask?.title || undefined,
      reportedBy: project.siteManager || 'Site Team',
      reportedAt: 'Today, Just now',
      severity: priority === 'Urgent' ? 'Critical' : priority === 'High' ? 'Medium' : 'Low',
      imageUrl: mediaType === 'photo' ? mediaUrl || undefined : undefined,
      videoUrl: mediaType === 'video' ? mediaUrl || undefined : undefined,
      mediaType: mediaUrl ? mediaType : undefined,
      assignedTo: personResponsible.trim() || undefined,
      actionTaken: 'Flagged by site worker for owner/supervisor action.',
      comments: [
        {
          id: `comm-${Date.now()}`,
          author: project.siteManager || 'Site Worker',
          authorRole: 'Field Worker',
          text: `Reported issue: ${title.trim()} [Category: ${category} | Priority: ${priority}]`,
          createdAt: 'Just now',
        },
      ],
    };

    onAddIssue(newIssue);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      // Reset form
      setTitle('');
      setDescription('');
      setRelatedTaskId('');
      setPersonResponsible('');
      setMediaUrl('');
      onClose();
    }, 1800);
  };

  return (
    <div
      id="worker-report-problem-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl sm:rounded-3xl rounded-t-3xl shadow-2xl border border-[#EAE7E1] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#FDF3E7] border-b border-[#EAE7E1] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#B85C4E] text-white flex items-center justify-center shadow-xs">
              <AlertOctagon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B85C4E] block">
                Worker Problem Report
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#2D2D2D] leading-tight">
                Report Site Problem
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#EAE7E1] hover:bg-stone-100 flex items-center justify-center text-[#2D2D2D] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center animate-in zoom-in-50 duration-200">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#2D2D2D]">Problem Reported!</h3>
              <p className="text-xs text-[#7A756F] mt-1 max-w-sm mx-auto">
                Issue submitted to studio principal <span className="font-semibold text-[#2D2D2D]">Archana Sengupta</span> and supervisor <span className="font-semibold text-[#2D2D2D]">{project.siteManager}</span>.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F9F8F6] border border-[#EAE7E1] rounded-full text-xs text-[#2D2D2D] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#B85C4E] animate-ping" />
              <span>Priority: {priority} • Category: {category}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {/* 1. Project/Site Automatically Selected */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A756F] block mb-1.5">
                Current Project / Site (Automatically Selected)
              </label>
              <div className="p-3.5 rounded-2xl bg-[#F9F8F6] border border-[#EAE7E1] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#2D2D2D] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-[#2D2D2D]">{project.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Active Site
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A756F] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#A68B67]" />
                      <span>{project.address || 'Mumbai, Maharashtra'}</span>
                      <span className="text-stone-300">•</span>
                      <span>Sup: {project.siteManager}</span>
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A756F] block">
                    Locked to site
                  </span>
                  <span className="text-xs font-bold text-[#2D2D2D]">Auto-assigned</span>
                </div>
              </div>
            </div>

            {/* 2. Related Task Optional */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A756F]">
                  Related Task <span className="font-normal text-stone-400 normal-case">(Optional)</span>
                </label>
                {relatedTaskId && (
                  <button
                    type="button"
                    onClick={() => setRelatedTaskId('')}
                    className="text-[10px] text-[#B85C4E] hover:underline font-semibold"
                  >
                    Clear task link
                  </button>
                )}
              </div>
              <select
                value={relatedTaskId}
                onChange={(e) => setRelatedTaskId(e.target.value)}
                className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-2xl px-4 py-3 text-xs font-semibold text-[#2D2D2D] focus:outline-none focus:border-[#A68B67] transition-all"
              >
                <option value="">None (General Site Problem)</option>
                {projectTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} — {t.room} ({t.category})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Category (The 9 specified categories) */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A756F] block mb-2">
                Problem Category *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => {
                        setCategory(cat.key);
                        // Optional auto-suggest top title if title is empty
                        if (!title) {
                          const topSuggestion = CATEGORY_SUGGESTIONS[cat.key][0];
                          if (topSuggestion) setTitle(topSuggestion);
                        }
                      }}
                      className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all min-h-[64px] ${
                        isSelected
                          ? 'bg-[#2D2D2D] text-white border-[#2D2D2D] shadow-sm scale-[1.02]'
                          : 'bg-[#F9F8F6] text-[#2D2D2D] border-[#EAE7E1] hover:border-[#D6D0C7]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#A68B67]' : 'text-[#7A756F]'}`} />
                      <span className="text-xs font-bold">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Category Suggestions */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756F] block mb-1.5">
                Quick {category} Issue Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_SUGGESTIONS[category].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTitle(preset)}
                    className="text-[11px] font-medium px-3 py-1 rounded-full bg-white border border-[#EAE7E1] hover:border-[#B85C4E] hover:text-[#B85C4E] text-[#2D2D2D] transition-colors text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Title */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A756F] block mb-1.5">
                Problem Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Water leak at 25mm CPVC hot line junction"
                className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-2xl px-4 py-3 text-xs font-medium text-[#2D2D2D] focus:outline-none focus:border-[#B85C4E]"
              />
            </div>

            {/* 5. Description */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A756F] block mb-1.5">
                Detailed Description *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what is defective, which trade is stopped, or what urgent assistance is needed on site..."
                className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-2xl p-3.5 text-xs font-medium text-[#2D2D2D] focus:outline-none focus:border-[#B85C4E]"
              />
            </div>

            {/* 6. Photo / Video Attachment */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A756F]">
                  Photo / Video Attachment <span className="font-normal text-stone-400 normal-case">(Optional)</span>
                </label>
                {mediaUrl && (
                  <button
                    type="button"
                    onClick={() => setMediaUrl('')}
                    className="text-[10px] text-[#B85C4E] hover:underline font-semibold"
                  >
                    Remove Attachment
                  </button>
                )}
              </div>

              {mediaUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-[#EAE7E1] bg-black aspect-video max-h-48 group">
                  {mediaType === 'video' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white relative">
                      <img
                        src={mediaUrl}
                        alt="Video poster"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                      />
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-1 text-white border border-white/40">
                          <Film className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded">
                          Site Video Clip Attached
                        </span>
                      </div>
                    </div>
                  ) : (
                    <img src={mediaUrl} alt="Attached problem" className="w-full h-full object-cover" />
                  )}

                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    {mediaType === 'video' ? <Video className="w-3 h-3 text-[#A68B67]" /> : <Camera className="w-3 h-3 text-[#A68B67]" />}
                    <span>{mediaType}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMediaUrl('')}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="cursor-pointer p-3 rounded-2xl border border-dashed border-[#EAE7E1] hover:border-[#A68B67] bg-[#F9F8F6] flex items-center justify-center gap-2 text-xs font-bold text-[#2D2D2D] transition-colors">
                      <Camera className="w-4 h-4 text-[#A68B67]" />
                      <span>Take Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <label className="cursor-pointer p-3 rounded-2xl border border-dashed border-[#EAE7E1] hover:border-[#A68B67] bg-[#F9F8F6] flex items-center justify-center gap-2 text-xs font-bold text-[#2D2D2D] transition-colors">
                      <Video className="w-4 h-4 text-[#B85C4E]" />
                      <span>Record Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        capture="environment"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Sample inspection media for quick prototype demo */}
                  <div>
                    <span className="text-[10px] font-medium text-[#7A756F] block mb-1">
                      Or tap test media:
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {SAMPLE_MEDIA.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectMediaSample(s)}
                          className="p-1 rounded-xl bg-[#F9F8F6] border border-[#EAE7E1] hover:border-[#B85C4E] text-left text-[9px] font-medium text-[#2D2D2D]"
                        >
                          <div className="h-10 rounded-lg overflow-hidden mb-1 relative">
                            <img src={s.url} alt={s.title} className="w-full h-full object-cover" />
                            {s.type === 'video' && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Film className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <span className="truncate block leading-tight">{s.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 7. Priority (Low, Normal, High, Urgent) */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A756F] block mb-2">
                Priority *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRIORITIES.map((p) => {
                  const isSelected = priority === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setPriority(p.key)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? p.key === 'Urgent'
                            ? 'bg-[#B85C4E] text-white border-[#B85C4E] shadow-md'
                            : 'bg-[#2D2D2D] text-white border-[#2D2D2D] shadow-sm'
                          : 'bg-[#F9F8F6] text-[#2D2D2D] border-[#EAE7E1] hover:border-[#D6D0C7]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold">{p.label}</span>
                        {p.key === 'Urgent' && (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSelected ? 'bg-white animate-ping' : 'bg-[#B85C4E]'
                            }`}
                          />
                        )}
                      </div>
                      <span className={`text-[10px] block leading-tight ${isSelected ? 'text-stone-200' : 'text-[#7A756F]'}`}>
                        {p.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 8. Person Responsible (If known) */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A756F] block mb-1.5">
                Person Responsible <span className="font-normal text-stone-400 normal-case">(If known)</span>
              </label>
              <input
                type="text"
                value={personResponsible}
                onChange={(e) => setPersonResponsible(e.target.value)}
                placeholder="e.g. Sunil (Plumbing Sub) or Rajesh (Electricals)"
                className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-2xl px-4 py-3 text-xs font-medium text-[#2D2D2D] focus:outline-none focus:border-[#A68B67] mb-1.5"
              />
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Sunil (Plumbing Sub)',
                  'Ramesh (Civil Contractor)',
                  'Asian Paints Crew',
                  'DecoTimber (Carpentry)',
                  'Rajesh Electricals',
                  'To be assigned by Studio',
                ].map((name, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPersonResponsible(name)}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white border border-[#EAE7E1] hover:border-[#A68B67] text-[#2D2D2D] transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-[#EAE7E1]">
              <button
                id="worker-submit-problem-btn"
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-[#B85C4E] hover:bg-[#9e4b3e] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.99]"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>Submit Problem to Studio Principal</span>
              </button>
              <p className="text-[11px] text-center text-[#7A756F] mt-2 italic">
                Urgent unresolved issues will immediately show on the owner&apos;s Needs Attention dashboard.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
