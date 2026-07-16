'use client';

import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'ai-tutorials:toc-collapsed';
const CHANGE_EVENT = 'ai-tutorials:toc-preference-change';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === 'true';
}

function getServerSnapshot() {
  return false;
}

function setCollapsed(value: boolean) {
  window.localStorage.setItem(STORAGE_KEY, String(value));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function DocsTocHeader() {
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className="docs-toc-header" data-collapsed={collapsed}>
      <span>本文导航</span>
      <button
        type="button"
        aria-controls="nd-toc"
        aria-expanded={!collapsed}
        aria-label={collapsed ? '展开本文导航' : '折叠本文导航'}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <PanelRightOpen aria-hidden="true" /> : <PanelRightClose aria-hidden="true" />}
      </button>
    </div>
  );
}
