import { useState } from 'react';
import './BookDetailModal.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;

export default function BookDetailModal({ book, onClose, onRequestBorrow, user }) {
  const [activeTab, setActiveTab] = useState('description');
  const [showFullDesc, setShowFullDesc] = useState(false);

  if (!book) return null;

  const {
    title,
    author,
    description,
    coverImage,
    availableQuantity,
    publishedDate,
    genre,
    borrowCount,
    rating = 4.2,
  } = book;

  const handleBorrow = () => {
    if (!user) {
      window.location.href = '/register';
      return;
    }

    if (user.role !== 'reader') return;

    onRequestBorrow(book);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="book-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>

        <div className="modal-content">
          <div className="left-panel">
            <img
              src={coverImage ? `${API_BASE_URL}/uploads/covers/${coverImage}` : '/no-cover.jpg'}
              alt={title}
              className="book-cover-large"
            />
          </div>

          <div className="right-panel">
            <h2 className="book-title">{title}</h2>
            <p className="book-meta"><strong>Tác giả:</strong> {author}</p>
            <p className="book-meta"><strong>Ngày xuất bản:</strong> {publishedDate || 'Không rõ'}</p>
            <p className="book-meta"><strong>Thể loại:</strong> {genre || 'Không rõ'}</p>
            <p className="book-meta"><strong>Lượt mượn:</strong> {borrowCount || 0}</p>
            <p className="book-meta"><strong>Số lượng còn:</strong> {availableQuantity}</p>
            <div className="book-rating">⭐️ {rating} / 5.0</div>

            {/* Tabs */}
            <div className="tab-header">
              {['description', 'rating', 'feedback'].map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? 'tab active' : 'tab'}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'description' ? '📖 Mô tả' : tab === 'rating' ? '⭐ Đánh giá' : '💬 Phản hồi'}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="book-description">
                  <p>
                    {showFullDesc || description.length <= 200
                      ? description
                      : `${description.slice(0, 200)}...`}
                  </p>
                  {description.length > 200 && (
                    <button className="toggle-desc-btn" onClick={() => setShowFullDesc(!showFullDesc)}>
                      {showFullDesc ? 'Ẩn bớt' : 'Xem thêm'}
                    </button>
                  )}
                </div>
              )}
              {activeTab === 'rating' && (
                <div className="tab-placeholder">
                  <p>⭐ Đánh giá người dùng sẽ được hiển thị tại đây.</p>
                  <p><i>(Tính năng đang phát triển)</i></p>
                </div>
              )}
              {activeTab === 'feedback' && (
                <div className="tab-placeholder">
                  <p>💬 Phản hồi từ độc giả sẽ được hiển thị tại đây.</p>
                  <p><i>(Tính năng đang phát triển)</i></p>
                </div>
              )}
            </div>

            <div className="action-buttons">
              {user?.role === 'reader' ? (
                <button className="borrow-btn" onClick={handleBorrow}>📖 Yêu cầu mượn</button>
              ) : !user ? (
                <button className="borrow-btn" onClick={handleBorrow}>📖 Đăng ký để mượn</button>
              ) : (
                <button className="borrow-btn" disabled>Chỉ độc giả mới được mượn</button>
              )}
              <button
                className="favorite-btn"
                onClick={() => alert('Tính năng lưu yêu thích đang phát triển')}
              >
                🔖 Lưu yêu thích
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
