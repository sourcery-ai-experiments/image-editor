import { create } from 'zustand';

interface CanvasState {
	canvas: fabric.Canvas | null;
	setCanvas: (canvas: fabric.Canvas | null) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
	canvas: null,
	setCanvas: (canvas: fabric.Canvas | null) => set({ canvas }),
}));
