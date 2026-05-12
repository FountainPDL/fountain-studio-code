import { useEffect, useState } from 'react';
import MonacoEditor from './components/Editor/MonacoEditor';
import { useEditorStore } from './store/useEditorStore';
import { FS } from './utils/fs';
import { FolderOpen, File, X } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<any[]>([]);
  const { tabs, activeTabId, openFile, closeTab, setActiveTab } = useEditorStore();

  const loadFiles = async () => {
    const listed = await FS.listFiles('');
    setFiles(listed);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const openSelectedFile = async (file: any) => {
    if (file.type === 'file') {
      try {
        const content = await FS.readFile(file.name); // Simplified for now
        openFile(file.uri || file.name, file.name, content || '');
      } catch (e) {
        console.error("Failed to open file", e);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
      {/* Title Bar */}
      <div className="h-10 bg-[#323233] flex items-center px-3 justify-between select-none">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-bold text-xl">FS</span>
          <span className="font-medium">Fountain Studio Code</span>
        </div>
        <div className="text-xs text-gray-400">by FountainPDL</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333337] flex flex-col items-center py-3 gap-8 border-r border-[#1e1e1e]">
          <div className="text-blue-400 text-2xl cursor-pointer">◧</div>
          <div className="text-gray-400 hover:text-white cursor-pointer text-xl">🔍</div>
          <div className="text-gray-400 hover:text-white cursor-pointer text-xl">⎇</div>
          <div className="text-gray-400 hover:text-white cursor-pointer text-xl">🧩</div>
        </div>

        {/* Sidebar - File Explorer */}
        <div className="w-72 bg-[#252526] flex flex-col border-r border-[#3c3c3c]">
          <div className="px-4 py-2 text-xs uppercase tracking-widest text-gray-400 border-b border-[#3c3c3c]">
            EXPLORER
          </div>
          <div className="flex-1 overflow-auto p-2 text-sm">
            {files.length === 0 && <div className="text-gray-500 p-2">No files yet. Create some in Documents folder.</div>}
            {files.map((file, i) => (
              <div
                key={i}
                onClick={() => openSelectedFile(file)}
                className="flex items-center gap-2 px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer rounded"
              >
                {file.type === 'directory' ? <FolderOpen size={18} /> : <File size={18} />}
                <span className="truncate">{file.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs Bar */}
          <div className="h-11 bg-[#1f1f23] flex items-center overflow-x-auto border-b border-[#3c3c3c]">
            {tabs.map(tab => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-2 px-4 h-full border-r border-[#3c3c3c] min-w-[140px] hover:bg-[#2d2d2d] cursor-pointer ${activeTabId === tab.id ? 'bg-[#1e1e1e] text-white' : 'bg-[#2d2d2d] text-gray-400'}`}
              >
                <span className="truncate">{tab.name}</span>
                {tab.isDirty && <span className="text-blue-400">●</span>}
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                  className="ml-auto opacity-0 group-hover:opacity-100 hover:bg-[#5a5d5e] p-1 rounded hover:text-red-400"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
            {tabs.length === 0 && (
              <div className="px-4 text-gray-500 italic">Open a file from the sidebar</div>
            )}
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
            <MonacoEditor />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-[#007acc] text-white text-xs flex items-center px-3 select-none">
        <div>Ln 1, Col 1 • Spaces: 2 • UTF-8</div>
        <div className="ml-auto">Fountain Studio Code • FountainPDL</div>
      </div>
    </div>
  );
}

export default App;
