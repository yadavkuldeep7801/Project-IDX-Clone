import React, { useState, useEffect } from 'react';
import { Plus, Wifi, WifiOff, RefreshCw, Hash } from 'lucide-react';
import { ProjectTemplate } from '../../types';
import { projectService } from '../../services/projectService';
import { useProjectStore } from '../../store/useProjectStore';

interface SidebarProps {
  onGenerateProject: (template: ProjectTemplate) => void;
  children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ onGenerateProject, children }) => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const { projectId } = useProjectStore();

  const checkStatus = async () => {
    setStatus('checking');
    const isOnline = await projectService.checkConnection();
    setStatus(isOnline ? 'online' : 'offline');
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-64 bg-[#0d1117] border-r border-zinc-800 flex flex-col h-full">
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Explorer</h2>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 text-[10px] font-medium ${
              status === 'online' ? 'text-emerald-500' : 
              status === 'offline' ? 'text-rose-500' : 'text-zinc-500'
            }`}>
              {status === 'online' ? <Wifi className="w-3 h-3" /> : 
               status === 'offline' ? <WifiOff className="w-3 h-3" /> : 
               <RefreshCw className="w-3 h-3 animate-spin" />}
              {status.toUpperCase()}
            </div>
            <button onClick={checkStatus} className="text-zinc-600 hover:text-zinc-400">
              <RefreshCw className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {projectId && (
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mb-4 bg-zinc-900/50 p-1.5 rounded border border-zinc-800/50">
            <Hash className="w-3 h-3 text-emerald-500" />
            <span className="truncate font-mono" title={projectId}>{projectId}</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onGenerateProject('react')}
            className="flex flex-col items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-medium py-2 px-1 rounded transition-colors"
            title="React Project"
          >
            <Plus className="w-3 h-3" />
            React
          </button>
          <button
            onClick={() => onGenerateProject('nextjs')}
            className="flex flex-col items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-medium py-2 px-1 rounded transition-colors"
            title="Next.js Project"
          >
            <Plus className="w-3 h-3" />
            Next.js
          </button>
          <button
            onClick={() => onGenerateProject('go')}
            className="flex flex-col items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-medium py-2 px-1 rounded transition-colors"
            title="Go Project"
          >
            <Plus className="w-3 h-3" />
            Go
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      <div className="p-4 text-[10px] text-zinc-600 border-t border-zinc-800">
        {status === 'offline' && (
          <div className="mb-2 text-rose-400 font-medium">
            ⚠️ Backend unreachable. Check ngrok and CORS.
          </div>
        )}
        Click a button above to generate a new project via the backend!
      </div>
    </div>
  );
};
