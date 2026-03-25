import React from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { FileNode } from '../../types';
import { cn } from '../../utils';

interface FileTreeProps {
  files: FileNode[];
  onFileClick: (file: FileNode) => void;
  onToggleFolder: (folderId: string) => void;
  selectedFileId?: string;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  onFileClick,
  onToggleFolder,
  selectedFileId,
}) => {
  const renderNode = (node: FileNode, depth: number = 0) => {
    const isSelected = selectedFileId === node.id;
    const isFolder = node.type === 'directory';

    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center py-1 px-2 cursor-pointer hover:bg-white/5 text-sm transition-colors",
            isSelected && "bg-white/10 text-white",
            !isSelected && "text-zinc-400"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => (isFolder ? onToggleFolder(node.id) : onFileClick(node))}
        >
          {isFolder ? (
            <>
              {node.isOpen ? (
                <ChevronDown className="w-4 h-4 mr-1.5 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1.5 shrink-0" />
              )}
              <Folder className="w-4 h-4 mr-1.5 text-blue-400 shrink-0" />
            </>
          ) : (
            <>
              <div className="w-4 h-4 mr-1.5 shrink-0" />
              <File className="w-4 h-4 mr-1.5 text-zinc-500 shrink-0" />
            </>
          )}
          <span className="truncate">{node.name}</span>
        </div>
        {isFolder && node.isOpen && node.children && (
          <div>{node.children.map((child) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return <div className="py-2">{files.map((file) => renderNode(file))}</div>;
};
