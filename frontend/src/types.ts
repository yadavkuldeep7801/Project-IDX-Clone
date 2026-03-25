export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

export type ProjectTemplate = 'react' | 'nextjs' | 'go';
