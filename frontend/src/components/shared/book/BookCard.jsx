import React from 'react';
import './BookCard.css';

export default function BookCard({ book, onClick, onBorrow }) {
  const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;
  const coverUrl = book.coverImage
    ? `${API_BASE_URL}/uploads/covers/${book.coverImage}`
    : '/no-cover.jpg';

  return (
    <div className="book-card hoverable" onClick={onClick}>

      <div className="book-image">
        <img src={coverUrl} alt={book.title} />
      </div>

      <div className="book-details">
        <h3 className="book-title">{book.title}</h3>
        <p><span>Tác giả:</span> {book.author}</p>
        <p><span>Thể loại:</span> {book.category || 'Chưa phân loại'}</p>
        <p><span>Số lượng còn:</span> {book.availableQuantity != null ? book.availableQuantity : book.quantity}</p>
        
        {onBorrow && (
          <button
            className="borrow-button"
            onClick={(e) => {
              e.stopPropagation();
              onBorrow(book);
            }}
          >
            📩 Yêu cầu mượn
          </button>
        )}
      </div>
    </div>
  );
}
