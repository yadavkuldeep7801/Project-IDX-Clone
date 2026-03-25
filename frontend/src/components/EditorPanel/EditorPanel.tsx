import React from 'react';
import { FileNode } from '../../types';
import { MonacoEditor } from '../MonacoEditor/MonacoEditor';
import { X, Loader2 } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';

interface EditorPanelProps {
  activeFile: FileNode | null;
  onClose: () => void;
  onContentChange: (content: string | undefined) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  activeFile,
  onClose,
  onContentChange
}) => {
  const loadingFiles = useProjectStore(state => state.loadingFiles);
  const dirtyFiles = useProjectStore(state => state.dirtyFiles);

  if (!activeFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0d1117] text-zinc-500">
        <h1 className="text-2xl font-semibold mb-2">
          Welcome to your Project Workspace
        </h1>
        <p className="text-sm">Start by generating a backend project.</p>
      </div>
    );
  }

  const isLoading = loadingFiles.has(activeFile.id);

  const handleClose = () => {
    if (dirtyFiles.has(activeFile.id)) {
      const confirmClose = confirm("You have unsaved changes. Close anyway?");
      if (!confirmClose) return;
    }
    onClose();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
      {/* Header */}
      <div className="flex items-center bg-[#252526] border-b border-zinc-800 px-4 h-9 justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-400 border-r border-zinc-800 pr-4 h-full">
          <span title={activeFile.id}>
            {activeFile.name}
            {dirtyFiles.has(activeFile.id) && ' •'}
          </span>
          <button onClick={handleClose} className="hover:text-white transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Fetching content...</span>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        {isLoading && !activeFile.content && (
          <div className="absolute inset-0 z-10 bg-[#1e1e1e]/50 flex items-center justify-center pointer-events-none">
            <Loader2 className="w-8 h-8 text-zinc-600 animate-spin" />
          </div>
        )}

        <MonacoEditor
          key={activeFile.id}
          file={activeFile}
          isLoading={isLoading}
          onContentChange={onContentChange}
        />
      </div>
    </div>
  );
};