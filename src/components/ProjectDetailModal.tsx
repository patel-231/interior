import React, { useState } from 'react';
import { Project, Task, MaterialRequest, IssueReport, SiteUpdate, ProjectFile, TaskStatus } from '../types';
import { ProjectDetailHeader } from './project-detail/ProjectDetailHeader';
import { OverviewTab } from './project-detail/OverviewTab';
import { WorkTab } from './project-detail/WorkTab';
import { MaterialsTab } from './project-detail/MaterialsTab';
import { UpdatesTab } from './project-detail/UpdatesTab';
import { IssuesTab } from './project-detail/IssuesTab';
import { FilesTab } from './project-detail/FilesTab';
import { TaskDetailModal } from './project-detail/TaskDetailModal';
import { PhotoLightboxModal } from './project-detail/PhotoLightboxModal';
import {
  LayoutDashboard,
  Hammer,
  Package,
  Clock,
  AlertTriangle,
  FolderArchive,
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  tasks: Task[];
  materialRequests: MaterialRequest[];
  issues: IssueReport[];
  updates: SiteUpdate[];
  files?: ProjectFile[];
  onOpenActionModal?: (type: 'progress' | 'photo' | 'material' | 'issue' | 'project' | 'task') => void;
  onToggleTask?: (taskId: string) => void;
  onUpdateTaskStatus?: (taskId: string, status: TaskStatus) => void;
  onUpdateTaskProgress?: (taskId: string, progress: number) => void;
  onApproveMaterial?: (id: string) => void;
  onResolveIssue?: (id: string) => void;
}

