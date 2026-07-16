import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface SourcesDisclosureProps {
  children: ReactNode;
  label?: string;
}

export function SourcesDisclosure({ children, label = '资料与注释' }: SourcesDisclosureProps) {
  return (
    <details className="docs-sources-disclosure">
      <summary>
        <span>{label}</span>
        <ChevronDown aria-hidden="true" />
      </summary>
      <div>{children}</div>
    </details>
  );
}
