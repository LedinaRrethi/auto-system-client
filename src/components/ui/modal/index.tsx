import { useRef, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  showCloseButton = true,
  title,
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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-lg">
      <div
        ref={modalRef}
        className={`relative w-full max-w-lg h-[80vh] mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - sticky */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 rounded-t-2xl px-6 sm:px-8 pt-6 pb-3 border-b border-gray-200">
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-white text-2xl font-bold"
            >
              &times;
            </button>
          )}
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">{title ?? "Modal Title"}</h2>
        </div>

        {/* Content - scrollable */}
        <div className="overflow-visible h-[calc(80vh-72px)] px-6 sm:px-8 pb-6 no-scrollbar">{children}</div>
      </div>
    </div>
  );
};
