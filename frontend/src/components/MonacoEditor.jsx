import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

function MonacoEditor({ code, language = 'javascript', onChange }) {
    const [value, setValue] = useState(code || '// Write some code here\n');

    const handleEditorChange = (newValue, event) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div style={{ height: '80vh', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
            <Editor
                height="100%"
                defaultLanguage={language}
                value={value}
                theme="vs-dark"
                onChange={handleEditorChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                }}
            />
        </div>
    );
}

export default MonacoEditor;
