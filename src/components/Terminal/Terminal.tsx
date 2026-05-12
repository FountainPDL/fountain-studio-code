import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export default function AppTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const t = new Terminal({
      theme: { background: '#1e1e1e', foreground: '#d4d4d4' },
      fontSize: 14,
      cursorBlink: true,
    });
    const fitAddon = new FitAddon();
    t.loadAddon(fitAddon);

    t.open(terminalRef.current);
    fitAddon.fit();

    t.writeln('Welcome to Fountain Studio Code Terminal');
    t.writeln('Type "help" for commands\r\n');

    term.current = t;

    return () => t.dispose();
  }, []);

  return <div ref={terminalRef} className="h-full w-full bg-[#1e1e1e]" />;
}
