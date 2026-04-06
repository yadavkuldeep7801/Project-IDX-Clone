

import { useEffect, useCallback, useState } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar'
import { FileTree } from './components/FileTree/FileTree';
import { EditorPanel } from './components/EditorPanel/EditorPanel';
import { FileNode, ProjectTemplate } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { useProjectStore } from './store/useProjectStore';
import { projectService, mapBackendTreeToFiles } from './services/projectService';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { Terminal } from './components/Terminal/Terminal';
import {WebPreview} from './components/WebPreview/Webpreview';
export default function App() {
  const {
    files,
    activeFileId,
    setFiles,
    setActiveFileId,
    setProjectId,
    projectId,
    updateFileContent,
    toggleFolder,
    connectSocket,
    disconnectSocket,
    fetchFileContent
  } = useProjectStore();

  // Get projectId from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlProjectId = params.get('projectId');
    if (urlProjectId && urlProjectId !== projectId) {
      setProjectId(urlProjectId);
    }
  }, [setProjectId, projectId])

  // Connect socket when projectId changes
  useEffect(() => {
    if (projectId) {
      connectSocket(projectId);
      return () => {
        disconnectSocket();
      };
    }
  }, [projectId, connectSocket, disconnectSocket]);

  // Fetch project if projectId exists in store (from URL or generation)
  const { data, isLoading, error: fetchError } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProject(projectId!),
    enabled: !!projectId && files.length === 0, // Only fetch if we have an ID but no files yet
  });
;
  // Sync query data with store
  useEffect(() => {
    if (data) {
      const mappedFiles = [mapBackendTreeToFiles(data.projectTree)];
      setFiles(mappedFiles);
    }
  }, [data, setFiles]);

  const findFileById = useCallback((nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFileById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const handleGenerateProject = async (template: ProjectTemplate) => {
    try {
      if (template === 'react') {
        const response = await projectService.createReactProject();
        const mappedFiles = [mapBackendTreeToFiles(response.projectTree)];
        setFiles(mappedFiles);
        setProjectId(response.projectId);
        
        // Update URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('projectId', response.projectId);
        window.history.pushState({}, '', newUrl);
      } else {
        // Placeholder for Next.js or other templates
        console.log('Next.js template not implemented in backend yet');
      }
      setActiveFileId(null);
    } catch (error: any) {
      console.error('Failed to generate project:', error);
      let errorMessage = 'Failed to generate project.';
      
      if (error.message === 'Network Error') {
        if (window.location.protocol === 'https:' && projectService.getBaseUrl().startsWith('http:')) {
          errorMessage += '\n\n⚠️ MIXED CONTENT ERROR: Your browser is blocking a request to an insecure "http" backend from this secure "https" app. Please use an "https" URL for your backend (e.g., via ngrok).';
        } else if (projectService.getBaseUrl().includes('ngrok-free.app')) {
          errorMessage += '\n\n⚠️ NGROK CONNECTION ERROR:\n1. Ensure your ngrok tunnel is still active.\n2. Verify the URL matches your current ngrok address.\n3. IMPORTANT: Ensure your backend has CORS enabled. In Express, add:\n   const cors = require("cors");\n   app.use(cors());\n4. Current URL: ' + projectService.getBaseUrl();
        } else {
          errorMessage += '\n\n⚠️ CORS/CONNECTION ERROR: Please ensure your backend is running at ' + projectService.getBaseUrl() + ' and has CORS enabled.';
        }
      } else {
        errorMessage += ' ' + (error.response?.data?.message || error.message);
      }
      
      alert(errorMessage);
    }
  };

  const handleFileClick = (file: FileNode) => {
    console.log(`🖱️ File clicked: ${file.name} (id: ${file.id})`);
    setActiveFileId(file.id);
    
    // If file has no content, try to fetch it via socket
    if (file.type === 'file' && !file.content) {
      console.log(`📂 Fetching content for: ${file.id}`);
      fetchFileContent(file.id);
    }
  };

  const handleToggleFolder = (id: string) => {
    toggleFolder(id);
  };

  const handleContentChange = (content: string | undefined) => {
    if (activeFileId && content !== undefined) {
      updateFileContent(activeFileId, content);
      // In a real app, you'd also emit a socket event or call an API to save
    }
  };

  const activeFile = activeFileId ? findFileById(files, activeFileId) : null;
  
  if (activeFileId && !activeFile && files.length > 0) {
    console.warn(`⚠️ Active file ID ${activeFileId} set but file not found in tree!`);
  }

  const isSocketConnected = useProjectStore(state => state.socket?.connected);
  
  // Fetch content for active file if it's missing (e.g., after refresh)
  useEffect(() => {
    if (activeFile && activeFile.type === 'file' && !activeFile.content && isSocketConnected) {
      console.log(`🔄 Auto-fetching content for active file: ${activeFile.id}`);
      fetchFileContent(activeFile.id);
    }
  }, [activeFile, fetchFileContent, isSocketConnected]);

  const [isBackendReachable, setIsBackendReachable] = useState<boolean | null>(null);
   const [showTerminal, setShowTerminal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const check = async () => {
      const reachable = await projectService.checkConnection();
      setIsBackendReachable(reachable);
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);
 
  return (
    <div className="flex h-screen w-full bg-[#0d1117] text-zinc-300 font-sans overflow-hidden">
      <Sidebar 
        onGenerateProject={handleGenerateProject}
        // onGoHome={() => setShowLanding(true)}
        showTerminal={showTerminal}
        setShowTerminal={setShowTerminal}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
      >
        <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isBackendReachable === true ? 'bg-emerald-500' : isBackendReachable === false ? 'bg-rose-500' : 'bg-zinc-500'}`} />
          <span className="text-[10px] uppercase tracking-wider font-medium text-zinc-500">
            Backend: {isBackendReachable === true ? 'Connected' : isBackendReachable === false ? 'Disconnected' : 'Checking...'}
          </span>
        </div>
        {isLoading ? (
          <div className="p-4 flex flex-col items-center gap-2 text-zinc-500">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <RefreshCw className="w-5 h-5" />
            </motion.div>
            <span className="text-[10px]">Loading project...</span>
          </div>
        ) : fetchError ? (
          <div className="p-4 text-rose-500 text-[10px] flex flex-col gap-1">
            <span className="font-bold">Error loading project</span>
            <span>{(fetchError as any).message}</span>
          </div>
        ) : (
          <FileTree
            files={files}
            onFileClick={handleFileClick}
            onToggleFolder={handleToggleFolder}
            selectedFileId={activeFileId || undefined}
          />
        )}
      </Sidebar>


      <main className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFileId || 'empty'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            <EditorPanel
              activeFile={activeFile}
              onClose={() => setActiveFileId(null)}
              onContentChange={handleContentChange}
            />
          </motion.div>
        </AnimatePresence>

        
         {showTerminal && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: '30%' }}
              className="min-h-[150px] max-h-[50%] z-10"
            >
              <Terminal onClose={() => setShowTerminal(false)} />
            </motion.div>
          )}
      </main>
           {showPreview && (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '400px' }}
            className="h-full z-20"
          >
            <WebPreview onClose={() => setShowPreview(false)} />
          </motion.div>
        )}
  
    </div>
  );
}
