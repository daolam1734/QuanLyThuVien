import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { extendBorrow, returnBook } from '../../../api/borrow.api';
import '../styles/ActionModal.css';

const ActionModal = ({ borrow, onClose, onUpdated }) => {
  const [actionType, setActionType] = useState('extend');
  const [returnDate, setReturnDate] = useState('');
  const [loading, setLoading] = useState(false);

  const isReturned = borrow.status === 'returned';
  const isExtended = borrow.extended;

  useEffect(() => {
    setReturnDate(new Date().toISOString().split('T')[0]);
  }, [borrow]);

  const calculateNewDueDate = () => {
    const oldDue = new Date(borrow.dueDate);
    oldDue.setDate(oldDue.getDate() + 15);
    return oldDue.toISOString().split('T')[0];
  };

  const handleExtend = async () => {
    if (isReturned) return toast.error('Phiếu đã trả, không thể gia hạn');
    if (isExtended) return toast.error('Phiếu đã được gia hạn 1 lần');

    try {
      setLoading(true);
      const res = await extendBorrow(borrow._id);
      if (res?.data) {
        toast.success('Gia hạn thành công');
        await onUpdated?.(); // Gọi lại fetch + đóng modal
      } else {
        toast.error(res?.data?.message || 'Không thể gia hạn');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi gia hạn');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (isReturned) return toast.error('Phiếu đã được trả');

    try {
      setLoading(true);
      const res = await returnBook(borrow._id, returnDate);
      if (res?.data) {
        toast.success('Trả sách thành công');
        await onUpdated?.(); // Gọi lại fetch + đóng modal
      } else {
        toast.error(res?.data?.message || 'Không thể trả sách');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi trả sách');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>📘 Xử lý phiếu mượn</h3>

        <div className="action-switch">
          <button
            className={actionType === 'extend' ? 'active' : ''}
            onClick={() => setActionType('extend')}
            disabled={loading}
          >
            Gia hạn
          </button>
          <button
            className={actionType === 'return' ? 'active' : ''}
            onClick={() => setActionType('return')}
            disabled={loading}
          >
            Trả sách
          </button>
        </div>

        {actionType === 'extend' && (
          <div className="extend-info">
            <p>📅 Hạn cũ: <strong>{new Date(borrow.dueDate).toLocaleDateString('vi-VN')}</strong></p>
            <p>🕒 Hạn mới: <strong>{new Date(calculateNewDueDate()).toLocaleDateString('vi-VN')}</strong></p>
            <p>🔁 Chỉ được gia hạn 1 lần</p>
            <button
              onClick={handleExtend}
              disabled={isReturned || isExtended || loading}
              className="primary-btn"
            >
              {loading ? 'Đang xử lý...' : '✔️ Gia hạn'}
            </button>
          </div>
        )}

        {actionType === 'return' && (
          <div className="return-info">
            <label>Ngày trả:</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              disabled
            />
            <button
              onClick={handleReturn}
              disabled={isReturned || loading}
              className="primary-btn"
            >
              {loading ? 'Đang xử lý...' : '✔️ Trả sách'}
            </button>
          </div>
        )}

        <button onClick={onClose} className="cancel-btn" disabled={loading}>
          ✖️ Đóng
        </button>
      </div>
    </div>
  );
};

export default ActionModal;
