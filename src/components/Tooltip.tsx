import { Info } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const spaceAbove = triggerRect.top;
      const spaceBelow = window.innerHeight - triggerRect.bottom;

      // Show below if not enough space above
      setPosition(spaceAbove < tooltipHeight + 10 && spaceBelow > tooltipHeight + 10 ? 'bottom' : 'top');
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block" ref={triggerRef}>
      <div
        className="inline-flex items-center cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
      >
        {children || <Info className="w-4 h-4 text-neutral-400 hover:text-primary transition-colors" />}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-64 px-3 py-2 text-sm text-white bg-neutral-900 rounded-lg shadow-lg ${
            position === 'top' 
              ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' 
              : 'top-full mt-2 left-1/2 -translate-x-1/2'
          }`}
          style={{ pointerEvents: 'none' }}
        >
          <div className="relative">
            {content}
            <div
              className={`absolute w-2 h-2 bg-neutral-900 rotate-45 left-1/2 -translate-x-1/2 ${
                position === 'top' ? 'bottom-[-4px]' : 'top-[-4px]'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
