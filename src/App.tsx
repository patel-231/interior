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
import { Login } from './components/Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { subscribeToCollection, updateDocument, addDocument, seedInitialData } from './lib/dataService';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [role, setRole] = useState<UserRole>('OWNER');

  const [ownerTab, setOwnerTab] = useState<OwnerTab>('Home');
  const [workerTab, setWorkerTab] = useState<WorkerTab>('Home');
  const [workerSiteId, setWorkerSiteId] = useState<string>('proj-1');

  // Core Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>([]);
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [updates, setUpdates] = useState<SiteUpdate[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);

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
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(userData);
            setRole(userData.role);
          } else {
            setUser(null); // Or trigger a login refresh
          }
        } catch (e) {
          console.error("Error fetching user profile", e);
        }
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const orgId = user.organizationId;
    
    const unsubProjects = subscribeToCollection('projects', orgId, setProjects);
    const unsubTasks = subscribeToCollection('tasks', orgId, setTasks);
    const unsubMaterials = subscribeToCollection('material_requests', orgId, setMaterialRequests);
    const unsubIssues = subscribeToCollection('issues', orgId, setIssues);
    const unsubUpdates = subscribeToCollection('progress_updates', orgId, setUpdates);
    
    return () => {
      unsubProjects();
      unsubTasks();
      unsubMaterials();
      unsubIssues();
      unsubUpdates();
    };
  }, [user]);
  

  const currentWorkerProject = projects.find((p) => p.id === workerSiteId) || projects[0];

  if (loadingAuth) {
    return <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Login onLoginSuccess={(u) => {
      setUser(u);
      setRole(u.role);
    }} />;
  }

  // Actions
  const handleToggleTaskCompletion = async (taskId: string) => {
    const t = tasks.find(x => x.id === taskId);
    if(!t) return;
    const nextCompleted = !t.isCompleted;
    await updateDocument('tasks', taskId, {
      isCompleted: nextCompleted,
      status: nextCompleted ? 'Completed' : 'In Progress',
      progress: nextCompleted ? 100 : (t.progress ?? 50),
    });
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const t = tasks.find(x => x.id === taskId);
    if(!t) return;
    await updateDocument('tasks', taskId, {
      status: newStatus,
      isCompleted: newStatus === 'Completed',
      progress: newStatus === 'Completed' ? 100 : (newStatus === 'Not Started' ? 0 : (t.progress || 50)),
    });
  };

  const handleUpdateTaskProgress = async (taskId: string, newProgress: number) => {
    await updateDocument('tasks', taskId, {
      progress: newProgress,
      isCompleted: newProgress >= 100,
      status: newProgress >= 100 ? 'Completed' : (newProgress === 0 ? 'Not Started' : 'In Progress'),
    });
  };

  const handleApproveMaterial = async (id: string) => {
    await updateDocument('materialRequests', id, { status: 'Approved' });
  };

  const handleRejectMaterial = async (id: string) => {
    await updateDocument('materialRequests', id, { status: 'Rejected' });
  };

  const handleResolveIssue = async (issueId: string) => {
    handleToggleResolveIssue(issueId);
  };

  const handleToggleResolveIssue = async (issueId: string) => {
    const i = issues.find(x => x.id === issueId);
    if(!i) return;
    const willResolve = i.status !== 'Resolved';
    const newStatus: IssueStatus = willResolve ? 'Resolved' : 'Open';
    const newComment: IssueComment = {
      id: `comm-${Date.now()}`,
      author: 'Demo User',
      authorRole: role,
      text: willResolve ? 'Marked snag as Resolved.' : 'Reopened snag.',
      createdAt: 'Just now',
    };
    await updateDocument('issueReports', issueId, {
      status: newStatus,
      actionTaken: willResolve ? 'Resolved by verification.' : i.actionTaken,
      comments: [...(i.comments || []), newComment],
    });
  };

  const handleAssignIssue = async (issueId: string, assignedTo: string) => {
    const i = issues.find(x => x.id === issueId);
    if(!i) return;
    const newStatus: IssueStatus = i.status === 'Open' ? 'In Progress' : i.status;
    const newComment: IssueComment = {
      id: `comm-${Date.now()}`,
      author: 'Demo User',
      authorRole: role,
      text: `Assigned snag to ${assignedTo}.`,
      createdAt: 'Just now',
    };
    await updateDocument('issueReports', issueId, {
      assignedTo,
      status: newStatus,
      comments: [...(i.comments || []), newComment],
    });
  };

  const handleAddIssueComment = async (issueId: string, text: string) => {
    const i = issues.find(x => x.id === issueId);
    if(!i) return;
    const newComment: IssueComment = {
      id: `comm-${Date.now()}`,
      author: 'Demo User',
      authorRole: role,
      text,
      createdAt: 'Just now',
    };
    await updateDocument('issueReports', issueId, {
      comments: [...(i.comments || []), newComment],
    });
  };

  const handleChangeIssuePriority = async (issueId: string, priority: IssuePriority) => {
    const i = issues.find(x => x.id === issueId);
    if(!i) return;
    const newComment: IssueComment = {
      id: `comm-${Date.now()}`,
      author: 'Demo User',
      authorRole: role,
      text: `Changed priority from ${i.priority} to ${priority}.`,
      createdAt: 'Just now',
    };
    await updateDocument('issueReports', issueId, {
      priority,
      severity: priority === 'Urgent' ? 'Critical' : priority === 'High' ? 'Medium' : 'Low',
      comments: [...(i.comments || []), newComment],
    });
  };

  const handleCreateTaskFromIssue = async (issueId: string, taskData: Partial<Task>) => {
    const targetIssue = issues.find((i) => i.id === issueId);
    if (!targetIssue) return;

    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      ownerId: user?.organizationId || '',
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
    await addDocument('tasks', newTaskId, newTask);

    const newUpdate: SiteUpdate = {
      id: `up-${Date.now()}`,
      ownerId: user?.organizationId || '',
      projectId: newTask.projectId,
      projectName: newTask.projectName,
      author: 'Demo User',
      authorRole: role,
      timestamp: 'Just now',
      room: newTask.room,
      description: `Task created from snag: "${newTask.title}" for ${newTask.assignedTo}.`,
      type: 'Snag',
      tags: [newTask.category, 'Task Escalation'],
    };
    await addDocument('siteUpdates', newUpdate.id, newUpdate);
  };

  const handleUpdateProjectProgress = async (projectId: string, newProgress: number) => {
    const p = projects.find(x => x.id === projectId);
    if(!p) return;
    const status = newProgress >= 100 ? 'Completed' : p.status;
    await updateDocument('projects', projectId, { progress: newProgress, status });
  };

  const handleAddUpdate = async (newUpdate: SiteUpdate) => {
    await addDocument('siteUpdates', newUpdate.id, { ...newUpdate, ownerId: user?.organizationId || '' });
  };

  const handleAddMaterialRequest = async (newRequest: MaterialRequest) => {
    await addDocument('materialRequests', newRequest.id, { ...newRequest, ownerId: user?.organizationId || '' });
  };

  const handleAddIssue = async (newIssue: IssueReport) => {
    await addDocument('issueReports', newIssue.id, { ...newIssue, ownerId: user?.organizationId || '' });
    const newUpdate: SiteUpdate = {
      id: `up-${Date.now()}`,
      ownerId: user?.organizationId || '',
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
    await addDocument('siteUpdates', newUpdate.id, newUpdate);
  };

  const handleAddProject = async (newProject: Project) => {
    await addDocument('projects', newProject.id, { ...newProject, ownerId: user?.organizationId || '' });
  };

  const handleAddTask = async (newTask: Task) => {
    await addDocument('tasks', newTask.id, { ...newTask, ownerId: user?.organizationId || '' });
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

    await updateDocument('tasks', taskId, {
      progress: exactPercentage,
      status: newStatus,
      isCompleted,
      photos: photos.length > 0 ? [...(targetTask.photos || []), ...photos] : targetTask.photos,
      notes: note ? (targetTask.notes ? `${targetTask.notes} • ${note}` : note) : targetTask.notes,
    });

    const newUpdate: SiteUpdate = {
      id: `up-${Date.now()}`,
      ownerId: user?.organizationId || '',
      projectId: targetTask.projectId,
      projectName: targetTask.projectName,
      author: 'Demo Worker',
      authorRole: 'Site Worker',
      timestamp: 'Just now',
      room: targetTask.room,
      description: note || `Updated progress to ${exactPercentage}% (${progressChoice}) on ${targetTask.title}.`,
      type: 'Progress',
      imageUrl: photos[0] || undefined,
      progressPercentage: exactPercentage,
      tags: [targetTask.category, targetTask.room, progressChoice],
    };
    await addDocument('siteUpdates', newUpdate.id, newUpdate);

    // Simple avg project progress (Note: fetching all tasks fresh from local state is fine)
    const projectTasks = tasks
      .map((t) => (t.id === taskId ? { ...t, progress: exactPercentage } : t))
      .filter((t) => t.projectId === targetTask.projectId);
    const avgProgress = Math.round(
      projectTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / (projectTasks.length || 1)
    );
    const p = projects.find(x => x.id === targetTask.projectId);
    if (p && avgProgress > p.progress) {
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
    <div className={`min-h-screen ${isMobileFrame ? 'bg-stone-900 flex items-center justify-center p-4' : 'bg-[#F5F4F0]'} antialiased transition-all selection:bg-amber-200 selection:text-zinc-900`}>
      <div className={isMobileFrame ? 'w-[400px] h-[800px] bg-[#F5F4F0] rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-zinc-800 relative flex flex-col' : 'w-full h-screen flex flex-col bg-[#F5F4F0] relative'}>
        {isMobileFrame && <div className="absolute top-0 inset-x-0 h-6 bg-zinc-800 rounded-b-3xl w-40 mx-auto z-50 pointer-events-none"></div>}
        
        
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
  );
}
