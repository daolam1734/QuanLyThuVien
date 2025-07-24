import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BorrowedBooks.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/borrow/my-books`);
        setBorrowedBooks(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sách đã mượn:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, []);

  if (loading) return <p>Đang tải danh sách...</p>;

  return (
    <div className="borrowed-books">
      <h2>📖 Sách bạn đã mượn</h2>

      {borrowedBooks.length === 0 ? (
        <p>Bạn chưa mượn quyển sách nào.</p>
      ) : (
        <ul className="book-list">
          {borrowedBooks.map((item) => (
            <li key={item._id} className="book-item">
              <img
                src={
                  item.book.coverImage
                    ? `${API_BASE_URL}/${item.book.coverImage}`
                    : '/default-cover.png'
                }
                alt={item.book.title}
              />
              <div>
                <h4>{item.book.title}</h4>
                <p>Tác giả: {item.book.author}</p>
                <p>Ngày mượn: {new Date(item.borrowedAt).toLocaleDateString()}</p>
                <p>Trạng thái: {item.status === 'returned' ? 'Đã trả' : 'Đang mượn'}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
