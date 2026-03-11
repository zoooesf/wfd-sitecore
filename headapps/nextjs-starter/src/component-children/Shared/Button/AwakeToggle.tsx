'use client';

import { cn } from 'lib/helpers';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useFrame } from 'lib/hooks/useFrame';

interface AwakeToggleProps {
  /** Optional className for additional styling */
  className?: string;
}

/**
 * A self-contained toggle that uses the Screen Wake Lock API to prevent
 * the screen from sleeping while enabled. Automatically re-acquires the
 * wake lock if the page becomes visible again after being hidden.
 * @param {AwakeToggleProps} props - Component props
 * @returns {JSX.Element} The rendered wake lock toggle
 */
export const AwakeToggle = ({ className = '' }: AwakeToggleProps) => {
  const [isAwake, setIsAwake] = useState(false);
  const [isSupported] = useState(() => 'wakeLock' in navigator);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const { effectiveTheme } = useFrame();

  const acquireWakeLock = useCallback(async () => {
    if (!isSupported) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
    } catch {
      setIsAwake(false);
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAwake) {
      acquireWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => {
      releaseWakeLock();
    };
  }, [isAwake, acquireWakeLock, releaseWakeLock]);

  useEffect(() => {
    if (!isAwake) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        acquireWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAwake, acquireWakeLock]);

  const getToggleColors = () => {
    switch (effectiveTheme) {
      case 'primary':
        return { on: 'bg-tertiary', off: 'bg-gray-300', knob: 'bg-secondary' };
      case 'secondary':
        return { on: 'bg-tertiary', off: 'bg-gray-400', knob: 'bg-primary' };
      case 'tertiary':
        return { on: 'bg-secondary', off: 'bg-gray-300', knob: 'bg-primary' };
      default:
        return { on: 'bg-secondary', off: 'bg-gray-300', knob: 'bg-secondary' };
    }
  };

  const colors = getToggleColors();
  const label = isAwake ? 'Screen awake' : 'Keep awake';

  if (!isSupported) return null;

  return (
    <div className={`mb-3 flex items-center gap-3 ${className}`}>
      <label className="flex cursor-pointer items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={isAwake}
            onChange={(e) => setIsAwake(e.target.checked)}
            aria-label={label}
          />
          <div
            className={cn(
              'h-6 w-12 rounded-full transition-colors duration-200 ease-in-out',
              isAwake ? colors.on : colors.off
            )}
            role="presentation"
          >
            <div
              className={cn(
                'h-5 w-5 translate-y-0.5 transform rounded-full shadow-md transition-transform duration-200 ease-in-out',
                isAwake ? 'translate-x-6' : 'translate-x-0.5',
                colors.knob
              )}
              role="presentation"
            />
          </div>
        </div>
        <span className="text-lg font-medium" aria-live="polite" aria-atomic="true">
          {label}
        </span>
      </label>
    </div>
  );
};
