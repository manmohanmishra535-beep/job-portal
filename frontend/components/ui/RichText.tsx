import { cn } from '@/lib/utils';

/**
 * Lightweight renderer for the static cheat-sheet / model-answer copy.
 * Supports line breaks, **bold** emphasis and `inline code`.
 */
export default function RichText({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1.5 text-sm leading-relaxed text-slate-300', className)}>
      {content.split('\n').map((line, i) => {
        if (line.trim() === '') return <div key={i} className="h-2" />;
        return (
          <p key={i}>
            {line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={j} className="font-semibold text-white">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
                return (
                  <code
                    key={j}
                    className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px] text-cyan-200"
                  >
                    {part.slice(1, -1)}
                  </code>
                );
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}
