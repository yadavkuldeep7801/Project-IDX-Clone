import React, { useState } from 'react';
import MonacoEditor from './components/MonacoEditor';
import './App.css';

import {createEditorStore} from './store/editoStore';




// Helper function to get language based on extension
const getLanguageFromPath = (path) => {
  if (!path) return 'plaintext';
  if (path.endsWith('.js') || path.endsWith('.jsx')) return 'javascript';
  if (path.endsWith('.ts') || path.endsWith('.tsx')) return 'typescript';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.md')) return 'markdown';
  if (path.endsWith('.html')) return 'html';
  return 'plaintext';
};

function App() {
  const [projectTree, setProjectTree] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContents, setFileContents] = useState({});
  const [loading, setLoading] = useState(false);

  const generateProject = async (type) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/project/create-react-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectType: type }),
      });

      const data = await response.json();

      if (data.projectTree) {
        setProjectTree(data.projectTree);
        createEditorStore.setProjectTree(data.projectTree);
        createEditorStore.setActiveFile(null);
        // Reset file contents when new project is created
        createEditorStore.setFileContents({});
      } else {
        alert("Failed to create project: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error talking to backend!");
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = (path, type) => {
    if (type === 'file') {
      setActiveFile(path);
      // If we haven't mocked this file yet, put a placeholder
      if (!fileContents[path]) {
        setFileContents(prev => ({
          ...prev,
          [path]: `// Currently viewing: ${path.split('/').pop()}\n// Note: To actually read file contents from the drive,\n// you would need another backend API endpoint to read the file.`
        }));
      }
    }
  };

  const handleEditorChange = (newValue) => {
    if (activeFile) {
      setFileContents(prev => ({
        ...prev,
        [activeFile]: newValue
      }));
    }
  };

  // Recursive component to render the file tree
  const FileTree = ({ nodes, depth = 0 }) => {
    // If it's a single file, nodes might just be the object, but directory-tree returns an array for children
    if (!Array.isArray(nodes)) return null;

    return (
      <div>
        {nodes.map((node, index) => {
          const isFile = node.type === 'file';
          return (
            <div key={node.path || index}>
              <div
                className={`file-item ${activeFile === node.path ? 'active' : ''}`}
                style={{ paddingLeft: `${15 + depth * 15}px`, opacity: isFile ? 0.9 : 1 }}
                onClick={() => handleFileClick(node.path, isFile ? 'file' : 'directory')}
              >
                <span style={{ marginRight: '8px' }}>
                  {isFile ? '📄' : '📁'}
                </span>
                {node.name}
              </div>
              {
                !isFile && node.children && (
                  <FileTree nodes={node.children} depth={depth + 1} />
                )
              }
            </div>
          );
        })}
      </div >
    );
  };

  const currentCode = activeFile && fileContents[activeFile] !== undefined ? fileContents[activeFile] : '';
  const currentLanguage = activeFile ? getLanguageFromPath(activeFile) : 'plaintext';

  
  return (
    <div className="App">
      {/* Sidebar for File Explorer */}
      <div className="sidebar">
        <div className="sidebar-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
          <div>EXPLORER</div>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button
              onClick={() => generateProject('react')}
              disabled={loading}
              style={{ padding: '6px', cursor: 'pointer', background: '#238636', color: 'white', border: 'none', borderRadius: '4px', flex: 1 }}
            >
              {loading ? 'Creating...' : '+ React'}
            </button>
            <button
              onClick={() => generateProject('nextjs')}
              disabled={loading}
              style={{ padding: '6px', cursor: 'pointer', background: '#238636', color: 'white', border: 'none', borderRadius: '4px', flex: 1 }}
            >
              {loading ? 'Creating...' : '+ Next.js'}
            </button>
          </div>
        </div>
        <div className="file-explorer">
          {projectTree ? (
            <div style={{ padding: '10px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#8b949e', textTransform: 'uppercase', fontSize: '12px' }}>
                {projectTree.name}
              </div>
              {projectTree.children && <FileTree nodes={projectTree.children} />}
            </div>
          ) : (
            <div style={{ padding: '20px', color: '#8b949e', fontSize: '14px', textAlign: 'center' }}>
              Click a button above to generate a new project via the backend!
            </div>
          )}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="editor-container">
        {activeFile ? (
          <>
            <div className="editor-header">
              <div className="tab active">
                {activeFile.split(/\\|\//).pop()}
              </div>
            </div>
            <div className="monaco-wrapper">
              <MonacoEditor
                key={activeFile}
                code={currentCode}
                language={currentLanguage}
                onChange={handleEditorChange}
              />
            </div>
          </>
        ) : (
          <div className="empty-state">
            {projectTree ? (
              <>
                <h2>Generated '{projectTree.name}'</h2>
                <p style={{ marginTop: '10px' }}>Select a file from the explorer on the left to start editing.</p>
              </>
            ) : (
              <>
                <h2>Welcome to your Project Workspace</h2>
                <p style={{ marginTop: '10px' }}>Start by generating a backend project.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
