import React, { useState } from 'react';
import { createBorrowRequest } from '../../../api/borrowRequest.api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';  // lấy user info và token
import './BorrowRequestModal.css';

export default function BorrowRequestModal({ book, onClose }) {
  const { user, token } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const maxQuantity = book.availableQuantity || book.quantity || 0;

  const handleSubmit = async () => {
    if (quantity <= 0 || quantity > maxQuantity) {
      toast.error('Số lượng không hợp lệ!');
      return;
    }

    if (!user || !user.id) {  // hoặc user._id nếu bạn dùng _id
      toast.error('Bạn cần đăng nhập để gửi yêu cầu mượn!');
      return;
    }

    setLoading(true);
    try {
      // Gửi chỉ book và quantity, reader lấy ở backend
      await createBorrowRequest(
        { 
          book: book._id,
          quantity 
        },
        token // token tự thêm trong axios interceptor, nếu đã set sẵn thì có thể bỏ tham số này
      );
      toast.success('📩 Yêu cầu mượn đã được gửi!');
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gửi yêu cầu thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>📩 Yêu cầu mượn sách</h2>

        <div className="book-info">
          <p><strong>📘 Tên sách:</strong> {book.title}</p>
          <p><strong>✍️ Tác giả:</strong> {book.author}</p>
          <p><strong>📦 Số lượng còn:</strong> {maxQuantity}</p>
        </div>

        <label>
          Số lượng muốn mượn:
          <input
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          />
        </label>

        <div className="modal-actions">
          <button onClick={onClose} disabled={loading}>❌ Hủy</button>
          <button onClick={handleSubmit} disabled={loading || maxQuantity === 0}>
            {loading ? 'Đang gửi...' : '✅ Gửi yêu cầu'}
          </button>
        </div>

        {maxQuantity === 0 && (
          <p className="out-of-stock">⚠️ Sách đã hết hàng, không thể yêu cầu mượn.</p>
        )}
      </div>
    </div>
  );
}
