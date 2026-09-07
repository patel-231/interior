import React from 'react';
import { UserRole } from '../types';
import { Compass, Bell, Shield, HardHat, Plus } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  workerProjectName?: string;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onOpenActionMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  workerProjectName,
  unreadCount = 3,
  onOpenNotifications,
  onOpenActionMenu,
}) => {
  return (
    <header className="bg-[#F9F8F6] border-b border-[#EAE7E1] sticky top-0 z-30 transition-colors">
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#2D2D2D] text-[#F9F8F6] flex items-center justify-center font-bold text-lg shadow-xs">
            <span>S</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base sm:text-lg tracking-tight text-[#2D2D2D]">
                SiteFlow
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  currentRole === 'OWNER'
                    ? 'bg-[#EAE7E1] text-[#2D2D2D]'
                    : 'bg-[#FEF4E8] text-[#D18C28] border border-[#F5E1C5]'
                }`}
              >
                {currentRole === 'OWNER' ? 'Studio Head' : 'Supervisor'}
              </span>
            </div>
            <p className="text-[11px] text-[#7A756F] font-normal leading-none mt-0.5 truncate max-w-[200px] sm:max-w-xs">
              {currentRole === 'OWNER'
                ? 'Sengupta Architecture & Interiors'
                : workerProjectName ? `Site: ${workerProjectName}` : 'Field Operations'}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentRole === 'OWNER' ? (
            <>
              {onOpenActionMenu && (
                <button
                  id="header-quick-action-btn"
                  onClick={onOpenActionMenu}
                  className="px-3 py-1.5 rounded-full bg-[#2D2D2D] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#A68B67]" />
                  <span className="hidden sm:inline">New Action</span>
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#EAE7E1]/70 rounded-full text-xs text-[#2D2D2D] font-medium">
                <Shield className="w-3.5 h-3.5 text-[#7A756F]" />
                <span>Designer Access</span>
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#FEF4E8] rounded-full text-xs text-[#D18C28] font-medium border border-[#F5E1C5]">
              <HardHat className="w-3.5 h-3.5 text-[#D18C28]" />
              <span>On Site • Check-in Active</span>
            </div>
          )}

          {/* User initials circle avatar as in Geometric Balance design */}
          <div className="w-8 h-8 rounded-full bg-[#D6D0C7] flex items-center justify-center text-[10px] font-bold text-[#2D2D2D] shadow-xs shrink-0">
            {currentRole === 'OWNER' ? 'AD' : 'RK'}
          </div>

          <button
            id="notification-bell-btn"
            onClick={onOpenNotifications}
            className="w-8 h-8 rounded-full bg-white border border-[#EAE7E1] hover:border-[#D6D0C7] text-[#2D2D2D] flex items-center justify-center relative transition-all shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#2D2D2D]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B85C4E] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