export type ProjectDetailTab = 'overview' | 'work' | 'materials' | 'updates' | 'issues' | 'files';

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  tasks,
  materialRequests,
  issues,
  updates,
  files = [],
  onOpenActionModal,
  onToggleTask,
  onUpdateTaskStatus,
  onUpdateTaskProgress,
  onApproveMaterial,
  onResolveIssue,
}) => {
  const [activeTab, setActiveTab] = useState<ProjectDetailTab>('overview');
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<{
    url: string;
    title?: string;
    room?: string;
    timestamp?: string;
  } | null>(null);

  if (!project) return null;

  // Compute counts for badges
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectMaterials = materialRequests.filter((m) => m.projectId === project.id);
  const projectIssues = issues.filter((i) => i.projectId === project.id && i.status !== 'Resolved');
  const projectUpdates = updates.filter((u) => u.projectId === project.id);
  const projectFiles = files.filter((f) => f.projectId === project.id);

  const handleOpenPhoto = (imageUrl: string, title?: string, room?: string, timestamp?: string) => {
    setLightboxPhoto({ url: imageUrl, title, room, timestamp });
  };

  return (
    <>
      <div
        id="project-detail-modal-backdrop"
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      >
        <div
          id="project-detail-container"
          className="bg-[#F9F8F6] w-full max-w-4xl max-h-[94vh] sm:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl overflow-hidden border border-[#EAE7E1] animate-in fade-in slide-in-from-bottom duration-200"
        >
          {/* 1. Header with image, title, client, address, start date, expected completion, progress, status */}
          <ProjectDetailHeader project={project} onClose={onClose} />

          {/* 2. Navigation Tabs (6 requested tabs) */}
          <div className="flex border-b border-[#EAE7E1] bg-white px-3 sm:px-6 overflow-x-auto shrink-0 scrollbar-none text-xs font-semibold gap-1 sm:gap-2">
            <button
              id="tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`py-3.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'border-[#2D2D2D] text-[#2D2D2D]'
                  : 'border-transparent text-[#7A756F] hover:text-[#2D2D2D]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>1. Overview</span>
            </button>

            <button
              id="tab-work"
              onClick={() => setActiveTab('work')}
              className={`py-3.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'work'
                  ? 'border-[#2D2D2D] text-[#2D2D2D]'
                  : 'border-transparent text-[#7A756F] hover:text-[#2D2D2D]'
              }`}
            >
              <Hammer className="w-3.5 h-3.5" />
              <span>2. Work</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EAE7E1] text-[#2D2D2D]">
                {projectTasks.length}
              </span>
            </button>

            <button
              id="tab-materials"
              onClick={() => setActiveTab('materials')}
              className={`py-3.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'materials'
                  ? 'border-[#2D2D2D] text-[#2D2D2D]'
                  : 'border-transparent text-[#7A756F] hover:text-[#2D2D2D]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>3. Materials</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EAE7E1] text-[#2D2D2D]">
                {projectMaterials.length}
              </span>
            </button>

            <button
              id="tab-updates"
              onClick={() => setActiveTab('updates')}
              className={`py-3.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'updates'
                  ? 'border-[#2D2D2D] text-[#2D2D2D]'
                  : 'border-transparent text-[#7A756F] hover:text-[#2D2D2D]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>4. Updates</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EAE7E1] text-[#2D2D2D]">
                {projectUpdates.length}
              </span>
            </button>

            <button
              id="tab-issues"
              onClick={() => setActiveTab('issues')}
              className={`py-3.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'issues'
                  ? 'border-[#2D2D2D] text-[#2D2D2D]'
                  : 'border-transparent text-[#7A756F] hover:text-[#2D2D2D]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>5. Issues</span>
              {projectIssues.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#B85C4E] text-white">
                  {projectIssues.length}
                </span>
              )}
            </button>

            <button
              id="tab-files"
              onClick={() => setActiveTab('files')}
              className={`py-3.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'files'
                  ? 'border-[#2D2D2D] text-[#2D2D2D]'
                  : 'border-transparent text-[#7A756F] hover:text-[#2D2D2D]'
              }`}
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>6. Files</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EAE7E1] text-[#2D2D2D]">
                {projectFiles.length}
              </span>
            </button>
          </div>

          {/* 3. Tab Body Container */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {activeTab === 'overview' && (
              <OverviewTab
                project={project}
                tasks={tasks}
                materialRequests={materialRequests}
                issues={issues}
                updates={updates}
                onSelectTab={(tab) => setActiveTab(tab)}
                onSelectPhoto={handleOpenPhoto}
                onToggleTask={onToggleTask}
                onSelectTask={(task) => setSelectedTaskForDetail(task)}
              />
            )}

            {activeTab === 'work' && (
              <WorkTab
                project={project}
                tasks={tasks}
                onSelectTask={(task) => setSelectedTaskForDetail(task)}
                onToggleTask={onToggleTask}
                onUpdateStatus={onUpdateTaskStatus}
                onSelectPhoto={(photo, title, room) => handleOpenPhoto(photo, title, room)}
                onAddTask={() => onOpenActionModal && onOpenActionModal('task')}
              />
            )}

            {activeTab === 'materials' && (
              <MaterialsTab
                project={project}
                materialRequests={materialRequests}
                onApproveMaterial={onApproveMaterial}
                onRequestMaterial={() => onOpenActionModal && onOpenActionModal('material')}
              />
            )}

            {activeTab === 'updates' && (
              <UpdatesTab
                project={project}
                updates={updates}
                onSelectPhoto={handleOpenPhoto}
                onAddUpdate={() => onOpenActionModal && onOpenActionModal('photo')}
              />
            )}

            {activeTab === 'issues' && (
              <IssuesTab
                project={project}
                issues={issues}
                onResolveIssue={onResolveIssue}
                onReportIssue={() => onOpenActionModal && onOpenActionModal('issue')}
                onSelectPhoto={handleOpenPhoto}
              />
            )}

            {activeTab === 'files' && (
              <FilesTab
                project={project}
                files={files}
                onUploadFile={() => onOpenActionModal && onOpenActionModal('progress')}
              />
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3.5 sm:p-4 bg-white border-t border-[#EAE7E1] flex items-center justify-between gap-3 shrink-0">
            <span className="text-[11px] text-[#7A756F]">
              SiteFlow • Interior Architecture & Field Operations
            </span>
            <button
              id="footer-close-detail-btn"
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-[#EAE7E1] hover:bg-stone-100 text-xs font-semibold text-[#2D2D2D] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Task Details Modal Overlay */}
      {selectedTaskForDetail && (
        <TaskDetailModal
          task={selectedTaskForDetail}
          isOpen={true}
          onClose={() => setSelectedTaskForDetail(null)}
          onUpdateStatus={(taskId, newStatus) => {
            if (onUpdateTaskStatus) {
              onUpdateTaskStatus(taskId, newStatus);
            }
            setSelectedTaskForDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
          }}
          onUpdateProgress={(taskId, newProgress) => {
            if (onUpdateTaskProgress) {
              onUpdateTaskProgress(taskId, newProgress);
            }
            setSelectedTaskForDetail((prev) => (prev ? { ...prev, progress: newProgress } : null));
          }}
          onSelectPhoto={(photo, title, room) => handleOpenPhoto(photo, title, room)}
        />
      )}

      {/* Fullscreen Photo Lightbox Overlay */}
      {lightboxPhoto && (
        <PhotoLightboxModal
          isOpen={true}
          onClose={() => setLightboxPhoto(null)}
          imageUrl={lightboxPhoto.url}
          title={lightboxPhoto.title}
          room={lightboxPhoto.room}
          timestamp={lightboxPhoto.timestamp}
        />
      )}
    </>
  );
};
