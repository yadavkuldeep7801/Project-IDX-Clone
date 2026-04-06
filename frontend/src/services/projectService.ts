import axios from 'axios';
import { FileNode } from '../types';

// Use VITE_API_URL if provided, otherwise fallback to your ngrok URL
const API_BASE_URL = (import.meta as any).env.VITE_API_URL 
export interface BackendProjectNode {
  path: string;
  name: string;
  children?: BackendProjectNode[];
}

export interface CreateProjectResponse {
  message: string;
  projectId: string;
  projectTree: BackendProjectNode;
}

export const mapBackendTreeToFiles = (node: BackendProjectNode): FileNode => {
  const isDirectory = !!node.children;
  return {
    id: node.path,
    name: node.name,
    type: isDirectory ? 'directory' : 'file',
    isOpen: isDirectory,
    children: node.children?.map(mapBackendTreeToFiles),
    content: '',
  };
};

// Configure axios defaults for ngrok
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json'
  }
});

export const projectService = {
  createReactProject: async (): Promise<CreateProjectResponse> => {
    console.log(`🚀 Requesting project creation at: ${API_BASE_URL}/project/create-react-project`);
    try {
      const response = await apiClient.post('/project/create-react-project', {
        projectType: 'react'
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Axios Error Details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  getProject: async (projectId: string): Promise<CreateProjectResponse> => {
    console.log(`🔍 Fetching project: ${projectId}`);

    try{
      const response = await apiClient.get('/project/project', {
        params: { projectId }
      });
      return response.data;

    }
    catch(error:any){
      console.error('❌ Fetch Project Error Details:', {
        projectId,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
    

  },
  
  getBaseUrl: () => API_BASE_URL,
  getOrigin: () => new URL(API_BASE_URL).origin,

  checkConnection: async (): Promise<boolean> => {
    try {
      // Try to hit a health check or just the base URL
      await apiClient.get('/health');
      return true;
    } catch (error: any) {
      // If we get a response but it's 404, it still means the server is reachable
      if (error.response) return true;
      return false;
    }
  },
  
  getFileContent: async (path: string): Promise<string> => {
    console.log(`📂 Fetching file content for: ${path} at ${API_BASE_URL}/project/file-content`);
    try {
      const response = await apiClient.get('/project/project/file-content', {
        params: { path }
      });
      return response.data.content;
    } catch (error: any) {
      console.error('❌ Fetch Content Error Details:', {
        path,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }
};

export const refreshProjectTree = async (
  projectId: string,
  setProjectTree: (data: FileNode) => void
) => {
  try {
    console.log("🔄 Refreshing project tree...");

    const res = await projectService.getProject(projectId);

    const mapped = mapBackendTreeToFiles(res.projectTree);

    setProjectTree(mapped);

  } catch (error: any) {
    console.error("❌ Refresh failed:", error.message);
  }
};