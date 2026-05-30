import { useReducer, useCallback } from "react";
import { GridState, GridAction, Features, Widget } from "@/types/playground";
import { INITIAL, resolveCollisions, compactVertical, redistributeWidgets } from "./grid-utils";

const DEFAULT_FEATURES: Features = {
  drag: true, resize: true, collision: true, bounds: true, animate: true,
  snap: false, keyboard: false, lock: false, undoRedo: false,
  dropZone: false, compact: false, responsive: false,
};

const initialState: GridState = {
  widgets: INITIAL,
  history: [],
  historyIdx: -1,
  activeId: null,
  focusedId: null,
  liveSize: null,
  features: DEFAULT_FEATURES,
  cols: 4,
};

function applyCollisionAndCompact(widgets: Widget[], id: string, features: Features): Widget[] {
  let result = widgets;
  if (features.collision) result = resolveCollisions(result, id);
  if (features.compact) result = compactVertical(result);
  return result;
}

function pushToHistory(state: GridState, widgets: Widget[]): Pick<GridState, "history" | "historyIdx"> {
  if (!state.features.undoRedo) return { history: state.history, historyIdx: state.historyIdx };
  const newHistory = [...state.history.slice(0, state.historyIdx + 1), widgets.map(w => ({ ...w }))];
  return { history: newHistory, historyIdx: state.historyIdx + 1 };
}

function gridReducer(state: GridState, action: GridAction): GridState {
  switch (action.type) {
    case "MOVE": {
      const updated = state.widgets.map(w => w.id === action.id ? { ...w, x: action.x, y: action.y } : w);
      const resolved = applyCollisionAndCompact(updated, action.id, state.features);
      return { ...state, widgets: resolved, activeId: null, liveSize: null, ...pushToHistory(state, resolved) };
    }
    case "RESIZE": {
      const updated = state.widgets.map(w => w.id === action.id ? { ...w, x: action.x, y: action.y, w: action.w, h: action.h } : w);
      const resolved = applyCollisionAndCompact(updated, action.id, state.features);
      return { ...state, widgets: resolved, activeId: null, liveSize: null, ...pushToHistory(state, resolved) };
    }
    case "ADD": {
      const resolved = applyCollisionAndCompact([...state.widgets, action.widget], action.widget.id, state.features);
      return { ...state, widgets: resolved, ...pushToHistory(state, resolved) };
    }
    case "REMOVE": {
      const filtered = state.widgets.filter(w => w.id !== action.id);
      return { ...state, widgets: filtered, ...pushToHistory(state, filtered) };
    }
    case "SET_ALL":
      return { ...state, widgets: action.widgets };
    case "UNDO": {
      if (state.historyIdx <= 0) return state;
      return { ...state, widgets: state.history[state.historyIdx - 1], historyIdx: state.historyIdx - 1 };
    }
    case "REDO": {
      if (state.historyIdx >= state.history.length - 1) return state;
      return { ...state, widgets: state.history[state.historyIdx + 1], historyIdx: state.historyIdx + 1 };
    }
    case "SET_ACTIVE":
      return { ...state, activeId: action.id };
    case "SET_FOCUSED":
      return { ...state, focusedId: action.id };
    case "SET_LIVE_SIZE":
      return { ...state, liveSize: action.size };
    case "SET_FEATURES":
      return { ...state, features: action.features };
    case "TOGGLE_FEATURE":
      return { ...state, features: { ...state.features, [action.key]: !state.features[action.key] } };
    case "SET_COLS":
      return { ...state, cols: action.cols, widgets: action.widgets };
    default:
      return state;
  }
}

export function useGridState() {
  const [state, dispatch] = useReducer(gridReducer, initialState);

  const handleSetCols = useCallback((newCols: number) => {
    dispatch({ type: "SET_COLS", cols: newCols, widgets: redistributeWidgets(state.widgets, newCols) });
  }, [state.widgets]);

  return { state, dispatch, handleSetCols };
}
