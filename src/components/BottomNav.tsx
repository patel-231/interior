import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  FolderKanban,
  AlertOctagon,
  Package,
  MoreHorizontal,
  CheckSquare,
  FilePlus,
  Clock,
  User,
  PlusCircle,
} from 'lucide-react';

export type OwnerTab = 'Home' | 'Projects' | 'Issues' | 'Materials' | 'More' | 'Add';
export type WorkerTab = 'Home' | 'Tasks' | 'Add Update' | 'Updates' | 'Profile';

interface BottomNavProps {
  currentRole: UserRole;
  ownerTab: OwnerTab;
  onSelectOwnerTab: (tab: OwnerTab) => void;
  workerTab: WorkerTab;
  onSelectWorkerTab: (tab: WorkerTab) => void;
  pendingMaterialsCount?: number;
  pendingTasksCount?: number;
  openIssuesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRole,
  ownerTab,
  onSelectOwnerTab,
  workerTab,
  onSelectWorkerTab,
  pendingMaterialsCount = 5,
  pendingTasksCount = 4,
  openIssuesCount = 0,
}) => {
  if (currentRole === 'OWNER') {
    return (
      <nav className="bg-white border-t border-[#EAE7E1] px-2 sm:px-8 py-2.5 flex items-center justify-around z-40 shadow-sm">
        {/* Home */}
        <button
          id="owner-nav-home"
          onClick={() => onSelectOwnerTab('Home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            ownerTab === 'Home' ? 'text-[#2D2D2D]' : 'text-[#7A756F] hover:text-[#2D2D2D]'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${ownerTab === 'Home' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
          <span className={`text-[10px] tracking-wider uppercase mt-1 ${ownerTab === 'Home' ? 'font-bold' : 'font-medium'}`}>
            Home
          </span>
        </button>

        {/* Projects */}
        <button
          id="owner-nav-projects"
          onClick={() => onSelectOwnerTab('Projects')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            ownerTab === 'Projects' ? 'text-[#2D2D2D]' : 'text-[#7A756F] hover:text-[#2D2D2D]'
          }`}
        >
          <FolderKanban className={`w-5 h-5 ${ownerTab === 'Projects' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
          <span className={`text-[10px] tracking-wider uppercase mt-1 ${ownerTab === 'Projects' ? 'font-bold' : 'font-medium'}`}>
            Projects
          </span>
        </button>

        {/* Issues (Prominent snags tracker with open issues badge) */}
        <button
          id="owner-nav-issues"
          onClick={() => onSelectOwnerTab('Issues')}
          className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
            ownerTab === 'Issues' ? 'text-[#2D2D2D]' : 'text-[#7A756F] hover:text-[#2D2D2D]'
          }`}
        >
          <div className="relative">
            <AlertOctagon
              className={`w-5 h-5 ${
                ownerTab === 'Issues' ? 'stroke-[2.2] text-[#B85C4E]' : 'stroke-[1.6]'
              }`}
            />
            {openIssuesCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#B85C4E] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {openIssuesCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] tracking-wider uppercase mt-1 ${ownerTab === 'Issues' ? 'font-bold' : 'font-medium'}`}>
            Issues
          </span>
        </button>

        {/* Materials */}
        <button
          id="owner-nav-materials"
          onClick={() => onSelectOwnerTab('Materials')}
          className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
            ownerTab === 'Materials' ? 'text-[#2D2D2D]' : 'text-[#7A756F] hover:text-[#2D2D2D]'
          }`}
        >
          <div className="relative">
            <Package className={`w-5 h-5 ${ownerTab === 'Materials' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
            {pendingMaterialsCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#A68B67] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {pendingMaterialsCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] tracking-wider uppercase mt-1 ${ownerTab === 'Materials' ? 'font-bold' : 'font-medium'}`}>
            Materials
          </span>
        </button>

        {/* More */}
        <button
          id="owner-nav-more"
          onClick={() => onSelectOwnerTab('More')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            ownerTab === 'More' ? 'text-[#2D2D2D]' : 'text-[#7A756F] hover:text-[#2D2D2D]'
          }`}
        >
          <MoreHorizontal className={`w-5 h-5 ${ownerTab === 'More' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
          <span className={`text-[10px] tracking-wider uppercase mt-1 ${ownerTab === 'More' ? 'font-bold' : 'font-medium'}`}>
            More
          </span>
        </button>
      </nav>
    );
  }

  // WORKER NAVIGATION
  return (
    <nav className="bg-white border-t border-[#EAE7E1] px-2 sm:px-8 py-2.5 flex items-center justify-around z-40 shadow-sm">
      {/* Home */}
      <button
        id="worker-nav-home"
        onClick={() => onSelectWorkerTab('Home')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          workerTab === 'Home' ? 'text-[#2D2D2D]' : 'text-[#7A756F] hover:text-[#2D2D2D]'
        }`}
      >
        <LayoutDashboard className={`w-5 h-5 ${workerTab === 'Home' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
        <span className={`text-[10px] tracking-wider uppercase mt-1 ${workerTab === 'Home' ? 'font-bold' : 'font-medium'}`}>
          Home
        </span>
      </button>

      {/* Tasks */}
      <button
        id="worker-nav-tasks"
        onClick={() => onSelectWorkerTab('Tasks')}
        className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
          workerTab === 'Tasks' ? 'text-[#2D2D2D]' : 'text-[#7A756F] hover:text-[#2D2D2D]'
        }`}
      >
        <div className="relative">
          <CheckSquare className={`w-5 h-5 ${workerTab === 'Tasks' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
          {pendingTasksCount > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#2D2D2D] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
              {pendingTasksCount}
            </span>
          )}
        </div>
        <span className={`text-[10px] tracking-wider uppercase mt-1 ${workerTab === 'Tasks' ? 'font-bold' : 'font-medium'}`}>
          Tasks
        </span>
      </button>

      {/* Add Update (Center Highlight) */}
      <button
        id="worker-nav-add-update"
        onClick={() => onSelectWorkerTab('Add Update')}
        className="flex flex-col items-center justify-center flex-1 py-1 -mt-4 sm:-mt-6 group"
        aria-label="Add site update"
      >
        <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#A68B67] text-white flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-[#8E7554] transition-all">
          <FilePlus className="w-6 h-6 stroke-[1.8]" />
        </div>
        <span className={`text-[10px] tracking-wider uppercase mt-0.5 whitespace-nowrap ${workerTab === 'Add Update' ? 'font-bold text-[#2D2D2D]' : 'font-medium text-[#7A756F]'}`}>
          Add Update
        </span>
      </button>

      {/* Updates */}
      <button
        id="worker-nav-updates"
        onClick={() => onSelectWorkerTab('Updates')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          workerTab === 'Updates' ? 'text-[#2D2D2D]' : 'text-[#7A756F] hover:text-[#2D2D2D]'
        }`}
      >
        <Clock className={`w-5 h-5 ${workerTab === 'Updates' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
        <span className={`text-[10px] tracking-wider uppercase mt-1 ${workerTab === 'Updates' ? 'font-bold' : 'font-medium'}`}>
          Updates
        </span>
      </button>

      {/* Profile */}
      <button
        id="worker-nav-profile"
        onClick={() => onSelectWorkerTab('Profile')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          workerTab === 'Profile' ? 'text-[#2D2D2D]' : 'text-[#7A756F] hover:text-[#2D2D2D]'
        }`}
      >
        <User className={`w-5 h-5 ${workerTab === 'Profile' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
        <span className={`text-[10px] tracking-wider uppercase mt-1 ${workerTab === 'Profile' ? 'font-bold' : 'font-medium'}`}>
          Profile
        </span>
      </button>
    </nav>
  );
};
