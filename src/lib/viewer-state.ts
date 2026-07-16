export interface Point { x: number; y: number }
export interface Size { width: number; height: number }

export interface ViewerState extends Point {
  scale: number;
  mode: 'fit' | 'manual';
}

export type ViewerAction =
  | { type: 'zoom-to'; scale: number; point: Point }
  | { type: 'pan'; dx: number; dy: number }
  | { type: 'reset' }
  | { type: 'fit'; transform: ViewerState };

export const MIN_VIEWER_SCALE = 0.1;
export const MAX_VIEWER_SCALE = 8;
export const initialViewerState: ViewerState = { scale: 1, x: 0, y: 0, mode: 'manual' };

const clampScale = (scale: number) => Math.min(MAX_VIEWER_SCALE, Math.max(MIN_VIEWER_SCALE, scale));

export function zoomAtPoint(state: ViewerState, requestedScale: number, point: Point): ViewerState {
  const scale = clampScale(requestedScale);
  const ratio = scale / state.scale;
  return {
    scale,
    x: point.x - (point.x - state.x) * ratio,
    y: point.y - (point.y - state.y) * ratio,
    mode: 'manual',
  };
}

export function fitTransform(content: Size, viewport: Size, padding = 48): ViewerState {
  const availableWidth = Math.max(1, viewport.width - padding * 2);
  const availableHeight = Math.max(1, viewport.height - padding * 2);
  const scale = Math.min(1, availableWidth / content.width, availableHeight / content.height);
  return {
    scale,
    x: (viewport.width - content.width * scale) / 2,
    y: (viewport.height - content.height * scale) / 2,
    mode: 'fit',
  };
}

export function viewerReducer(state: ViewerState, action: ViewerAction): ViewerState {
  if (action.type === 'reset') return initialViewerState;
  if (action.type === 'fit') return action.transform;
  if (action.type === 'pan') {
    return { ...state, x: state.x + action.dx, y: state.y + action.dy, mode: 'manual' };
  }
  return zoomAtPoint(state, action.scale, action.point);
}
