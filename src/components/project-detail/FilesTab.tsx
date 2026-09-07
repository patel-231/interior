import React, { useState } from 'react';
import { Project, ProjectFile } from '../../types';
import {
  FileText,
  Download,
  Eye,
  Plus,
  Layers,
  FolderArchive,
  FileSpreadsheet,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';

interface FilesTabProps {
  project: Project;
  files: ProjectFile[];
  onUploadFile?: () => void;
}

const FILE_CATEGORIES = [
  'All',
  'Drawings & CAD',
  'MEP & HVAC',
  'Joinery & Millwork',
  'Finishes & BOQ',
  '3D Renders',
] as const;

export const FilesTab: React.FC<FilesTabProps> = ({ project, files, onUploadFile }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Filter files for this project
  const projectFiles = files.filter((f) => f.projectId === project.id);

  const filteredFiles = projectFiles.filter((f) => {
    return selectedCategory === 'All' || f.category === selectedCategory;
  });

  const getFileBadge = (fileType: string) => {
    switch (fileType) {
      case 'DWG':
        return 'bg-[#FFF1F2] text-[#E11D48] border-[#E11D48]/30';
      case 'PDF':
        return 'bg-[#FBEAEA] text-[#B85C4E] border-[#B85C4E]/30';
      case 'XLSX':
        return 'bg-[#E8F2EA] text-[#5B7B61] border-[#5B7B61]/30';
      case 'ZIP':
        return 'bg-[#EDE9FE] text-[#6D28D9] border-[#6D28D9]/30';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const handleSimulateDownload = (fileName: string) => {
    setActionNotice(`Downloaded ${fileName}`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleSimulatePreview = (fileName: string) => {
    setActionNotice(`Opened preview for ${fileName}`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="p-3 rounded-xl bg-[#2D2D2D] text-white text-xs flex items-center gap-2 shadow-lg animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#A68B67]" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold text-[#7A756F] uppercase tracking-widest block">
            Drawings & Specifications
          </span>
          <h4 className="text-sm font-semibold text-[#2D2D2D]">
            Project Documentation ({projectFiles.length})
          </h4>
        </div>

        <button
          onClick={() => {
            setActionNotice('Upload document dialog ready. Drag & drop architectural CAD/PDF.');
            setTimeout(() => setActionNotice(null), 3500);
            if (onUploadFile) onUploadFile();
          }}
          className="px-3.5 py-1.5 rounded-xl bg-[#2D2D2D] hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {FILE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count =
            cat === 'All'
              ? projectFiles.length
              : projectFiles.filter((f) => f.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#2D2D2D] text-white border-[#2D2D2D] shadow-sm'
                  : 'bg-white text-[#7A756F] border-[#EAE7E1] hover:text-[#2D2D2D]'
              }`}
            >
              <span>{cat}</span>
              <span className="ml-1 text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Files List */}
      {filteredFiles.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#EAE7E1] space-y-2">
          <HardDrive className="w-8 h-8 text-[#A68B67] mx-auto opacity-70" />
          <h4 className="text-sm font-semibold text-[#2D2D2D]">No files in this folder</h4>
          <p className="text-xs text-[#7A756F]">
            Upload CAD drawings, reflected ceiling layouts, or BOQ schedules.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="p-4 rounded-2xl bg-white border border-[#EAE7E1] hover:border-[#A68B67]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm group"
            >
              {/* Left file info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold border shrink-0 ${getFileBadge(
                    file.fileType
                  )}`}
                >
                  {file.fileType}
                </span>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <h5 className="text-xs font-semibold text-[#2D2D2D] group-hover:text-[#A68B67] transition-colors truncate">
                    {file.name}
                  </h5>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[#7A756F]">
                    <span className="font-medium text-[#2D2D2D]">{file.category}</span>
                    <span>•</span>
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>Updated {file.uploadedAt} by {file.uploadedBy}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => handleSimulatePreview(file.name)}
                  className="px-3 py-1.5 rounded-xl border border-[#EAE7E1] hover:bg-stone-50 text-xs font-semibold text-[#2D2D2D] flex items-center gap-1 transition-colors"
                  aria-label={`Preview ${file.name}`}
                >
                  <Eye className="w-3.5 h-3.5 text-[#A68B67]" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handleSimulateDownload(file.name)}
                  className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2D2D2D] transition-colors"
                  aria-label={`Download ${file.name}`}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
