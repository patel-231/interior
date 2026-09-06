export type UserRole = 'OWNER' | 'WORKER';

export type SiteStatus = 'On Track' | 'Delayed' | 'Critical' | 'Completed';

export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'In Review';

export type IssueCategory =
  | 'Material'
  | 'Electrical'
  | 'Carpentry'
  | 'Civil'
  | 'Plumbing'
  | 'Design'
  | 'Client'
  | 'Safety'
  | 'Other';

export type IssuePriority = 'Low' | 'Normal' | 'High' | 'Urgent';

export interface IssueComment {
  id: string;
  author: string;
  authorRole: string;
  text: string;
  createdAt: string;
}

export type MaterialRequestStatus = 'Pending' | 'Approved' | 'Ordered' | 'Delivered' | 'Rejected';

export type TaskCategory =
  | 'Civil'
  | 'Electrical'
  | 'Plumbing'
  | 'Ceiling'
  | 'Carpentry'
  | 'Painting'
  | 'Furniture'
  | 'Finishing';

export type TaskStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Waiting'
  | 'Review'
  | 'Completed';

export interface Task {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  room: string;
  assignedTo: string; // assigned worker
  dueDate: string; // deadline alias for backwards compatibility
  startDate?: string;
  deadline?: string;
  currentProgress?: string;
  priority: 'Low' | 'Medium' | 'High';
  isCompleted: boolean;
  progress?: number;
  status?: TaskStatus;
  photos?: string[];
  notes?: string;
  category: TaskCategory;
  instructions?: string;
  referenceImages?: string[];
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  category: 'Drawings & CAD' | 'MEP & HVAC' | 'Joinery & Millwork' | 'Finishes & BOQ' | '3D Renders';
  fileType: 'PDF' | 'DWG' | 'XLSX' | 'ZIP' | 'JPG';
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  url?: string;
}

export interface MaterialRequest {
  id: string;
  projectId: string;
  projectName: string;
  itemName: string;
  quantity: string;
  category: string;
  requestedBy: string;
  requestedDate: string;
  urgency: UrgencyLevel;
  status: MaterialRequestStatus;
  specs?: string;
  vendor?: string;
  estimatedCost?: string;
}

export interface IssueReport {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  room?: string;
  relatedTaskId?: string;
  relatedTaskTitle?: string;
  reportedBy: string;
  reportedAt: string;
  severity?: 'Low' | 'Medium' | 'Critical';
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: 'photo' | 'video';
  assignedTo?: string; // person responsible if known / assigned by owner
  actionTaken?: string;
  comments?: IssueComment[];
  createdTaskId?: string;
}

export interface SiteUpdate {
  id: string;
  projectId: string;
  projectName: string;
  author: string;
  authorRole: string;
  timestamp: string;
  room: string;
  description: string;
  type: 'Progress' | 'Photo' | 'Snag' | 'Inspection' | 'Delivery';
  imageUrl?: string;
  progressPercentage?: number;
  tags: string[];
}

export interface ProjectMilestone {
  id: string;
  name: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  targetDate: string;
}

export interface ProjectRoom {
  name: string;
  stage: string;
  progress: number;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  clientPhone: string;
  progress: number;
  deadline: string;
  status: SiteStatus;
  siteManager: string;
  managerPhone: string;
  address: string;
  type: string;
  area: string;
  startDate: string;
  imageUrl: string;
  notes?: string;
  rooms: ProjectRoom[];
  milestones: ProjectMilestone[];
  budgetSpent?: string;
  totalBudget?: string;
  currentPhase?: string;
  workersOnSiteCount?: number;
  workersBreakdown?: string;
}
