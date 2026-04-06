import React, { useState } from 'react';

interface WebPreviewProps {
  url?: string;
  onClose?: () => void;
}



export const WebPreview: React.FC<WebPreviewProps> = ({ 
  url = 'http://localhost:32854/', 
  onClose 
}) => {
  const [currentUrl, setCurrentUrl] = useState(url);
  

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-l border-white/10">
      <iframe 
        src={currentUrl}
        className="flex-1 border-0"
        title="Web Preview"
      />
    </div>
  );
};