import { useEffect, useRef, useId } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

const FOCUSABLE_ELEMENTS_SELECTOR =
  'button:not([tabindex="-1"]):not(:disabled), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Modal stack to track open modals in order (topmost is last)
const modalStack: string[] = [];

function Modal({ isOpen, onClose, children }: React.PropsWithChildren<ModalProps>) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const modalId = useId();

  const getFocusableElements = (): HTMLElement[] => {
    if (!modalRef.current){
      return [];
    }
    return Array.from(modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR));
  };

  const isTopmostModal = () => {
    return modalStack[modalStack.length - 1] === modalId;
  };

  // Register/unregister modal in the stack
  useEffect(() => {
    if (isOpen) {
      // Add this modal to the stack
      modalStack.push(modalId);

      return () => {
        // Remove this modal from the stack
        const index = modalStack.indexOf(modalId);
        if (index > -1) {
          modalStack.splice(index, 1);
        }
      };
    }
  }, [isOpen, modalId]);

  // close modal on escape key press and trap focus within modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Only handle ESC if this is the topmost modal
        if (isTopmostModal()) {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
        return;
      }

      // Focus trap logic - only trap focus in the topmost modal
      if (e.key === "Tab" && modalRef.current && isTopmostModal()) {
        const focusableArray = getFocusableElements();

        if (focusableArray.length === 0) return;

        const firstFocusable = focusableArray[0];
        const lastFocusable = focusableArray[focusableArray.length - 1];
        const currentIndex = focusableArray.indexOf(document.activeElement as HTMLElement);

        // Always prevent default to control focus movement
        e.preventDefault();

        if (e.shiftKey) {
          // Shift + Tab: moving backwards
          if (currentIndex <= 0) {
            lastFocusable?.focus();
          } else {
            // Move to previous element
            focusableArray[currentIndex - 1]?.focus();
          }
        } else {
          // Tab: moving forwards
          if (currentIndex === -1 || currentIndex >= focusableArray.length - 1) {
            // Not in array or at last element, wrap to first
            firstFocusable?.focus();
          } else {
            // Move to next element
            focusableArray[currentIndex + 1]?.focus();
          }
        }
      }
    };

    if (isOpen) {
      // Store the currently focused element
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Restore focus to the previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
        previouslyFocusedElement.current = null;
      }
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // Calculate z-index based on position in stack
  const stackIndex = modalStack.indexOf(modalId);
  const zIndex = 100 + stackIndex;

  return (
    <div
      data-testid="modal-backdrop"
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
      style={{ zIndex }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        data-testid="modal-content"
        data-modal-content
        className="bg-[#f4f5f7] rounded-lg p-6 relative min-w-96 max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-300 rounded w-8 h-8 flex items-center justify-center transition-colors text-xl leading-none"
          tabIndex={-1}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;