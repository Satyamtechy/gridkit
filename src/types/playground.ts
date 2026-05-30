export interface Widget {
  id: string;
  title: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
  value: string;
}

export interface Features {
  drag: boolean;
  resize: boolean;
  collision: boolean;
  bounds: boolean;
  animate: boolean;
  snap: boolean;
  keyboard: boolean;
  lock: boolean;
  undoRedo: boolean;
  dropZone: boolean;
  compact: boolean;
  responsive: boolean;
}

export interface LiveSize {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type GridAction =
  | { type: "MOVE"; id: string; x: number; y: number }
  | { type: "RESIZE"; id: string; x: number; y: number; w: number; h: number }
  | { type: "ADD"; widget: Widget }
  | { type: "REMOVE"; id: string }
  | { type: "SET_ALL"; widgets: Widget[] }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET_ACTIVE"; id: string | null }
  | { type: "SET_FOCUSED"; id: string | null }
  | { type: "SET_LIVE_SIZE"; size: LiveSize | null }
  | { type: "SET_FEATURES"; features: Features }
  | { type: "TOGGLE_FEATURE"; key: keyof Features }
  | { type: "SET_COLS"; cols: number; widgets: Widget[] };

export interface GridState {
  widgets: Widget[];
  history: Widget[][];
  historyIdx: number;
  activeId: string | null;
  focusedId: string | null;
  liveSize: LiveSize | null;
  features: Features;
  cols: number;
}
