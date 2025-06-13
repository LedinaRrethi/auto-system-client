import { useRef, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className = "", showCloseButton = true }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Escape closes modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent scroll when modal is open
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
        className={`relative w-full max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-white text-2xl font-bold"
          >
            &times;
          </button>
        )}
        {children}
      </div>
    </div>
  );
};
