// PortalModal.tsx
import { createPortal } from "react-dom";
import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function PortalModal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  return createPortal(
    <div id="modal-content" className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal-content"
        onMouseDown={(e) => e.stopPropagation()} // no cerrar al click interno
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
