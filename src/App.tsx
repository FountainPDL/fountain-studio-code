import { useEffect, useState } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
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
      const content = await FS.readFile(file.uri.replace('file://', ''));
      openFile(file.uri, file.name, content || '');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
      {/* Title Bar */}
      <div className="h-10 bg-[#323233] flex items-center px-3 justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-bold">FS</span>
          <span className="font-medium">Fountain Studio Code</span>
        </div>
        <div className="text-xs text-gray-400">by FountainPDL</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333337] flex flex-col items-center py-2 gap-6">
          <div className="text-blue-400">◧</div>
          <div className="text-gray-400 hover:text-white cursor-pointer">🔍</div>
          <div className="text-gray-400 hover:text-white cursor-pointer">⎇</div>
          <div className="text-gray-400 hover:text-white cursor-pointer">🧩</div>
        </div>

        {/* Sidebar - File Explorer */}
        <div className="w-72 bg-[#252526] flex flex-col border-r border-[#3c3c3c]">
          <div className="px-4 py-2 text-xs uppercase tracking-widest text-gray-400">Explorer</div>
          <div className="flex-1 overflow-auto px-2">
            {files.map((file, i) => (
              <div
                key={i}
                onClick={() => openSelectedFile(file)}
                className="flex items-center gap-2 px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer text-sm"
              >
                {file.type === 'directory' ? <FolderOpen size={16} /> : <File size={16} />}
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="h-10 bg-[#1f1f23] flex items-center overflow-x-auto border-b border-[#3c3c3c]">
            {tabs.map(tab => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-2 px-4 h-full border-r border-[#3c3c3c] min-w-[120px] hover:bg-[#2d2d2d] cursor-pointer ${activeTabId === tab.id ? 'bg-[#1e1e1e]' : 'bg-[#2d2d2d]'}`}
              >
                <span>{tab.name}</span>
                {tab.isDirty && <span className="text-blue-400">•</span>}
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                  className="opacity-0 group-hover:opacity-100 hover:bg-red-500/50 p-0.5 rounded"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {tabs.length === 0 && (
              <div className="px-4 text-gray-500">No open tabs</div>
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-[#007acc] text-xs flex items-center px-3 text-white">
        <div>Ln 1, Col 1</div>
        <div className="ml-auto">Fountain Studio Code • Powered by Monaco + Capacitor</div>
      </div>
    </div>
  );
}

export default App;
