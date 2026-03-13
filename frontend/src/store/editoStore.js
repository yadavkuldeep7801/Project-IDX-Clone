
import { create } from 'zustand'


export const createEditorStore = create((set) => ({
    projectTree: null,
    activeFile: null,
    fileContents: {},
    setProjectTree: (tree) => set({ projectTree: tree }),
    setActiveFile: (file) => set({ activeFile: file }),
    setFileContents: (contents) => set({ fileContents: contents }),


}))


