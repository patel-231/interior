import React, { useState } from 'react';
import { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { Search, Plus, Filter, CheckCircle2, AlertCircle, Building } from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenAddProjectModal: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelectProject,
  onOpenAddProjectModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'On Track' | 'Delayed'>('All');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.siteManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 pb-8">
      {/* Header with Title & Add Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-[#2D2D2D]">
            Interior <span className="font-semibold">Projects</span>
          </h1>
          <p className="text-xs text-[#7A756F] italic">Active execution sites portfolio</p>
        </div>
        <button
          id="btn-add-site"
          onClick={onOpenAddProjectModal}
          className="px-4 py-2 rounded-full bg-[#2D2D2D] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#A68B67]" />
          <span>New Site</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#7A756F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="projects-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by site, client, or manager..."
            className="w-full bg-white border border-[#EAE7E1] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#2D2D2D] placeholder:text-[#7A756F] focus:outline-none focus:border-[#A68B67] shadow-xs transition-colors"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all ${
              statusFilter === 'All'
                ? 'bg-[#2D2D2D] text-white shadow-xs'
                : 'bg-white border border-[#EAE7E1] text-[#7A756F] hover:text-[#2D2D2D]'
            }`}
          >
            All Sites ({projects.length})
          </button>
          <button
            onClick={() => setStatusFilter('On Track')}
            className={`px-4 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
              statusFilter === 'On Track'
                ? 'bg-[#5B7B61] text-white shadow-xs'
                : 'bg-white border border-[#EAE7E1] text-[#7A756F] hover:text-[#5B7B61]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>On Track ({projects.filter((p) => p.status === 'On Track').length})</span>
          </button>
          <button
            onClick={() => setStatusFilter('Delayed')}
            className={`px-4 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
              statusFilter === 'Delayed'
                ? 'bg-[#B85C4E] text-white shadow-xs'
                : 'bg-white border border-[#EAE7E1] text-[#7A756F] hover:text-[#B85C4E]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Delayed ({projects.filter((p) => p.status === 'Delayed').length})</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-[#EAE7E1] p-10 text-center space-y-2 shadow-sm">
            <Building className="w-8 h-8 text-[#7A756F] mx-auto" />
            <h3 className="text-sm font-semibold text-[#2D2D2D]">No matching sites found</h3>
            <p className="text-xs text-[#7A756F]">
              Try adjusting your search query or status filter.
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
            />
          ))
        )}
      </div>
    </div>
  );
};
