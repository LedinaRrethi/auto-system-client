import { useRef, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  title?: string;
  titleIcon?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  showCloseButton = true,
  isFullscreen = false,
  title,
  titleIcon,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-lg p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`
          relative w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl mx-2 sm:mx-4
          ${isFullscreen 
            ? 'h-full max-w-none sm:h-[95vh] sm:max-w-7xl' 
            : 'max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[95vh] sm:max-h-[90vh]'
          }
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - sticky */}
        {(title || titleIcon || showCloseButton) && (
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 rounded-t-2xl px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6 pb-3 border-b border-gray-200 dark:border-gray-700">
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1 sm:p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-xl sm:text-2xl font-bold transition-colors touch-manipulation rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close modal"
              >
                &times;
              </button>
            )}
            
            <div className="flex items-center gap-2 sm:gap-3 mb-3 pr-8 sm:pr-12">
              {titleIcon && (
                <span className="text-lg sm:text-xl lg:text-2xl flex-shrink-0">
                  {titleIcon}
                </span>
              )}
              <h2 className="text-base sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white truncate">
                {title ?? "Modal Title"}
              </h2>
            </div>
          </div>
        )}

        {/* Content - scrollable */}
        <div 
          className={`
            overflow-y-auto px-3 sm:px-6 lg:px-8 pb-3 sm:pb-6
            ${title || titleIcon || showCloseButton 
              ? isFullscreen 
                ? 'h-[calc(100%-70px)] sm:h-[calc(95vh-80px)]'
                : 'max-h-[calc(95vh-70px)] sm:max-h-[calc(90vh-80px)]'
              : isFullscreen 
                ? 'h-full sm:h-[95vh]'
                : 'max-h-[95vh] sm:max-h-[90vh]'
            }
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
