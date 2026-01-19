import Dialog from "./Dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
}

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
      <Dialog.Actions
        onCancel={onClose}
        onConfirm={handleConfirm}
        cancelText={cancelText}
        confirmText={confirmText}
        confirmVariant={variant}
      />
    </Dialog>
  );
}

export default ConfirmDialog;
