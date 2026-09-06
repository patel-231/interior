import React, { useState } from 'react';
import {
  UserRole,
  Project,
  Task,
  MaterialRequest,
  IssueReport,
  IssuePriority,
  IssueComment,
  IssueStatus,
  SiteUpdate,
  ProjectFile,
  TaskStatus,
} from './types';
import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MATERIAL_REQUESTS,
  INITIAL_ISSUES,
  INITIAL_UPDATES,
  INITIAL_FILES,
} from './mockData';
import { DevRoleSwitcher } from './components/DevRoleSwitcher';
import { Header } from './components/Header';
import { BottomNav, OwnerTab, WorkerTab } from './components/BottomNav';
import { OwnerHome } from './components/OwnerHome';
import { WorkerHome } from './components/WorkerHome';
import { ProjectsView } from './components/ProjectsView';
import { MaterialsView } from './components/MaterialsView';
import { OwnerIssuesScreen } from './components/OwnerIssuesScreen';
import { TasksView } from './components/TasksView';
import { UpdatesFeedView } from './components/UpdatesFeedView';
import { ProfileView } from './components/ProfileView';
import { MoreView } from './components/MoreView';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ActionModal, ModalType } from './components/modals/ActionModal';
import { AddMenuModal } from './components/modals/AddMenuModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { WorkerTaskDetailModal } from './components/worker/WorkerTaskDetailModal';
import { WorkerProgressUpdateModal, ProgressChoice } from './components/worker/WorkerProgressUpdateModal';
import { WorkerPhotoUploadModal } from './components/worker/WorkerPhotoUploadModal';
import { WorkerMaterialRequestModal } from './components/worker/WorkerMaterialRequestModal';
import { WorkerReportProblemModal } from './components/worker/WorkerReportProblemModal';

