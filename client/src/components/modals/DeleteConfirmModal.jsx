function DeleteConfirmModal({ onClose, onConfirm, loading }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box small-modal">
        <div className="modal-header">
          <h2>Delete Transaction</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <p className="confirm-text">
          Are you sure you want to delete this transaction? This action cannot be undone.
        </p>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="delete-btn" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;