import { useState, useEffect } from "react";
import Dialog from "./Dialog";

interface InputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  submitText?: string;
  cancelText?: string;
}

function InputDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  label,
  placeholder = "",
  defaultValue = "",
  submitText = "Submit",
  cancelText = "Cancel",
}: InputDialogProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="input-field" className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
          <input
            id="input-field"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500"
            autoFocus
          />
        </div>
        <Dialog.Actions
          onCancel={onClose}
          cancelText={cancelText}
          confirmText={submitText}
          confirmDisabled={!value.trim()}
          confirmType="submit"
        />
      </form>
    </Dialog>
  );
}

export default InputDialog;
