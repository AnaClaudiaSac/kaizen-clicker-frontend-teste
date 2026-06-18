interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onCancel }: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="kc-modal-overlay" onClick={onCancel}>
      <div className="kc-modal" onClick={(event) => event.stopPropagation()}>
        <h2 className="kc-modal-title">{title}</h2>
        <p className="kc-modal-text">{message}</p>
        <div className="kc-modal-actions">
          <button type="button" onClick={onCancel} className="kc-modal-btn-cancel">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} className="kc-modal-btn-confirm">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
