import React, { useState, useEffect } from 'react';
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
import { subscribeToCollection, updateDocument, addDocument, seedInitialData } from './lib/dataService';
import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MATERIAL_REQUESTS,
  INITIAL_ISSUES,
  INITIAL_UPDATES,
  INITIAL_FILES,
} from './mockData';

export default function App() {
  const [role, setRole] = useState<UserRole>('OWNER');

  const [ownerTab, setOwnerTab] = useState<OwnerTab>('Home');
  const [workerTab, setWorkerTab] = useState<WorkerTab>('Home');
  const [workerSiteId, setWorkerSiteId] = useState<string>('proj-1');

  // Core Data State - preloaded with rich realistic data for testing
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
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  const targetOwnerId = 'demo-owner-ready-to-use';

  useEffect(() => {
    // Background seed to ensure documents exist in Firestore
    seedInitialData(targetOwnerId);

    // Live subscriptions with instant fallback so user never sees a blank screen
    const unsubProjects = subscribeToCollection<Project>('projects', targetOwnerId, setProjects, INITIAL_PROJECTS);
    const unsubTasks = subscribeToCollection<Task>('tasks', targetOwnerId, setTasks, INITIAL_TASKS);
    const unsubMaterials = subscribeToCollection<MaterialRequest>('materialRequests', targetOwnerId, setMaterialRequests, INITIAL_MATERIAL_REQUESTS);
    const unsubIssues = subscribeToCollection<IssueReport>('issueReports', targetOwnerId, setIssues, INITIAL_ISSUES);
    const unsubUpdates = subscribeToCollection<SiteUpdate>('siteUpdates', targetOwnerId, setUpdates, INITIAL_UPDATES);
    const unsubFiles = subscribeToCollection<ProjectFile>('projectFiles', targetOwnerId, setFiles, INITIAL_FILES);

    return () => {
      unsubProjects();
      unsubTasks();
      unsubMaterials();
      unsubIssues();
      unsubUpdates();
      unsubFiles();
    };
  }, []);

  const currentWorkerProject = projects.find((p) => p.id === workerSiteId) || projects[0];

  // Actions with immediate local state responsiveness + background Firestore persistence
  const handleToggleTaskCompletion = async (taskId: string) => {
    const t = tasks.find(x => x.id === taskId);
    if (!t) return;
    const nextCompleted = !t.isCompleted;
    const nextProgress = nextCompleted ? 100 : (t.progress ?? 50);
    const nextStatus: TaskStatus = nextCompleted ? 'Completed' : 'In Progress';

    setTasks(prev => prev.map(item => item.id === taskId ? {
      ...item,
      isCompleted: nextCompleted,
      status: nextStatus,
      progress: nextProgress,
    } : item));

    await updateDocument('tasks', taskId, {
      isCompleted: nextCompleted,
      status: nextStatus,
      progress: nextProgress,
    });
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const t = tasks.find(x => x.id === taskId);
    if (!t) return;
    const isCompleted = newStatus === 'Completed';
    const progress = isCompleted ? 100 : (newStatus === 'Not Started' ? 0 : (t.progress || 50));

    setTasks(prev => prev.map(item => item.id === taskId ? {
      ...item,
      status: newStatus,
      isCompleted,
      progress,
    } : item));

    await updateDocument('tasks', taskId, {
      status: newStatus,
      isCompleted,
      progress,
    });
  };

  const handleUpdateTaskProgress = async (taskId: string, newProgress: number) => {
    const isCompleted = newProgress >= 100;
    const status: TaskStatus = isCompleted ? 'Completed' : (newProgress === 0 ? 'Not Started' : 'In Progress');

    setTasks(prev => prev.map(item => item.id === taskId ? {
      ...item,
      progress: newProgress,
      isCompleted,
      status,
    } : item));

    await updateDocument('tasks', taskId, {
      progress: newProgress,
      isCompleted,
      status,
    });
  };

  const handleApproveMaterial = async (id: string) => {
    setMaterialRequests(prev => prev.map(m => m.id === id ? { ...m, status: 'Approved' } : m));
    await updateDocument('materialRequests', id, { status: 'Approved' });
  };

  const handleRejectMaterial = async (id: string) => {
    setMaterialRequests(prev => prev.map(m => m.id === id ? { ...m, status: 'Rejected' } : m));
    await updateDocument('materialRequests', id, { status: 'Rejected' });
  };

  const handleResolveIssue = async (issueId: string) => {
    handleToggleResolveIssue(issueId);
  };

  const handleToggleResolveIssue = async (issueId: string) => {
    const i = issues.find(x => x.id === issueId);
    if (!i) return;
    const willResolve = i.status !== 'Resolved';
    const newStatus: IssueStatus = willResolve ? 'Resolved' : 'Open';
    const newComment: IssueComment = {
      id: `comm-${Date.now()}`,
      author: 'Om Patel',
      authorRole: role,
      text: willResolve ? 'Marked snag as Resolved.' : 'Reopened snag.',
      createdAt: 'Just now',
    };
    const updatedComments = [...(i.comments || []), newComment];
    const updatedAction = willResolve ? 'Resolved by verification.' : i.actionTaken;

    setIssues(prev => prev.map(item => item.id === issueId ? {
      ...item,
      status: newStatus,
      actionTaken: updatedAction,
      comments: updatedComments,
    } : item));

    await updateDocument('issueReports', issueId, {
      status: newStatus,
      actionTaken: updatedAction,
      comments: updatedComments,
    });
  };

  const handleAssignIssue = async (issueId: string, assignedTo: string) => {
    const i = issues.find(x => x.id === issueId);
    if (!i) return;
    const newStatus: IssueStatus = i.status === 'Open' ? 'In Progress' : i.status;
    const newComment: IssueComment = {
      id: `comm-${Date.now()}`,
      author: 'Om Patel',
      authorRole: role,
      text: `Assigned snag to ${assignedTo}.`,
      createdAt: 'Just now',
    };
    const updatedComments = [...(i.comments || []), newComment];

    setIssues(prev => prev.map(item => item.id === issueId ? {
      ...item,
      assignedTo,
      status: newStatus,
      comments: updatedComments,
    } : item));

    await updateDocument('issueReports', issueId, {
      assignedTo,
      status: newStatus,
      comments: updatedComments,
    });
  };

  const handleAddIssueComment = async (issueId: string, text: string) => {
    const i = issues.find(x => x.id === issueId);
    if (!i) return;
    const newComment: IssueComment = {
      id: `comm-${Date.now()}`,
      author: 'Om Patel',
      authorRole: role,
      text,
      createdAt: 'Just now',
    };
    const updatedComments = [...(i.comments || []), newComment];

    setIssues(prev => prev.map(item => item.id === issueId ? {
      ...item,
      comments: updatedComments,
    } : item));

    await updateDocument('issueReports', issueId, {
      comments: updatedComments,
    });
  };

  const handleChangeIssuePriority = async (issueId: string, priority: IssuePriority) => {
    const i = issues.find(x => x.id === issueId);
    if (!i) return;
    const newComment: IssueComment = {
      id: `comm-${Date.now()}`,
      author: 'Om Patel',
      authorRole: role,
      text: `Changed priority from ${i.priority} to ${priority}.`,
      createdAt: 'Just now',
    };
    const updatedComments = [...(i.comments || []), newComment];
    const severity = priority === 'Urgent' ? 'Critical' : priority === 'High' ? 'Medium' : 'Low';

    setIssues(prev => prev.map(item => item.id === issueId ? {
      ...item,
      priority,
      severity,
      comments: updatedComments,
    } : item));

    await updateDocument('issueReports', issueId, {
      priority,
      severity,
      comments: updatedComments,
    });
  };

  const handleCreateTaskFromIssue = async (issueId: string, taskData: Partial<Task>) => {
    const targetIssue = issues.find((i) => i.id === issueId);
    if (!targetIssue) return;

    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      ownerId: targetOwnerId,
      projectId: targetIssue.projectId,
      projectName: targetIssue.projectName,
      title: taskData.title || `Fix: ${targetIssue.title}`,
      room: targetIssue.room || 'General',
      assignedTo: taskData.assignedTo || 'Unassigned',
      dueDate: taskData.dueDate || 'ASAP',
      priority: taskData.priority || 'Medium',
      isCompleted: false,
      progress: 0,
      status: 'Not Started',
      category: 'Other',
      notes: taskData.notes || '',
    };
    setTasks(prev => [newTask, ...prev]);
    await addDocument('tasks', newTaskId, newTask);

    const newUpdate: SiteUpdate = {
      id: `up-${Date.now()}`,
      ownerId: targetOwnerId,
      projectId: newTask.projectId,
      projectName: newTask.projectName,
      author: 'Om Patel',
      authorRole: role,
      timestamp: 'Just now',
      room: newTask.room,
      description: `Task created from snag: "${newTask.title}" for ${newTask.assignedTo}.`,
      type: 'Snag',
      tags: [newTask.category, 'Task Escalation'],
    };
    setUpdates(prev => [newUpdate, ...prev]);
    await addDocument('siteUpdates', newUpdate.id, newUpdate);
  };

  const handleUpdateProjectProgress = async (projectId: string, newProgress: number) => {
    const p = projects.find(x => x.id === projectId);
    if (!p) return;
    const status = newProgress >= 100 ? 'Completed' : p.status;
    setProjects(prev => prev.map(item => item.id === projectId ? { ...item, progress: newProgress, status } : item));
    await updateDocument('projects', projectId, { progress: newProgress, status });
  };

  const handleAddUpdate = async (newUpdate: SiteUpdate) => {
    const full = { ...newUpdate, ownerId: targetOwnerId };
    setUpdates(prev => [full, ...prev]);
    await addDocument('siteUpdates', full.id, full);
  };

  const handleAddMaterialRequest = async (newRequest: MaterialRequest) => {
    const full = { ...newRequest, ownerId: targetOwnerId };
    setMaterialRequests(prev => [full, ...prev]);
    await addDocument('materialRequests', full.id, full);
  };

  const handleAddIssue = async (newIssue: IssueReport) => {
    const full = { ...newIssue, ownerId: targetOwnerId };
    setIssues(prev => [full, ...prev]);
    await addDocument('issueReports', full.id, full);

    const newUpdate: SiteUpdate = {
      id: `up-${Date.now()}`,
      ownerId: targetOwnerId,
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
    setUpdates(prev => [newUpdate, ...prev]);
    await addDocument('siteUpdates', newUpdate.id, newUpdate);
  };

  const handleAddProject = async (newProject: Project) => {
    const full = { ...newProject, ownerId: targetOwnerId };
    setProjects(prev => [full, ...prev]);
    await addDocument('projects', full.id, full);
  };

  const handleAddTask = async (newTask: Task) => {
    const full = { ...newTask, ownerId: targetOwnerId };
    setTasks(prev => [full, ...prev]);
    await addDocument('tasks', full.id, full);
  };

  const handleSaveWorkerProgressUpdate = async (
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

    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      progress: exactPercentage,
      status: newStatus,
      isCompleted,
      photos: photos.length > 0 ? [...(t.photos || []), ...photos] : t.photos,
      notes: note ? (t.notes ? `${t.notes} • ${note}` : note) : t.notes,
    } : t));

    await updateDocument('tasks', taskId, {
      progress: exactPercentage,
      status: newStatus,
      isCompleted,
      photos: photos.length > 0 ? [...(targetTask.photos || []), ...photos] : targetTask.photos,
      notes: note ? (targetTask.notes ? `${targetTask.notes} • ${note}` : note) : targetTask.notes,
    });

    const newUpdate: SiteUpdate = {
      id: `up-${Date.now()}`,
      ownerId: targetOwnerId,
      projectId: targetTask.projectId,
      projectName: targetTask.projectName,
      author: 'Site Team',
      authorRole: 'Site Worker',
      timestamp: 'Just now',
      room: targetTask.room,
      description: note || `Updated progress to ${exactPercentage}% (${progressChoice}) on ${targetTask.title}.`,
      type: 'Progress',
      imageUrl: photos[0] || undefined,
      progressPercentage: exactPercentage,
      tags: [targetTask.category, targetTask.room, progressChoice],
    };
    setUpdates(prev => [newUpdate, ...prev]);
    await addDocument('siteUpdates', newUpdate.id, newUpdate);

    const projectTasks = tasks
      .map((t) => (t.id === taskId ? { ...t, progress: exactPercentage } : t))
      .filter((t) => t.projectId === targetTask.projectId);
    const avgProgress = Math.round(
      projectTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / (projectTasks.length || 1)
    );
    const p = projects.find(x => x.id === targetTask.projectId);
    if (p && avgProgress > p.progress) {
      setProjects(prev => prev.map(item => item.id === p.id ? { ...item, progress: avgProgress } : item));
      await updateDocument('projects', p.id, { progress: avgProgress });
    }
  };

  const handleSelectOwnerTab = (tab: OwnerTab) => {
    if (tab === 'Add') setIsAddMenuOpen(true);
    else setOwnerTab(tab);
  };

  const handleSelectWorkerTab = (tab: WorkerTab) => {
    if (tab === 'Add Update') {
      setWorkerProgressUpdateTask(null);
      setIsWorkerProgressUpdateOpen(true);
    } else {
      setWorkerTab(tab);
    }
  };

  const pendingMaterialsCount = materialRequests.filter((m) => m.status === 'Pending').length;
  const pendingTasksCount = tasks.filter((t) => t.projectId === workerSiteId && !t.isCompleted).length;

  return (
    <div className={`min-h-screen ${isMobileFrame ? 'bg-[#1A1A1A]' : 'bg-[#F5F4F0]'} flex flex-col antialiased transition-all selection:bg-amber-200 selection:text-zinc-900`}>
      <DevRoleSwitcher
        currentRole={role}
        onRoleChange={setRole}
        workerSiteId={workerSiteId}
        onWorkerSiteChange={setWorkerSiteId}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      <div className={isMobileFrame ? 'flex-1 flex items-center justify-center p-3 sm:p-5' : 'flex-1 flex flex-col'}>
        <div className={isMobileFrame ? 'w-full max-w-[410px] h-[840px] max-h-[92vh] bg-[#F5F4F0] rounded-[2.5rem] shadow-2xl overflow-hidden border-[8px] border-zinc-800 relative flex flex-col' : 'w-full flex-1 flex flex-col bg-[#F5F4F0] relative'}>
          {isMobileFrame && <div className="absolute top-0 inset-x-0 h-5 bg-zinc-800 rounded-b-2xl w-36 mx-auto z-50 pointer-events-none"></div>}

          <Header
            currentRole={role}
            workerProjectName={currentWorkerProject?.name}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />

      <div className="flex-1 overflow-y-auto pb-20 relative">
        <main className="max-w-md mx-auto w-full min-h-full">
          {role === 'OWNER' ? (
            <>
              {ownerTab === 'Home' && (
                <OwnerHome
                  projects={projects}
                  updates={updates}
                  issues={issues}
                  materialRequests={materialRequests}
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
                  assignedProjects={projects.filter((p) => p.siteManager.length > 0 || p.id === workerSiteId)}
                  onSelectProject={(p) => setSelectedProjectForModal(p)}
                  supervisorName={currentWorkerProject?.siteManager || 'Supervisor'}
                />
              )}
            </>
          )}
        </main>

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

      <WorkerTaskDetailModal
        task={workerSelectedTask}
        isOpen={workerSelectedTask !== null}
        onClose={() => setWorkerSelectedTask(null)}
        onOpenUpdateProgress={(task) => {
          setWorkerSelectedTask(null);
          setWorkerProgressUpdateTask(task);
          setIsWorkerProgressUpdateOpen(true);
        }}
        onToggleTaskCompletion={handleToggleTaskCompletion}
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
          tasks={tasks.filter((t) => t.projectId === currentWorkerProject?.id)}
          onAddIssue={handleAddIssue}
        />
        </div>
      </div>
    </div>
  );
}
