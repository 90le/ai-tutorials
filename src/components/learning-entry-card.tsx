import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type LearningEntryCardProps = {
  title: string;
  description: string;
  href: string;
  priority?: boolean;
};

export function LearningEntryCard({
  title,
  description,
  href,
  priority = false,
}: LearningEntryCardProps) {
  return (
    <Link
      href={href}
      className={`learning-entry-card ${priority ? 'learning-entry-card-priority' : ''}`}
    >
      <span className="learning-entry-card-icon" aria-hidden="true">
        <ArrowUpRight size={18} strokeWidth={1.75} />
      </span>
      <span className="learning-entry-card-copy">
        <span className="learning-entry-card-title">{title}</span>
        <span className="learning-entry-card-description">{description}</span>
      </span>
    </Link>
  );
}
