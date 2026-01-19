import Modal from "./Modal";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

function Dialog({
  isOpen,
  onClose,
  title,
  children,
}: React.PropsWithChildren<DialogProps>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 wrap-break-word">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {children}
      </div>
    </Modal>
  );
}

interface DialogActionsProps {
  onCancel: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmDisabled?: boolean;
  confirmVariant?: "danger" | "default";
  confirmType?: "button" | "submit";
}

function DialogActions({
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  confirmDisabled = false,
  confirmVariant = "default",
  confirmType = "button",
}: DialogActionsProps) {
  const confirmButtonClass =
    confirmVariant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-[#0079bf] text-white hover:bg-[#026aa7]";

  return (
    <div className="flex gap-2 justify-end pt-3">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-gray-700 hover:bg-gray-300 rounded transition-colors"
      >
        {cancelText}
      </button>
      <button
        type={confirmType}
        onClick={onConfirm}
        disabled={confirmDisabled}
        className={`px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${confirmButtonClass}`}
      >
        {confirmText}
      </button>
    </div>
  );
}

Dialog.Actions = DialogActions;

export default Dialog;
