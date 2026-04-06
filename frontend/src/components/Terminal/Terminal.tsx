import React, { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from 'lucide-react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useProjectStore } from '../../store/useProjectStore';
import 'xterm/css/xterm.css';

interface TerminalProps {
  onClose?: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onClose }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
 const  projectId = useProjectStore((state) => state.projectId);

  useEffect(() => {
    if (!terminalRef.current) return;

    const xterm = new XTerm({
       cursorBlink: true,
      fontSize: 12,
      fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
      theme: {
        background: '#0d1117',
        foreground: '#e6edf3',
        cursor: '#58a6ff',
        selectionBackground: '#30363d',
        black: '#010409',
        red: '#ff7b72',
        green: '#3fb950',
        yellow: '#d29922',
        blue: '#58a6ff',
        magenta: '#bc8cff',
        cyan: '#39c5cf',
        white: '#ffffff',
      },
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = xterm;

  
    const socket = new WebSocket(`ws://localhost:5000/terminal?projectId=${projectId}`);
    socketRef.current = socket;

    
    socket.onopen = () => {
      
      xterm.writeln("sandbox ready. Type your commands below: cd/sandbox && ls");
    };

        socket.onmessage = (event) => {
      xterm.write(event.data);
    };

    
    xterm.onData((data) => {
      socket.send(data);
    });

    const handleResize = () => {
      fitAddon.fit();

      socket.send(
        JSON.stringify({
          type: "resize",
          cols: xterm.cols,
          rows: xterm.rows,
        })
      );
    };

    window.addEventListener("resize", handleResize);

    
    return () => {
      window.removeEventListener("resize", handleResize);
      socket.close();
      xterm.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-t border-white/10 font-mono text-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2 text-zinc-400">
          <TerminalIcon className="w-4 h-4 " />
          <span className="text-xs font-medium uppercase tracking-wider">Terminal</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-zinc-500 hover:text-zinc-300">
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button className="text-zinc-500 hover:text-zinc-300">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button onClick={onClose} className="text-zinc-500 hover:text-rose-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 p-2 overflow-hidden bg-[#0d1117]">
        <div ref={terminalRef} className="h-full w-full" />
      </div>
    </div>
  );
};