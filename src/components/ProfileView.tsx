import React from 'react';
import { Project } from '../types';
import {
  HardHat,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Building,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

interface ProfileViewProps {
  assignedProjects: Project[];
  onSelectProject: (project: Project) => void;
  supervisorName?: string;
  supervisorRole?: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  assignedProjects,
  onSelectProject,
  supervisorName = 'Ramesh Kumar',
  supervisorRole = 'Senior Site Supervisor',
}) => {
  return (
    <div className="space-y-4 pb-8">
      {/* Header Profile Card */}
      <section className="bg-white rounded-3xl border border-[#EAE7E1] p-6 shadow-sm">
        <div className="flex items-center gap-4 pb-4 border-b border-[#EAE7E1]">
          <div className="w-14 h-14 rounded-full bg-[#D6D0C7] text-[#2D2D2D] flex items-center justify-center font-bold text-lg">
            RK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-light text-[#2D2D2D]">
                <span className="font-semibold">{supervisorName}</span>
              </h1>
              <span className="bg-[#E8F2EA] text-[#5B7B61] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5B7B61]" />
                Active
              </span>
            </div>
            <p className="text-xs text-[#7A756F]">{supervisorRole}</p>
            <span className="text-[11px] text-[#7A756F] block mt-0.5">ID: SF-SUP-0842 • 8 Yrs Exp</span>
          </div>
        </div>

        {/* Quick Contact buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-4">
          <a
            href="tel:+919845011234"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#F9F8F6] border border-[#EAE7E1] text-xs font-semibold text-[#2D2D2D] hover:bg-stone-100 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#A68B67]" />
            <span>+91 98450 11234</span>
          </a>
          <a
            href="mailto:ramesh.field@siteflow.design"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#F9F8F6] border border-[#EAE7E1] text-xs font-semibold text-[#2D2D2D] hover:bg-stone-100 transition-colors truncate"
          >
            <Mail className="w-3.5 h-3.5 text-[#A68B67]" />
            <span className="truncate">Email Studio</span>
          </a>
        </div>
      </section>

      {/* Head Designer Direct Line */}
      <section className="bg-[#2D2D2D] text-white rounded-3xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A68B67]">
            Studio Headquarters
          </span>
          <span className="text-[11px] text-[#A68B67]/80">Direct Escalation</span>
        </div>
        <div>
          <h3 className="text-base font-light text-white">Ar. <span className="font-semibold">Archana Sengupta</span></h3>
          <p className="text-xs text-[#D6D0C7]">Principal Designer & Founder</p>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <a
            href="tel:+919820088991"
            className="flex-1 py-2.5 rounded-full bg-[#A68B67] hover:bg-[#8E7554] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Designer</span>
          </a>
        </div>
      </section>

      {/* Assigned Construction Sites */}
      <section className="bg-white rounded-3xl border border-[#EAE7E1] p-6 shadow-sm space-y-3">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#7A756F]">
          Assigned Projects ({assignedProjects.length})
        </h2>

        <div className="space-y-3">
          {assignedProjects.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectProject(p)}
              className="p-4 rounded-2xl bg-[#F9F8F6] border border-[#EAE7E1] hover:border-[#D6D0C7] transition-all cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-[#2D2D2D]">{p.name}</h4>
                <p className="text-[11px] text-[#7A756F]">{p.type} • {p.area}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#7A756F]">
                  <Calendar className="w-3 h-3 text-[#A68B67]" />
                  <span>Handover: {p.deadline}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-light text-[#2D2D2D] block">
                  {p.progress}%
                </span>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    p.status === 'Delayed' ? 'bg-[#FBEAEA] text-[#B85C4E]' : 'bg-[#E8F2EA] text-[#5B7B61]'
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety & Protocol Badges */}
      <section className="bg-white rounded-3xl border border-[#EAE7E1] p-6 shadow-sm text-xs space-y-3">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#7A756F]">
          Site Compliance & Health
        </h2>
        <div className="flex items-center justify-between py-2 border-b border-[#EAE7E1]">
          <span className="text-[#555] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5B7B61]" />
            Personal Protective Equipment (PPE)
          </span>
          <span className="font-semibold text-[#5B7B61]">Verified</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-[#EAE7E1]">
          <span className="text-[#555] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#A68B67]" />
            Today's Check-in
          </span>
          <span className="font-semibold text-[#2D2D2D]">08:15 AM (GPS In)</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-[#555] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#A68B67]" />
            Site Insurance Certificate
          </span>
          <span className="font-semibold text-[#2D2D2D]">Valid to Dec 2026</span>
        </div>
      </section>
    </div>
  );
};
