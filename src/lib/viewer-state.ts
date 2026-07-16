export interface ViewerState {
  scale: number;
}

export type ViewerAction =
  | { type: 'zoom-in' }
  | { type: 'zoom-out' }
  | { type: 'reset' }
  | { type: 'fit' };

export const initialViewerState: ViewerState = { scale: 1 };

export function viewerReducer(state: ViewerState, action: ViewerAction): ViewerState {
  if (action.type === 'reset' || action.type === 'fit') return initialViewerState;
  const delta = action.type === 'zoom-in' ? 0.25 : -0.25;
  return { scale: Math.min(4, Math.max(0.5, state.scale + delta)) };
}
