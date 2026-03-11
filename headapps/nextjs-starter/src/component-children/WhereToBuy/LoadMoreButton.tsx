interface LoadMoreButtonProps {
  onClick: () => void;
  label: string;
  buttonColorClass: string;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onClick,
  label,
  buttonColorClass,
}) => {
  return (
    <div className="flex justify-center pt-4">
      <button
        onClick={onClick}
        className={`px-6 py-3 ${buttonColorClass} rounded-md bg-button-surface text-sm font-medium text-content transition-colors hover:bg-button-surface/90`}
      >
        {label}
      </button>
    </div>
  );
};
