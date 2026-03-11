import { cn } from 'lib/helpers';
import { useState } from 'react';
import { useFrame } from 'lib/hooks/useFrame';

interface ToggleProps {
  /** Whether the toggle is currently on */
  showToggle: boolean;
  /** Function to handle toggle state changes */
  handleFunction: (checked: boolean) => void;
  /** Text to display when toggle is on */
  onState: string;
  /** Text to display when toggle is off */
  offState: string;
  /** Optional ID for the toggle description element */
  toggleDescriptionId?: string;
  /** Optional aria-label for the checkbox input */
  ariaLabel?: string;
  /** Optional className for additional styling */
  className?: string;
  /** Whether to show announcement text for screen readers */
  showAnnouncement?: boolean;
  /** Custom announcement prefix (defaults to "Filter changed to: ") */
  announcementPrefix?: string;
}

export const Toggle = ({
  showToggle,
  handleFunction,
  onState,
  offState,
  toggleDescriptionId = 'toggle-description',
  ariaLabel,
  className = '',
  showAnnouncement = false,
  announcementPrefix = 'Filter changed to: ',
}: ToggleProps) => {
  const [announceText, setAnnounceText] = useState('');
  const { effectiveTheme } = useFrame();

  const handleToggleChange = (checked: boolean) => {
    handleFunction(checked);

    if (showAnnouncement) {
      const newText = checked ? onState : offState;
      setAnnounceText(`${announcementPrefix}${newText}`);
      // Clear announcement after a short delay
      setTimeout(() => setAnnounceText(''), 1000);
    }
  };

  const displayText = showToggle ? onState : offState;
  const toggleAriaLabel = ariaLabel || displayText;

  // Theme-based color configuration
  const getToggleColors = () => {
    switch (effectiveTheme) {
      case 'primary':
        return {
          on: 'bg-tertiary',
          off: 'bg-gray-300',
          knob: 'bg-secondary',
        };
      case 'secondary':
        return {
          on: 'bg-tertiary',
          off: 'bg-gray-400',
          knob: 'bg-primary',
        };
      case 'tertiary':
        return {
          on: 'bg-secondary',
          off: 'bg-gray-300',
          knob: 'bg-primary',
        };
      default:
        return {
          on: 'bg-secondary',
          off: 'bg-gray-300',
          knob: 'bg-secondary',
        };
    }
  };

  const colors = getToggleColors();

  return (
    <>
      <div className={`mb-3 flex items-center gap-3 ${className}`}>
        <label className="flex cursor-pointer items-center gap-3">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={showToggle}
              onChange={(e) => handleToggleChange(e.target.checked)}
              aria-describedby={toggleDescriptionId}
              aria-label={toggleAriaLabel}
            />
            <div
              className={cn(
                'h-6 w-12 rounded-full transition-colors duration-200 ease-in-out',
                showToggle ? colors.on : colors.off
              )}
              role="presentation"
            >
              <div
                className={cn(
                  'h-5 w-5 translate-y-0.5 transform rounded-full shadow-md transition-transform duration-200 ease-in-out',
                  showToggle ? 'translate-x-6' : 'translate-x-0.5',
                  colors.knob
                )}
                role="presentation"
              />
            </div>
          </div>
          <span
            id={toggleDescriptionId}
            className="text-lg font-medium"
            aria-live="polite"
            aria-atomic="true"
          >
            {displayText}
          </span>
        </label>
      </div>

      {/* Screen reader announcement region */}
      {showAnnouncement && (
        <div aria-live="assertive" aria-atomic="true" className="sr-only" role="status">
          {announceText}
        </div>
      )}
    </>
  );
};
