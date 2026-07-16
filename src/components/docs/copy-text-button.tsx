'use client';

import { Check, Copy } from 'lucide-react';
import { useRef, useState } from 'react';

interface CopyTextButtonProps {
  text: string;
  label?: string;
}

export function CopyTextButton({ text, label = '复制内容' }: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copyText() {
    if (!navigator.clipboard) return;

    await navigator.clipboard.writeText(text.trim());
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      className="docs-copy-text"
      aria-label={copied ? '已复制' : label}
      onClick={copyText}
    >
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      <span aria-live="polite">{copied ? '已复制' : '复制'}</span>
    </button>
  );
}
