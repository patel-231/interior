import React, { useState, useEffect } from 'react';
import { Task, SiteUpdate, Project } from '../../types';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Wrench,
  TrendingUp,
  Percent,
  Camera,
  Upload,
  Sparkles,
  MapPin,
  Tag,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  Search,
} from 'lucide-react';

export type ProgressChoice =
  | 'Not Started'
  | 'Started'
  | 'Half Done'
  | 'Almost Done'
  | 'Completed';

export interface WorkerProgressUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks?: Task[];
  project?: Project;
  projects?: Project[];
  currentProjectId?: string;
  initialTask?: Task | null;
  initialTaskId?: string | null;
  onSaveProgress?: (
    taskId: string,
    progressChoice: ProgressChoice,
    exactPercentage: number,
    photos: string[],
    note: string
  ) => void;
  onSaveUpdate?: (
    taskId: string,
    progressChoice: ProgressChoice,
    exactPercentage: number,
    photos: string[],
    note: string
  ) => void;
}

interface ProgressOption {
  key: ProgressChoice;
  label: string;
  percent: number;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const PROGRESS_OPTIONS: ProgressOption[] = [
  {
    key: 'Not Started',
    label: 'Not Started',
    percent: 0,
    description: 'Work has not begun yet',
    icon: <Clock className="w-5 h-5 text-stone-500" />,
    color: 'text-stone-700',
    bgColor: 'bg-stone-100 border-stone-300',
  },
  {
    key: 'Started',
    label: 'Started',
    percent: 25,
    description: 'Materials on site & initial work commenced',
    icon: <Wrench className="w-5 h-5 text-[#D18C28]" />,
    color: 'text-[#D18C28]',
    bgColor: 'bg-[#FDF3E7] border-[#D18C28]/40',
  },
  {
    key: 'Half Done',
    label: 'Half Done',
    percent: 50,
    description: 'Rough-in & core framing halfway through',
    icon: <TrendingUp className="w-5 h-5 text-[#A68B67]" />,
    color: 'text-[#A68B67]',
    bgColor: 'bg-[#F5F1EB] border-[#A68B67]/40',
  },
  {
    key: 'Almost Done',
    label: 'Almost Done',
    percent: 75,
    description: 'Finishing touches, alignments & detailing',
    icon: <TrendingUp className="w-5 h-5 text-[#5B7B61]" />,
    color: 'text-[#5B7B61]',
    bgColor: 'bg-[#E8F2EA] border-[#5B7B61]/40',
  },
  {
    key: 'Completed',
    label: 'Completed',
    percent: 100,
    description: 'Fully finished, cleaned & ready for sign-off',
    icon: <CheckCircle2 className="w-5 h-5 text-[#5B7B61]" />,
    color: 'text-[#5B7B61]',
    bgColor: 'bg-[#E8F2EA] border-[#5B7B61]',
  },
];

const SAMPLE_SITE_PHOTOS = [
  {
    title: 'Ceiling Wiring & Profile',
    url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Wardrobe Veneer Shutters',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Plumbing Shaft & Pressure Gauge',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Wall Primer & Putty Coat',
    url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
  },
];

const QUICK_NOTES = [
  '✓ Finished as per drawing & room layout',
  '⏳ Waiting for plaster/screed to dry',
  '⚠️ Need extra screws & hardware fasteners',
  '🔍 Ready for supervisor sign-off & inspection',
  '⚡ Power circuit continuity tested OK',
  '🧹 Work area cleared & debris removed',
];

export const WorkerProgressUpdateModal: React.FC<WorkerProgressUpdateModalProps> = ({
  isOpen,
  onClose,
  tasks = [],
  project,
  projects,
  currentProjectId,
  initialTask,
  initialTaskId,
  onSaveProgress,
  onSaveUpdate,
}) => {
  // Resolve effective currentProjectId and currentProject safely
  const effectiveProjectId =
    currentProjectId ||
    project?.id ||
    (projects && projects[0]?.id) ||
    (tasks && tasks[0]?.projectId) ||
    '';

  const currentProject =
    project ||
    (Array.isArray(projects) ? projects.find((p) => p.id === effectiveProjectId) : undefined) ||
    (Array.isArray(projects) ? projects[0] : undefined) || {
      id: effectiveProjectId,
      name: 'Current Site',
      siteManager: 'Site Supervisor',
      address: '',
      clientName: '',
      deadline: '',
      progress: 0,
      status: 'On Track' as const,
      type: 'Interior',
      rooms: [],
    };

  // Filter tasks for current project
  const siteTasks = (tasks || []).filter(
    (t) => !effectiveProjectId || t.projectId === effectiveProjectId
  );

  // Flow step: 1 to 5, or 'confirmed'
  const [step, setStep] = useState<number>(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskSearchQuery, setTaskSearchQuery] = useState('');

  // Step 2: Progress Choice & optional percentage
  const [progressChoice, setProgressChoice] = useState<ProgressChoice>('Half Done');
  const [exactPercentage, setExactPercentage] = useState<number>(50);
  const [showCustomPercentage, setShowCustomPercentage] = useState<boolean>(false);

  // Step 3: Photos
  const [photos, setPhotos] = useState<string[]>([]);
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  // Step 4: Notes
  const [note, setNote] = useState('');

  // Sync initial task if provided (directly or via ID)
  useEffect(() => {
    let taskToSelect: Task | null = initialTask || null;
    if (!taskToSelect && initialTaskId && Array.isArray(tasks)) {
      taskToSelect = tasks.find((t) => t.id === initialTaskId) || null;
    }

    if (taskToSelect) {
      setSelectedTask(taskToSelect);
      // Map initial task progress
      const p = taskToSelect.progress ?? (taskToSelect.isCompleted ? 100 : 25);
      setExactPercentage(p);
      if (p >= 100) setProgressChoice('Completed');
      else if (p >= 75) setProgressChoice('Almost Done');
      else if (p >= 50) setProgressChoice('Half Done');
      else if (p > 0) setProgressChoice('Started');
      else setProgressChoice('Not Started');

      // If task was opened directly with a preselected task, start at step 2
      setStep(2);
    } else if (siteTasks.length > 0) {
      setSelectedTask(siteTasks[0]);
      setStep(1);
    } else {
      setSelectedTask(null);
      setStep(1);
    }
  }, [initialTask, initialTaskId, isOpen, effectiveProjectId]);

  if (!isOpen) return null;

  // Filter tasks for step 1
  const displayedTasks = siteTasks.filter(
    (t) =>
      t.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) ||
      t.room.toLowerCase().includes(taskSearchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(taskSearchQuery.toLowerCase())
  );

  const handleSelectChoice = (option: ProgressOption) => {
    setProgressChoice(option.key);
    setExactPercentage(option.percent);
  };

  const handleAddSamplePhoto = (url: string) => {
    if (!photos.includes(url)) {
      setPhotos((prev) => [...prev, url]);
    }
  };

  const handleAddCustomPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPhotoInput.trim() && !photos.includes(customPhotoInput.trim())) {
      setPhotos((prev) => [...prev, customPhotoInput.trim()]);
      setCustomPhotoInput('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuickNoteClick = (text: string) => {
    if (!note) {
      setNote(text);
    } else {
      setNote((prev) => `${prev} • ${text}`);
    }
  };

  const handleFinalSubmit = () => {
    if (!selectedTask) return;
    const saveFn = onSaveUpdate || onSaveProgress;
    if (saveFn) {
      saveFn(selectedTask.id, progressChoice, exactPercentage, photos, note);
    }
    setStep(6); // Step 6 represents the Confirmation screen
  };

  const handleResetForAnother = () => {
    setStep(1);
    setSelectedTask(siteTasks[0] || null);
    setProgressChoice('Started');
    setExactPercentage(25);
    setPhotos([]);
    setNote('');
  };

  const stepTitles = [
    'Select Task',
    'Set Progress',
    'Upload Photos',
    'Add Note',
    'Submit Update',
  ];

  return (
    <div
      id="worker-progress-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="worker-progress-update-modal"
        className="bg-white w-full max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl border border-[#EAE7E1] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#F9F8F6] border-b border-[#EAE7E1] shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {step > 1 && step <= 5 && (
                <button
                  id="worker-progress-back-step-btn"
                  onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-full bg-white border border-[#EAE7E1] flex items-center justify-center text-[#2D2D2D] hover:bg-stone-100 transition-colors mr-1"
                  aria-label="Previous step"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A68B67] block leading-tight">
                  {step <= 5 ? `Step ${step} of 5` : 'Confirmation'}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-[#2D2D2D] leading-tight">
                  {step <= 5 ? stepTitles[step - 1] : 'Update Confirmed'}
                </h2>
              </div>
            </div>

            <button
              id="worker-progress-close-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white border border-[#EAE7E1] hover:bg-stone-100 flex items-center justify-center text-[#2D2D2D] transition-colors shadow-xs"
              aria-label="Close update flow"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          {/* Visual Step Indicator Bar (Steps 1-5) */}
          {step <= 5 && (
            <div className="w-full grid grid-cols-5 gap-1.5 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-[#2D2D2D]' : 'bg-[#EAE7E1]'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Step Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* ================= STEP 1: SELECT TASK ================= */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#7A756F]">
                  Site: <strong className="text-[#2D2D2D] font-bold">{currentProject.name}</strong>
                </span>
                <p className="text-sm font-bold text-[#2D2D2D] mt-0.5">
                  Which task are you working on today?
                </p>
              </div>

              {/* Task Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#7A756F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={taskSearchQuery}
                  onChange={(e) => setTaskSearchQuery(e.target.value)}
                  placeholder="Filter tasks or rooms..."
                  className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#2D2D2D] placeholder:text-[#7A756F] focus:outline-none focus:border-[#A68B67] transition-colors"
                />
              </div>

              {/* Tasks List: Large touch-friendly selection cards */}
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {displayedTasks.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#7A756F] bg-[#F9F8F6] rounded-2xl border border-[#EAE7E1]">
                    No tasks found matching your filter.
                  </div>
                ) : (
                  displayedTasks.map((t) => {
                    const isSelected = selectedTask?.id === t.id;
                    return (
                      <div
                        key={t.id}
                        id={`select-task-${t.id}`}
                        onClick={() => setSelectedTask(t)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-[#FDFBF7] border-[#2D2D2D] shadow-sm'
                            : 'bg-white border-[#EAE7E1] hover:border-[#D6D0C7]'
                        }`}
                      >
                        {/* Radio Check Circle */}
                        <div className="mt-0.5 shrink-0">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                              isSelected
                                ? 'border-[#2D2D2D] bg-[#2D2D2D] text-white'
                                : 'border-[#D6D0C7] bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Task Information */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F9F8F6] text-[#7A756F] border border-[#EAE7E1]">
                              {t.category}
                            </span>
                            <span className="text-xs font-bold text-[#A68B67]">
                              {t.progress ?? (t.isCompleted ? 100 : 0)}%
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-[#2D2D2D] leading-snug">
                            {t.title}
                          </h3>

                          <div className="flex items-center gap-2 text-xs text-[#7A756F] mt-1.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#A68B67]" />
                              {t.room}
                            </span>
                            <span>• Due: {t.deadline || t.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 2: SET PROGRESS ================= */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Selected Task Summary Pill */}
              {selectedTask && (
                <div className="bg-[#F9F8F6] p-3.5 rounded-2xl border border-[#EAE7E1] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#A68B67] block">
                      Updating Task
                    </span>
                    <p className="text-xs font-bold text-[#2D2D2D] truncate">
                      {selectedTask.title}
                    </p>
                    <span className="text-[11px] text-[#7A756F]">
                      {selectedTask.room}
                    </span>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-[#A68B67] hover:underline shrink-0"
                  >
                    Change
                  </button>
                </div>
              )}

              <div>
                <label className="text-sm font-bold text-[#2D2D2D] block mb-1">
                  How far along is this work?
                </label>
                <p className="text-xs text-[#7A756F]">
                  Tap one of the simple choices below:
                </p>
              </div>

              {/* 5 Simple Choices - Large Touch-Friendly Cards */}
              <div className="space-y-2.5">
                {PROGRESS_OPTIONS.map((option) => {
                  const isSelected = progressChoice === option.key;
                  return (
                    <button
                      key={option.key}
                      id={`progress-choice-${option.key.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => handleSelectChoice(option)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left ${
                        isSelected
                          ? `${option.bgColor} border-[#2D2D2D] shadow-xs`
                          : 'bg-white border-[#EAE7E1] hover:border-[#D6D0C7]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white shadow-xs' : 'bg-[#F9F8F6]'
                          }`}
                        >
                          {option.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-[#2D2D2D]">
                              {option.label}
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 text-[#2D2D2D] border border-[#EAE7E1]">
                              {option.percent}%
                            </span>
                          </div>
                          <span className="text-xs text-[#7A756F] block mt-0.5 leading-tight">
                            {option.description}
                          </span>
                        </div>
                      </div>

                      <div className="ml-3 shrink-0">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                            isSelected
                              ? 'border-[#2D2D2D] bg-[#2D2D2D] text-white'
                              : 'border-[#D6D0C7] bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Optional Fine-Tune Percentage Section */}
              <div className="pt-2 border-t border-[#EAE7E1]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#2D2D2D]">
                    Fine-tune exact percentage (optional):
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setExactPercentage((prev) => Math.max(0, prev - 5))}
                      className="w-7 h-7 rounded-lg bg-[#F9F8F6] border border-[#EAE7E1] text-xs font-bold text-[#2D2D2D] hover:bg-stone-200"
                    >
                      -5%
                    </button>
                    <span className="text-sm font-bold text-[#2D2D2D] w-12 text-center">
                      {exactPercentage}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setExactPercentage((prev) => Math.min(100, prev + 5))}
                      className="w-7 h-7 rounded-lg bg-[#F9F8F6] border border-[#EAE7E1] text-xs font-bold text-[#2D2D2D] hover:bg-stone-200"
                    >
                      +5%
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={exactPercentage}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setExactPercentage(val);
                    if (val >= 100) setProgressChoice('Completed');
                    else if (val >= 75) setProgressChoice('Almost Done');
                    else if (val >= 50) setProgressChoice('Half Done');
                    else if (val > 0) setProgressChoice('Started');
                    else setProgressChoice('Not Started');
                  }}
                  className="w-full accent-[#2D2D2D] h-2 bg-[#EAE7E1] rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* ================= STEP 3: UPLOAD PHOTOS ================= */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-bold text-[#2D2D2D] block mb-1">
                  Upload Site Photos
                </label>
                <p className="text-xs text-[#7A756F]">
                  Snap progress photos so the designer and supervisor can verify work without delays.
                </p>
              </div>

              {/* Large Camera / File Touch Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <label
                  htmlFor="worker-file-camera-input"
                  className="p-5 rounded-2xl bg-[#F9F8F6] border-2 border-dashed border-[#A68B67] hover:bg-[#F5F1EB] transition-colors cursor-pointer flex flex-col items-center justify-center text-center gap-2 group shadow-xs"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#2D2D2D] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2D2D2D] block">
                      Take Photo
                    </span>
                    <span className="text-[10px] text-[#7A756F]">Camera tap</span>
                  </div>
                  <input
                    id="worker-file-camera-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const fakeUrl = URL.createObjectURL(file);
                        setPhotos((prev) => [...prev, fakeUrl]);
                      }
                    }}
                  />
                </label>

                <label
                  htmlFor="worker-file-gallery-input"
                  className="p-5 rounded-2xl bg-[#F9F8F6] border-2 border-dashed border-[#EAE7E1] hover:border-[#A68B67] hover:bg-[#F5F1EB] transition-colors cursor-pointer flex flex-col items-center justify-center text-center gap-2 group shadow-xs"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#A68B67] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2D2D2D] block">
                      Choose Gallery
                    </span>
                    <span className="text-[10px] text-[#7A756F]">Select files</span>
                  </div>
                  <input
                    id="worker-file-gallery-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        Array.from(e.target.files).forEach((file: File) => {
                          const fakeUrl = URL.createObjectURL(file);
                          setPhotos((prev) => [...prev, fakeUrl]);
                        });
                      }
                    }}
                  />
                </label>
              </div>

              {/* Quick Sample Site Photos (instant one-click testing) */}
              <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#EAE7E1]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A68B67] block mb-2">
                  Quick Demo: Tap sample site photo to attach
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_SITE_PHOTOS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSamplePhoto(sample.url)}
                      className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#EAE7E1] hover:border-[#A68B67] text-left transition-all text-xs"
                    >
                      <img
                        src={sample.url}
                        alt={sample.title}
                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                      />
                      <span className="text-[11px] font-semibold text-[#2D2D2D] truncate">
                        {sample.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Attached Photos Preview */}
              <div>
                <span className="text-xs font-bold text-[#2D2D2D] block mb-2">
                  Attached Photos ({photos.length})
                </span>

                {photos.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#F9F8F6] text-center text-xs text-[#7A756F] italic border border-[#EAE7E1]">
                    No photos attached yet. You can proceed without photos or tap above.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2.5">
                    {photos.map((pUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-xl overflow-hidden border border-[#EAE7E1] group bg-stone-100"
                      >
                        <img
                          src={pUrl}
                          alt={`Uploaded ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700"
                        >
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 4: ADD A SHORT NOTE ================= */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-[#2D2D2D] block mb-1">
                  Add a Short Note
                </label>
                <p className="text-xs text-[#7A756F]">
                  Type any brief remarks, or simply tap a quick phrase below.
                </p>
              </div>

              {/* Quick-tap Chips */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756F] block mb-2">
                  Quick site remarks (Tap to insert):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_NOTES.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickNoteClick(chip)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F9F8F6] border border-[#EAE7E1] hover:border-[#A68B67] hover:bg-[#F5F1EB] text-[#2D2D2D] transition-all text-left shadow-xs"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Note Area */}
              <div className="space-y-1">
                <textarea
                  id="worker-progress-notes-input"
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Completed second coat; verified level with spirit ruler; waiting for inspection."
                  className="w-full bg-[#F9F8F6] border border-[#EAE7E1] rounded-2xl p-4 text-sm text-[#2D2D2D] placeholder:text-[#7A756F] focus:outline-none focus:border-[#A68B67] transition-colors leading-relaxed"
                />
                <span className="text-[11px] text-[#7A756F] italic">
                  Keep it brief and clear for the site supervisor.
                </span>
              </div>
            </div>
          )}

          {/* ================= STEP 5: SUBMIT UPDATE ================= */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-bold text-[#2D2D2D] block mb-1">
                  Review & Submit Work Update
                </label>
                <p className="text-xs text-[#7A756F]">
                  Please verify the summary below before logging your work.
                </p>
              </div>

              {/* Comprehensive Summary Review Card */}
              <div className="bg-[#F9F8F6] rounded-2xl border border-[#EAE7E1] p-5 space-y-4">
                {/* Task Name & Room */}
                <div className="border-b border-[#EAE7E1] pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A756F] block">
                    Task
                  </span>
                  <h3 className="text-base font-bold text-[#2D2D2D] mt-0.5">
                    {selectedTask?.title}
                  </h3>
                  <span className="text-xs text-[#A68B67] font-semibold block mt-0.5">
                    Room: {selectedTask?.room} • Category: {selectedTask?.category}
                  </span>
                </div>

                {/* Progress Status */}
                <div className="border-b border-[#EAE7E1] pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A756F] block">
                      New Progress
                    </span>
                    <span className="text-lg font-bold text-[#2D2D2D] block mt-0.5">
                      {progressChoice}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#5B7B61]">
                      {exactPercentage}%
                    </span>
                  </div>
                </div>

                {/* Attached Photos */}
                <div className="border-b border-[#EAE7E1] pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A756F] block mb-1">
                    Attached Photos ({photos.length})
                  </span>
                  {photos.length === 0 ? (
                    <span className="text-xs text-[#7A756F] italic">No photos attached</span>
                  ) : (
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {photos.map((p, i) => (
                        <img
                          key={i}
                          src={p}
                          alt="Thumbnail"
                          className="w-12 h-12 rounded-lg object-cover border border-[#EAE7E1] shrink-0"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Note */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A756F] block mb-1">
                    Site Note
                  </span>
                  <p className="text-xs text-[#2D2D2D] bg-white p-3 rounded-xl border border-[#EAE7E1] leading-relaxed">
                    {note || 'Progress update logged from site.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 6: CLEAR CONFIRMATION SCREEN ================= */}
          {step === 6 && (
            <div className="py-6 text-center space-y-5">
              {/* Celebratory Checkmark Icon */}
              <div className="w-20 h-20 rounded-full bg-[#E8F2EA] text-[#5B7B61] mx-auto flex items-center justify-center shadow-lg border-2 border-[#5B7B61]/30 animate-in zoom-in-50 duration-300">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#5B7B61] block mb-1">
                  Success
                </span>
                <h3 className="text-2xl font-bold text-[#2D2D2D]">
                  Update Logged Successfully!
                </h3>
                <p className="text-xs text-[#7A756F] mt-1 max-w-sm mx-auto">
                  Your supervisor and project manager have received this work log. Today's task list has been updated.
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="bg-[#F9F8F6] p-4 rounded-2xl border border-[#EAE7E1] text-left max-w-sm mx-auto space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#7A756F]">Task:</span>
                  <strong className="text-[#2D2D2D] truncate ml-2 max-w-[200px]">
                    {selectedTask?.title}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A756F]">Status:</span>
                  <span className="font-bold text-[#5B7B61]">
                    {progressChoice} ({exactPercentage}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A756F]">Photos Logged:</span>
                  <strong className="text-[#2D2D2D]">{photos.length} photos</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A756F]">Recorded:</span>
                  <strong className="text-[#2D2D2D]">Just now</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2 max-w-sm mx-auto">
                <button
                  id="worker-confirm-done-btn"
                  onClick={onClose}
                  className="w-full py-4 px-6 rounded-2xl bg-[#2D2D2D] hover:bg-black text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#5B7B61]" />
                  <span>Done / Back to Today's Work</span>
                </button>

                <button
                  id="worker-confirm-another-btn"
                  onClick={handleResetForAnother}
                  className="w-full py-3 px-6 rounded-2xl bg-white border border-[#EAE7E1] hover:bg-stone-100 text-[#2D2D2D] font-bold text-xs transition-colors"
                >
                  Update Another Task
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons (Steps 1 to 5) */}
        {step <= 5 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#EAE7E1] shrink-0">
            {step === 1 && (
              <button
                id="worker-next-step-1"
                disabled={!selectedTask}
                onClick={() => setStep(2)}
                className="w-full py-4 px-6 rounded-2xl bg-[#2D2D2D] hover:bg-black disabled:bg-stone-300 text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Next: Set Progress</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {step === 2 && (
              <button
                id="worker-next-step-2"
                onClick={() => setStep(3)}
                className="w-full py-4 px-6 rounded-2xl bg-[#2D2D2D] hover:bg-black text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Next: Upload Photos</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {step === 3 && (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="py-4 px-4 rounded-2xl bg-white border border-[#EAE7E1] hover:bg-stone-100 text-[#7A756F] font-bold text-xs"
                >
                  Skip Photos
                </button>
                <button
                  id="worker-next-step-3"
                  onClick={() => setStep(4)}
                  className="flex-1 py-4 px-6 rounded-2xl bg-[#2D2D2D] hover:bg-black text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <span>Next: Add Note</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {step === 4 && (
              <button
                id="worker-next-step-4"
                onClick={() => setStep(5)}
                className="w-full py-4 px-6 rounded-2xl bg-[#2D2D2D] hover:bg-black text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Next: Review & Submit</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {step === 5 && (
              <button
                id="worker-submit-update-btn"
                onClick={handleFinalSubmit}
                className="w-full py-4 px-6 rounded-2xl bg-[#5B7B61] hover:bg-[#48634e] text-white font-bold text-base flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>Submit Work Update</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
