/* Modal de confirmació genèric */
function Modal({ icon, title, body, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancel·lar', confirmVariant = 'primary' }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      {/* Aturem la propagació per no tancar en clicar dins */}
      <div className="modal" onClick={e => e.stopPropagation()}>
        {icon && <div className="modal__icon">{icon}</div>}
        {title && <h3 className="modal__title">{title}</h3>}
        {body && <p className="modal__body">{body}</p>}
        <div className="modal__actions">
          {onCancel && (
            <button className="btn btn--outline" onClick={onCancel}>{cancelText}</button>
          )}
          {onConfirm && (
            <button className={`btn btn--${confirmVariant}`} onClick={onConfirm}>{confirmText}</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
