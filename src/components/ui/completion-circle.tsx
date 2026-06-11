import { motion, AnimatePresence } from 'framer-motion';

interface CompletionCircleProps {
  isCompleted: boolean;
  onToggle: () => void;
  size?: number;
  color?: string;
}

export function CompletionCircle({
  isCompleted,
  onToggle,
  size = 22,
  color = 'rgb(var(--accent))',
}: CompletionCircleProps) {
  const r = (size - 2) / 2;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="flex-shrink-0 rounded-full focus-visible:outline-none"
      style={{ width: size, height: size }}
      aria-label={isCompleted ? 'Mark as pending' : 'Mark as complete'}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={isCompleted ? color : 'none'}
          stroke={isCompleted ? color : 'rgb(var(--border))'}
          strokeWidth={1.5}
          style={{ transition: 'stroke 0.2s, fill 0.2s' }}
        />

        {/* Animated fill ring on completion */}
        <AnimatePresence>
          {!isCompleted && (
            <motion.circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="transparent"
              strokeWidth={1.5}
            />
          )}
        </AnimatePresence>

        {/* Checkmark */}
        <AnimatePresence>
          {isCompleted && (
            <motion.path
              d={`M ${size * 0.28} ${size * 0.5} L ${size * 0.44} ${size * 0.66} L ${size * 0.72} ${size * 0.36}`}
              fill="none"
              stroke="white"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </svg>
    </button>
  );
}
