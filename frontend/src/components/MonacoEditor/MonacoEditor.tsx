import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { FileNode } from '../../types';
import { socketService } from '../../services/socketService';
import { useProjectStore } from '../../store/useProjectStore';

interface MonacoEditorProps {
  file: FileNode | null;
  isLoading: boolean;
  onContentChange: (content: string | undefined) => void;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  file,
  isLoading,
  onContentChange
}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const markDirty = useProjectStore(state => state.markDirty);

  if (!file) return null;

  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    css: 'css',
    html: 'html',
    json: 'json',
    md: 'markdown',
    sh: 'shell',
  };

  const getLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop() || '';
    return languageMap[ext] || 'plaintext';
  };

  
  const updateFileContent = useProjectStore(state => state.updateFileContent);

const handleChange = (value: string | undefined) => {
  if (!value) return;

  // ✅ Update UI immediately (VERY IMPORTANT)
  console.log(value,file);
  
  updateFileContent(file.id, value);

  onContentChange(value);
  markDirty(file.id);

  // 🔥 Debounce backend save
  if (timeoutRef.current) clearTimeout(timeoutRef.current);

  timeoutRef.current = setTimeout(() => {
    socketService.updateFile(file.id, value);
  }, 400);
};

  return (
    <Editor
      height="100%"
      language={getLanguage(file.name)}
      value={file.content || ''}
      theme="vs-dark"
      onChange={handleChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        readOnly: isLoading,
      }}
    />
  );
};