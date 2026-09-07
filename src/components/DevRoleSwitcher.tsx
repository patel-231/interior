import React from 'react';
import { UserRole } from '../types';
import { UserCheck, HardHat, Smartphone, Monitor } from 'lucide-react';

interface DevRoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  workerSiteId: string;
  onWorkerSiteChange: (siteId: string) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const DevRoleSwitcher: React.FC<DevRoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
  workerSiteId,
  onWorkerSiteChange,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  return (
    <aside aria-label="Development Role & Viewport Switcher" className="bg-[#2D2D2D] text-white border-b border-[#3D3D3D] text-xs px-4 py-2 z-50 sticky top-0 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Role Switcher & Dev Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-[#A68B67] text-white px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase shadow-xs">
            DEV MODE
          </div>
          <div className="inline-flex p-0.5 bg-[#1C1C1C] rounded-full border border-[#444]">
            <button
              id="role-btn-owner"
              onClick={() => onRoleChange('OWNER')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                currentRole === 'OWNER'
                  ? 'bg-white text-[#2D2D2D] shadow-sm'
                  : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Owner / Designer</span>
            </button>
            <button
              id="role-btn-worker"
              onClick={() => onRoleChange('WORKER')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                currentRole === 'WORKER'
                  ? 'bg-[#A68B67] text-white shadow-sm'
                  : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Worker / Supervisor</span>
            </button>
          </div>
        </div>

        {/* Middle: If Worker, select assigned site */}
        {currentRole === 'WORKER' && (
          <div className="flex items-center gap-1.5">
            <span className="text-[#A0A0A0] text-[11px] uppercase tracking-wider font-medium">Assigned:</span>
            <select
              id="worker-site-select"
              value={workerSiteId}
              onChange={(e) => onWorkerSiteChange(e.target.value)}
              className="bg-[#1C1C1C] text-stone-200 border border-[#444] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#A68B67]"
            >
              <option value="proj-1">Shah Residence (Ramesh K.)</option>
              <option value="proj-2">Patel Office (Vikram S.)</option>
              <option value="proj-3">Mehta Villa (Ramesh K.)</option>
            </select>
          </div>
        )}

        {/* Right: Viewport Mode */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-viewport-btn"
            onClick={onToggleMobileFrame}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D3D3D] hover:bg-[#4D4D4D] text-[#D6D0C7] text-xs font-medium transition-colors border border-[#555]"
            title={isMobileFrame ? "Switch to Full Width Responsive" : "Preview in Mobile Frame"}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#A68B67]" />
                <span className="hidden sm:inline">Fluid Layout</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#A68B67]" />
                <span className="hidden sm:inline">Mobile Frame (390px)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
