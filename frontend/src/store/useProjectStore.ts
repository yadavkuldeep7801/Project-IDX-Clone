import { create } from 'zustand';
import { FileNode } from '../types';
import { Socket } from 'socket.io-client';
import { socketService } from '../services/socketService';
import { projectService } from '../services/projectService';

interface ProjectState {
  files: FileNode[];
  activeFileId: string | null;
  projectId: string | null;
  socket: Socket | null;
  loadingFiles: Set<string>;
  dirtyFiles: Set<string>;
  setFiles: (files: FileNode[]) => void;
  setActiveFileId: (id: string | null) => void;
  setProjectId: (id: string | null) => void;
  updateFileContent: (id: string, content: string) => void;
  toggleFolder: (id: string) => void;
  connectSocket: (projectId: string) => void;
  disconnectSocket: () => void;
  fetchFileContent: (path: string) => void;
  markDirty: (id: string) => void;
  clearDirty: (id: string) => void;
}
export const useProjectStore = create<ProjectState>((set, get) => ({
  files: [],
  activeFileId: localStorage.getItem('activeFileId'),
  projectId: localStorage.getItem('projectId'),
  socket: null,
  loadingFiles: new Set(),
  setFiles: (files) => set({ files }),
  setActiveFileId: (id) => {
    if (id) localStorage.setItem('activeFileId', id);
    else localStorage.removeItem('activeFileId');
    set({ activeFileId: id });
  },
  setProjectId: (id) => {
    if (id) localStorage.setItem('projectId', id);
    else localStorage.removeItem('projectId');
    set({ projectId: id });
  },
  updateFileContent: (id, content) =>
    set((state) => {
      const newLoadingFiles = new Set(state.loadingFiles);
      // Clear the specific ID and any path that might be a relative version of it
      newLoadingFiles.delete(id);
      
      // Also clear any path that ends with this ID or that this ID ends with
      state.loadingFiles.forEach(path => {
        if (path.endsWith(id) || id.endsWith(path)) {
          newLoadingFiles.delete(path);
        }
      });

      return {
        files: updateNodeContent(state.files, id, content),
        loadingFiles: newLoadingFiles
      };
    }),
  toggleFolder: (id) =>
    set((state) => ({
      files: toggleNodeFolder(state.files, id),
    })),
  connectSocket: (projectId) => {
  const socket = socketService.connect(projectId);

  socket.removeAllListeners(); // 🔥 fix memory leak

  socket.on('fileContent', ({ filepath, data }) => {
    console.log(`📂 Received file content for: ${filepath}`);
    get().updateFileContent(filepath, data);
  });

  socket.on('fileChanged', ({ path }) => {
    console.log('📢 File changed:', path);
    get().fetchFileContent(path);
  });

  socket.on('error', (error) => {
    console.error('❌ Socket error:', error.message);
  });

  set({ socket });
},
  disconnectSocket: () => {
    socketService.disconnect();
    set({ socket: null });
  },
  fetchFileContent: (path) => {
    const { socket, projectId } = get();
    if (socket && socket.connected) {
      // Normalize path: if it's an absolute path or contains the projectId, 
      // try to make it relative to the project root as the backend expects.
      let relativePath = path;
      
      if (projectId && path.includes(projectId)) {
        // Split by projectId and take the last part
        const parts = path.split(projectId);
        relativePath = parts[parts.length - 1];
        
        // Remove leading slashes
        while (relativePath.startsWith('/') || relativePath.startsWith('\\')) {
          relativePath = relativePath.substring(1);
        }
      }

      console.log(`🚀 Emitting getFileContent for: ${relativePath} (original: ${path})`);
      set((state) => {
        const newLoadingFiles = new Set(state.loadingFiles);
        newLoadingFiles.add(path);
        newLoadingFiles.add(relativePath);
        return { loadingFiles: newLoadingFiles };
      });
      socket.emit('getFileContent', { path: relativePath });
    } else {
      console.warn('⚠️ Socket not connected, cannot fetch file content');
    }
  },
dirtyFiles: new Set(),

markDirty: (id: string) =>
  set((state) => {
    const newSet = new Set(state.dirtyFiles);
    newSet.add(id);
    return { dirtyFiles: newSet };
  }),

clearDirty: (id: string) =>
  set((state) => {
    const newSet = new Set(state.dirtyFiles);
    newSet.delete(id);
    return { dirtyFiles: newSet };
  }),

  
}));

function updateNodeContent(nodes: FileNode[], id: string, content: string): FileNode[] {
  return nodes.map((node) => {
    // Check for exact match OR if the node's ID ends with the provided ID (relative path)
    // We normalize slashes to be safe
    const normalizedNodeId = node.id.replace(/\\/g, '/');
    const normalizedId = id.replace(/\\/g, '/');
    
    const isMatch = normalizedNodeId === normalizedId || 
                    normalizedNodeId.endsWith('/' + normalizedId) || 
                    normalizedNodeId.endsWith('\\' + normalizedId);

    if (isMatch) {
      console.log(`✅ Found match for node: ${node.id} with incoming ID: ${id}`);
      return { ...node, content };
    }
    if (node.children) {
      return { ...node, children: updateNodeContent(node.children, id, content) };
    }
    return node;
  });
}

function toggleNodeFolder(nodes: FileNode[], id: string): FileNode[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, isOpen: !node.isOpen };
    }
    if (node.children) {
      return { ...node, children: toggleNodeFolder(node.children, id) };
    }
    return node;
  });
}
