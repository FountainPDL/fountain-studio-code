import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../../store/useEditorStore';

export default function MonacoEditor() {
  const { tabs, activeTabId, updateTabContent } = useEditorStore();
  const activeTab = tabs.find(t => t.id === activeTabId);

  const handleEditorChange = (value: string | undefined) => {
    if (activeTabId && value !== undefined) {
      updateTabContent(activeTabId, value);
    }
  };

  if (!activeTab) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No file opened. Open a file from the explorer.
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      language={activeTab.language}
      value={activeTab.content}
      onChange={handleEditorChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: true },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
      }}
    />
  );
}