export default function App() {
  // Role & View State
  const [role, setRole] = useState<UserRole>('OWNER');
  const [ownerTab, setOwnerTab] = useState<OwnerTab>('Home');
  const [workerTab, setWorkerTab] = useState<WorkerTab>('Home');
  const [workerSiteId, setWorkerSiteId] = useState<string>('proj-1');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Core Data State
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>(INITIAL_MATERIAL_REQUESTS);
  const [issues, setIssues] = useState<IssueReport[]>(INITIAL_ISSUES);
  const [updates, setUpdates] = useState<SiteUpdate[]>(INITIAL_UPDATES);
  const [files, setFiles] = useState<ProjectFile[]>(INITIAL_FILES);

  // Modal States
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<Project | null>(null);
  const [actionModalType, setActionModalType] = useState<ModalType>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Dedicated Worker Modal States
  const [workerSelectedTask, setWorkerSelectedTask] = useState<Task | null>(null);
  const [isWorkerProgressUpdateOpen, setIsWorkerProgressUpdateOpen] = useState<boolean>(false);
  const [workerProgressUpdateTask, setWorkerProgressUpdateTask] = useState<Task | null>(null);
  const [isWorkerPhotoOpen, setIsWorkerPhotoOpen] = useState<boolean>(false);
  const [isWorkerMaterialOpen, setIsWorkerMaterialOpen] = useState<boolean>(false);
  const [isWorkerProblemOpen, setIsWorkerProblemOpen] = useState<boolean>(false);
  const [selectedIssueIdForNav, setSelectedIssueIdForNav] = useState<string | null>(null);

  // Helper getters
  const currentWorkerProject = projects.find((p) => p.id === workerSiteId) || projects[0];

  // Actions
  const handleToggleTaskCompletion = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.isCompleted;
          return {
            ...t,
            isCompleted: nextCompleted,
            status: nextCompleted ? 'Completed' : 'In Progress',
            progress: nextCompleted ? 100 : (t.progress ?? 50),
          };
        }
        return t;
      })
    );
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            isCompleted: newStatus === 'Completed',
            progress: newStatus === 'Completed' ? 100 : (newStatus === 'Not Started' ? 0 : (t.progress || 50)),
          };
        }
        return t;
      })
    );
  };

  const handleUpdateTaskProgress = (taskId: string, newProgress: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            progress: newProgress,
            isCompleted: newProgress >= 100,
            status: newProgress >= 100 ? 'Completed' : (newProgress === 0 ? 'Not Started' : 'In Progress'),
          };
        }
        return t;
      })
    );
  };

  const handleApproveMaterial = (id: string) => {
    setMaterialRequests((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'Approved' } : m))
    );
  };

  const handleRejectMaterial = (id: string) => {
    setMaterialRequests((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'Rejected' } : m))
    );
  };

  const handleResolveIssue = (issueId: string) => {
    handleToggleResolveIssue(issueId);
  };

  const handleToggleResolveIssue = (issueId: string) => {
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id === issueId) {
          const willResolve = i.status !== 'Resolved';
          const newStatus: IssueStatus = willResolve ? 'Resolved' : 'Open';
          const newComment: IssueComment = {
            id: `comm-${Date.now()}`,
            author: 'Archana Sengupta',
            authorRole: 'Studio Principal',
            text: willResolve
              ? 'Marked snag as Resolved after site check.'
              : 'Reopened snag for further inspection.',
            createdAt: 'Just now',
          };
          return {
            ...i,
            status: newStatus,
            actionTaken: willResolve
              ? 'Resolved by studio principal verification.'
              : i.actionTaken,
            comments: [...(i.comments || []), newComment],
          };
        }
        return i;
      })
    );
  };

  const handleAssignIssue = (issueId: string, assignedTo: string) => {
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id === issueId) {
          const newStatus: IssueStatus = i.status === 'Open' ? 'In Progress' : i.status;
          const newComment: IssueComment = {
            id: `comm-${Date.now()}`,
            author: 'Archana Sengupta',
            authorRole: 'Studio Principal',
            text: `Assigned snag to ${assignedTo}.`,
            createdAt: 'Just now',
          };
          return {
            ...i,
            assignedTo,
            status: newStatus,
            comments: [...(i.comments || []), newComment],
          };
        }
        return i;
      })
    );
  };

  const handleAddIssueComment = (issueId: string, text: string) => {
    const newComment: IssueComment = {
      id: `comm-${Date.now()}`,
      author: 'Archana Sengupta',
      authorRole: 'Studio Principal',
      text,
      createdAt: 'Just now',
    };
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId
          ? {
              ...i,
              comments: [...(i.comments || []), newComment],
            }
          : i
      )
    );
  };

  const handleChangeIssuePriority = (issueId: string, priority: IssuePriority) => {
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id === issueId) {
          const newComment: IssueComment = {
            id: `comm-${Date.now()}`,
            author: 'Archana Sengupta',
            authorRole: 'Studio Principal',
            text: `Changed priority from ${i.priority} to ${priority}.`,
            createdAt: 'Just now',
          };
          return {
            ...i,
            priority,
            severity: priority === 'Urgent' ? 'Critical' : priority === 'High' ? 'Medium' : 'Low',
            comments: [...(i.comments || []), newComment],
          };
        }
        return i;
      })
    );
  };

  const handleCreateTaskFromIssue = (issueId: string, taskData: Partial<Task>) => {
    const targetIssue = issues.find((i) => i.id === issueId);
    if (!targetIssue) return;

    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      projectId: targetIssue.projectId,
      projectName: targetIssue.projectName,
      title: taskData.title || `Fix: ${targetIssue.title}`,
      room: taskData.room || targetIssue.room || 'General Area',
      instructions:
        taskData.instructions ||
        `Fix snag reported by ${targetIssue.reportedBy}: ${targetIssue.description}`,
      deadline: taskData.dueDate || 'Tomorrow, 5:00 PM',
      currentProgress: 'Not Started',
      progress: 0,
      status: 'In Progress',
      isCompleted: false,
      referenceImages: targetIssue.imageUrl ? [targetIssue.imageUrl] : [],
      priority: taskData.priority || (targetIssue.priority === 'Urgent' ? 'High' : 'Medium'),
      category: taskData.category || 'Finishing',
      dueDate: taskData.dueDate || 'Tomorrow, 5:00 PM',
      assignedTo: taskData.assignedTo || targetIssue.assignedTo || 'Site Supervisor',
      notes: taskData.notes || `Created from snag #${targetIssue.id}`,
    };

    setTasks((prev) => [newTask, ...prev]);

    // Update issue state with linked task and in progress status
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id === issueId) {
          const comment: IssueComment = {
            id: `comm-${Date.now()}`,
            author: 'Archana Sengupta',
            authorRole: 'Studio Principal',
            text: `Escalated to active schedule task: "${newTask.title}" assigned to ${newTask.assignedTo}.`,
            createdAt: 'Just now',
          };
          return {
            ...i,
            status: 'In Progress',
            createdTaskId: newTaskId,
            comments: [...(i.comments || []), comment],
          };
        }
        return i;
      })
    );

    // Also record site update
    const newUpdate: SiteUpdate = {
      id: `up-${Date.now()}`,
      projectId: targetIssue.projectId,
      projectName: targetIssue.projectName,
      author: 'Archana Sengupta',
      authorRole: 'Studio Principal',
      timestamp: 'Just now',
      room: newTask.room,
      description: `Task created from snag: "${newTask.title}" for ${newTask.assignedTo}.`,
      type: 'Snag',
      tags: [newTask.category, 'Task Escalation'],
    };
    setUpdates((prev) => [newUpdate, ...prev]);
  };

  const handleUpdateProjectProgress = (projectId: string, newProgress: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const status = newProgress >= 100 ? 'Completed' : p.status;
          return { ...p, progress: newProgress, status };
        }
        return p;
      })
    );
  };

  const handleAddUpdate = (newUpdate: SiteUpdate) => {
    setUpdates((prev) => [newUpdate, ...prev]);
  };

  const handleAddMaterialRequest = (newRequest: MaterialRequest) => {
    setMaterialRequests((prev) => [newRequest, ...prev]);
  };

  const handleAddIssue = (newIssue: IssueReport) => {
    setIssues((prev) => [newIssue, ...prev]);
    const newUpdate: SiteUpdate = {
      id: `up-${Date.now()}`,
      projectId: newIssue.projectId,
      projectName: newIssue.projectName,
      author: newIssue.reportedBy,
      authorRole: 'Site Team',
      timestamp: 'Just now',
      room: newIssue.room || 'General Area',
      description: `[SNAG REPORTED]: ${newIssue.title} (${newIssue.category} • Priority: ${newIssue.priority}). ${newIssue.description}`,
      type: 'Snag',
      imageUrl: newIssue.imageUrl,
      tags: [newIssue.category, newIssue.priority, 'Snag'],
    };
    setUpdates((prev) => [newUpdate, ...prev]);
  };

  const handleAddProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleSaveWorkerProgressUpdate = (
    taskId: string,
    progressChoice: ProgressChoice,
    exactPercentage: number,
    photos: string[],
    note: string
  ) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const newStatus: TaskStatus =
      progressChoice === 'Completed' || exactPercentage >= 100
        ? 'Completed'
        : progressChoice === 'Not Started'
        ? 'Not Started'
        : 'In Progress';
    const isCompleted = newStatus === 'Completed';

    // 1. Update task in state
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            progress: exactPercentage,
            status: newStatus,
            isCompleted,
            photos: photos.length > 0 ? [...(t.photos || []), ...photos] : t.photos,
            notes: note ? (t.notes ? `${t.notes} • ${note}` : note) : t.notes,
          };
        }
        return t;
      })
    );

    // 2. Add SiteUpdate record
    const newUpdate: SiteUpdate = {
      id: `up-${Date.now()}`,
      projectId: targetTask.projectId,
      projectName: targetTask.projectName,
      author: currentWorkerProject?.siteManager || 'Site Worker Team',
      authorRole: 'Site Worker',
      timestamp: 'Just now',
      room: targetTask.room,
      description:
        note ||
        `Updated progress to ${exactPercentage}% (${progressChoice}) on ${targetTask.title}.`,
      type: 'Progress',
      imageUrl: photos[0] || undefined,
      progressPercentage: exactPercentage,
      tags: [targetTask.category, targetTask.room, progressChoice],
    };
    setUpdates((prev) => [newUpdate, ...prev]);

    // 3. Update project overall progress
    const projectTasks = tasks
      .map((t) => (t.id === taskId ? { ...t, progress: exactPercentage } : t))
      .filter((t) => t.projectId === targetTask.projectId);
    const avgProgress = Math.round(
      projectTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / (projectTasks.length || 1)
    );
    setProjects((prev) =>
      prev.map((p) =>
        p.id === targetTask.projectId ? { ...p, progress: Math.max(p.progress, avgProgress) } : p
      )
    );
  };

  // Tab navigation interceptors for center "Add" button
  const handleSelectOwnerTab = (tab: OwnerTab) => {
    if (tab === 'Add') {
      setIsAddMenuOpen(true);
    } else {
      setOwnerTab(tab);
    }
  };

  const handleSelectWorkerTab = (tab: WorkerTab) => {
    if (tab === 'Add Update') {
      setWorkerProgressUpdateTask(null);
      setIsWorkerProgressUpdateOpen(true);
    } else {
      setWorkerTab(tab);
    }
  };

  // Counts
  const pendingMaterialsCount = materialRequests.filter((m) => m.status === 'Pending').length;
  const pendingTasksCount = tasks.filter((t) => t.projectId === workerSiteId && !t.isCompleted).length;

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1E2022] font-['Plus_Jakarta_Sans'] antialiased flex flex-col selection:bg-amber-200 selection:text-zinc-900">
      {/* 1. Development Mode Role Switcher Bar */}
      <DevRoleSwitcher
        currentRole={role}
        onRoleChange={setRole}
        workerSiteId={workerSiteId}
        onWorkerSiteChange={setWorkerSiteId}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame((prev) => !prev)}
      />

      {/* Frame wrapper: either fluid or mobile mockup frame */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[420px] mx-auto w-full my-4 rounded-3xl shadow-2xl border-8 border-[#2D2D2D] bg-[#F9F8F6] overflow-hidden min-h-[820px]'
            : 'w-full bg-[#F9F8F6]'
        }`}
      >
        {/* Header */}
        <Header
          currentRole={role}
          workerProjectName={currentWorkerProject?.name}
          unreadCount={pendingMaterialsCount > 0 ? 3 : 0}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenActionMenu={() => setIsAddMenuOpen(true)}
        />

        {/* Main Body View Container */}
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-4 pb-20">
          {role === 'OWNER' ? (
            /* OWNER ROLE VIEWS */
            <>
              {ownerTab === 'Home' && (
                <OwnerHome
                  projects={projects}
                  materialRequests={materialRequests}
                  issues={issues}
                  updates={updates}
                  onSelectProject={(p) => setSelectedProjectForModal(p)}
                  onNavigateToMaterials={() => setOwnerTab('Materials')}
                  onNavigateToProjects={() => setOwnerTab('Projects')}
                  onNavigateToIssues={(issueId?: string) => {
                    setSelectedIssueIdForNav(issueId || null);
                    setOwnerTab('Issues');
                  }}
                  onQuickApproveMaterial={handleApproveMaterial}
                />
              )}

              {ownerTab === 'Projects' && (
                <ProjectsView
                  projects={projects}
                  onSelectProject={(p) => setSelectedProjectForModal(p)}
                  onOpenAddProjectModal={() => setActionModalType('project')}
                />
              )}

              {ownerTab === 'Issues' && (
                <OwnerIssuesScreen
                  issues={issues}
                  projects={projects}
                  tasks={tasks}
                  onAssignIssue={handleAssignIssue}
                  onAddComment={handleAddIssueComment}
                  onChangePriority={handleChangeIssuePriority}
                  onCreateTaskFromIssue={handleCreateTaskFromIssue}
                  onToggleResolveIssue={handleToggleResolveIssue}
                  onOpenReportIssueModal={() => setActionModalType('issue')}
                  initialSelectedIssueId={selectedIssueIdForNav}
                />
              )}

              {ownerTab === 'Materials' && (
                <MaterialsView
                  requests={materialRequests}
                  onApprove={handleApproveMaterial}
                  onReject={handleRejectMaterial}
                  onOpenNewRequestModal={() => setActionModalType('material')}
                  isOwnerRole={true}
                />
              )}

              {ownerTab === 'More' && (
                <MoreView
                  issues={issues}
                  projects={projects}
                  onResolveIssue={handleResolveIssue}
                  onSelectProject={(p) => setSelectedProjectForModal(p)}
                  onOpenReportIssueModal={() => setActionModalType('issue')}
                />
              )}
            </>
          ) : (
            /* WORKER ROLE VIEWS */
            <>
              {workerTab === 'Home' && (
                <WorkerHome
                  currentProject={currentWorkerProject}
                  allProjects={projects}
                  onSelectCurrentProject={(id) => setWorkerSiteId(id)}
                  tasks={tasks}
                  onToggleTaskCompletion={handleToggleTaskCompletion}
                  onOpenTaskDetail={(task) => setWorkerSelectedTask(task)}
                  onOpenUpdateProgress={(task) => {
                    setWorkerProgressUpdateTask(task || null);
                    setIsWorkerProgressUpdateOpen(true);
                  }}
                  onOpenPhotoUpload={() => setIsWorkerPhotoOpen(true)}
                  onOpenMaterialRequest={() => setIsWorkerMaterialOpen(true)}
                  onOpenReportProblem={() => setIsWorkerProblemOpen(true)}
                  onViewAllTasks={() => setWorkerTab('Tasks')}
                />
              )}

              {workerTab === 'Tasks' && (
                <TasksView
                  tasks={tasks}
                  projects={projects}
                  onToggleTask={handleToggleTaskCompletion}
                  onOpenAddTaskModal={() => setActionModalType('task')}
                  onOpenTaskDetail={(task) => setWorkerSelectedTask(task)}
                  currentProjectId={workerSiteId}
                />
              )}

              {workerTab === 'Updates' && (
                <UpdatesFeedView
                  updates={updates}
                  projects={projects}
                  onOpenAddUpdate={() => setActionModalType('progress')}
                  currentProjectId={workerSiteId}
                />
              )}

              {workerTab === 'Profile' && (
                <ProfileView
                  assignedProjects={projects.filter((p) => p.siteManager.includes('Ramesh') || p.id === workerSiteId)}
                  onSelectProject={(p) => setSelectedProjectForModal(p)}
                  supervisorName={currentWorkerProject.siteManager}
                />
              )}
            </>
          )}
        </main>

        {/* Bottom Navigation */}
        <div className="sticky bottom-0 z-40">
          <BottomNav
            currentRole={role}
            ownerTab={ownerTab}
            onSelectOwnerTab={handleSelectOwnerTab}
            workerTab={workerTab}
            onSelectWorkerTab={handleSelectWorkerTab}
            pendingMaterialsCount={pendingMaterialsCount}
            pendingTasksCount={pendingTasksCount}
            openIssuesCount={issues.filter((i) => i.status === 'Open').length}
          />
        </div>
      </div>

      {/* Global Modals */}
      <ProjectDetailModal
        project={selectedProjectForModal}
        onClose={() => setSelectedProjectForModal(null)}
        tasks={tasks}
        materialRequests={materialRequests}
        issues={issues}
        updates={updates}
        files={files}
        onToggleTask={handleToggleTaskCompletion}
        onUpdateTaskStatus={handleUpdateTaskStatus}
        onUpdateTaskProgress={handleUpdateTaskProgress}
        onApproveMaterial={handleApproveMaterial}
        onResolveIssue={handleResolveIssue}
        onOpenActionModal={(t) => {
          setSelectedProjectForModal(null);
          setActionModalType(t);
        }}
      />

      <ActionModal
        isOpen={actionModalType !== null}
        type={actionModalType}
        onClose={() => setActionModalType(null)}
        projects={projects}
        activeProjectId={role === 'WORKER' ? workerSiteId : undefined}
        onAddUpdate={handleAddUpdate}
        onAddMaterialRequest={handleAddMaterialRequest}
        onAddIssue={handleAddIssue}
        onAddProject={handleAddProject}
        onAddTask={handleAddTask}
        onUpdateProjectProgress={handleUpdateProjectProgress}
        currentRole={role}
      />

      <AddMenuModal
        isOpen={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        currentRole={role}
        onSelectAction={(t) => {
          setIsAddMenuOpen(false);
          setActionModalType(t);
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateToMaterials={() => {
          setRole('OWNER');
          setOwnerTab('Materials');
        }}
        onNavigateToIssues={() => {
          setRole('OWNER');
          setOwnerTab('Issues');
        }}
      />

      {/* Dedicated Worker Modals */}
      <WorkerTaskDetailModal
        task={workerSelectedTask}
        onClose={() => setWorkerSelectedTask(null)}
        onOpenProgressUpdate={(task) => {
          setWorkerSelectedTask(null);
          setWorkerProgressUpdateTask(task);
          setIsWorkerProgressUpdateOpen(true);
        }}
        onToggleComplete={handleToggleTaskCompletion}
      />

      <WorkerProgressUpdateModal
        isOpen={isWorkerProgressUpdateOpen}
        onClose={() => {
          setIsWorkerProgressUpdateOpen(false);
          setWorkerProgressUpdateTask(null);
        }}
        project={currentWorkerProject}
        projects={projects}
        currentProjectId={currentWorkerProject?.id || workerSiteId}
        tasks={tasks.filter((t) => t.projectId === currentWorkerProject?.id)}
        initialTask={workerProgressUpdateTask}
        initialTaskId={workerProgressUpdateTask?.id}
        onSaveProgress={handleSaveWorkerProgressUpdate}
        onSaveUpdate={handleSaveWorkerProgressUpdate}
      />

      <WorkerPhotoUploadModal
        isOpen={isWorkerPhotoOpen}
        onClose={() => setIsWorkerPhotoOpen(false)}
        project={currentWorkerProject}
        onAddUpdate={handleAddUpdate}
      />

      <WorkerMaterialRequestModal
        isOpen={isWorkerMaterialOpen}
        onClose={() => setIsWorkerMaterialOpen(false)}
        project={currentWorkerProject}
        onAddMaterialRequest={handleAddMaterialRequest}
      />

      <WorkerReportProblemModal
        isOpen={isWorkerProblemOpen}
        onClose={() => setIsWorkerProblemOpen(false)}
        project={currentWorkerProject}
        tasks={tasks.filter((t) => t.projectId === currentWorkerProject.id)}
        onAddIssue={handleAddIssue}
      />
    </div>
  );
}
