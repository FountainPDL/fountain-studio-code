import { useEffect, useState } from 'react';
import MonacoEditor from './components/Editor/MonacoEditor';
import { useEditorStore } from './store/useEditorStore';
import { FS } from './utils/fs';
import { FolderOpen, File, X, Plus, Terminal as TermIcon, Settings } from 'lucide-react';
import AppTerminal from './components/Terminal/Terminal';

function App() {
  const [files, setFiles] = useState<any[]>([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const { tabs, activeTabId, openFile, closeTab, setActiveTab, updateTabContent } = useEditorStore();

  const loadFiles = async () => {
    const listed = await FS.listFiles('');
    setFiles(listed);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleOpenFile = async (file: any) => {
    if (file.type === 'file') {
      const content = await FS.readFile(file.name);
      openFile(file.name, file.name, content);
    }
  };

  const createNewFile = async () => {
    if (!newFileName) return;
    const success = await FS.createFile(newFileName, '// Welcome to Fountain Studio Code\n');
    if (success) {
      const content = await FS.readFile(newFileName);
      openFile(newFileName, newFileName, content);
      setNewFileName('');
      loadFiles();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white overflow-hidden font-mono">
      {/* Title Bar */}
      <div className="h-11 bg-[#323233] flex items-center px-4 justify-between select-none border-b border-[#1e1e1e]">
        <div className="flex items-center gap-3">
          <span className="text-blue-400 font-bold text-2xl">FS</span>
          <span>Fountain Studio Code</span>
          <span className="text-xs text-gray-500">by FountainPDL</span>
        </div>
        <div className="flex items-center gap-4 text-lg">
          <button onClick={() => setShowTerminal(!showTerminal)}><TermIcon size={20} /></button>
          <Settings size={20} className="cursor-pointer" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-14 bg-[#333337] flex flex-col items-center py-4 gap-8 border-r border-[#202020]">
          <div className="text-blue-400 text-3xl">◧</div>
          <div className="text-gray-400 hover:text-white cursor-pointer">🔍</div>
          <div className="text-gray-400 hover:text-white cursor-pointer">⎇</div>
          <div className="text-gray-400 hover:text-white cursor-pointer">🧩</div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-[#252526] flex flex-col border-r border-[#3c3c3c]">
          <div className="px-4 py-2 text-xs uppercase tracking-widest border-b border-[#3c3c3c] flex justify-between">
            <span>EXPLORER</span>
            <Plus size={18} className="cursor-pointer" onClick={() => document.getElementById('newfile')?.focus()} />
          </div>

          <div className="p-2">
            <input
              id="newfile"
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createNewFile()}
              placeholder="New file name (e.g. index.js)"
              className="w-full bg-[#3c3c3c] px-3 py-1 text-sm outline-none rounded"
            />
          </div>

          <div className="flex-1 overflow-auto p-2 text-sm">
            {files.map((file, i) => (
              <div
                key={i}
                onClick={() => handleOpenFile(file)}
                className="flex items-center gap-2 px-3 py-1 hover:bg-[#2a2d2e] cursor-pointer rounded mb-0.5"
              >
                {file.type === 'directory' ? <FolderOpen size={18} /> : <File size={18} />}
                <span className="truncate">{file.name}</span>
              </div>
            ))}
            {files.length === 0 && (
              <div className="text-gray-500 p-4 text-center">
                No files yet.<br />Create one above.
              </div>
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="h-11 bg-[#1f1f23] flex overflow-x-auto border-b border-[#3c3c3c]">
            {tabs.map(tab => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex-shrink-0 flex items-center gap-2 px-4 h-full border-r border-[#3c3c3c] min-w-[160px] hover:bg-[#2d2d2d] cursor-pointer ${activeTabId === tab.id ? 'bg-[#1e1e1e]' : 'bg-[#2d2d2d]'}`}
              >
                <span className="truncate max-w-[140px]">{tab.name}</span>
                {tab.isDirty && <span className="text-blue-400">●</span>}
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                  className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/30 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Monaco */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor />
          </div>

          {/* Bottom Terminal */}
          {showTerminal && (
            <div className="h-80 border-t border-[#3c3c3c] bg-[#1e1e1e]">
              <AppTerminal />
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-[#007acc] text-xs flex items-center px-3 text-white select-none">
        <div>Ln 1, Col 1 • UTF-8 • JavaScript</div>
        <div className="ml-auto">Fountain Studio Code — FountainPDL</div>
      </div>
    </div>
  );
}

export default App;
