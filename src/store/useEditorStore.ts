import { create } from 'zustand';

export interface Tab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
}

interface EditorStore {
  tabs: Tab[];
  activeTabId: string | null;
  openFile: (path: string, name: string, content: string) => void;
  closeTab: (id: string) => void;
  updateTabContent: (id: string, content: string) => void;
  setActiveTab: (id: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  tabs: [],
  activeTabId: null,
  openFile: (path, name, content) => 
    set((state) => {
      const existing = state.tabs.find(t => t.path === path);
      if (existing) return { activeTabId: existing.id };
      
      const newTab: Tab = {
        id: Date.now().toString(),
        name,
        path,
        content,
        language: name.split('.').pop() || 'plaintext',
        isDirty: false,
      };
      return {
        tabs: [...state.tabs, newTab],
        activeTabId: newTab.id,
      };
    }),
  closeTab: (id) => 
    set((state) => {
      const newTabs = state.tabs.filter(t => t.id !== id);
      return {
        tabs: newTabs,
        activeTabId: state.activeTabId === id 
          ? (newTabs.length > 0 ? newTabs[0].id : null)
          : state.activeTabId
      };
    }),
  updateTabContent: (id, content) =>
    set((state) => ({
      tabs: state.tabs.map(tab =>
        tab.id === id ? { ...tab, content, isDirty: true } : tab
      )
    })),
  setActiveTab: (id) => set({ activeTabId: id }),
}));
