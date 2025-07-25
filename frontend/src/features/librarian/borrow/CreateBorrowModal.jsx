import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CreateBorrowModal.css';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function CreateBorrowModal({ onClose, onBorrowCreated }) {
  const { token } = useAuth();
  const [readers, setReaders] = useState([]);
  const [books, setBooks] = useState([]);

  const [readerSearch, setReaderSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');

  const [selectedReader, setSelectedReader] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);

  const [borrowDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(
    new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const [borrowedCount, setBorrowedCount] = useState(0);

  useEffect(() => {
    fetchReaders();
    fetchBooks();
  }, []);

  useEffect(() => {
    if (selectedReader) {
      fetchBorrowedCount(selectedReader._id);
    } else {
      setBorrowedCount(0);
    }
  }, [selectedReader]);

  const fetchReaders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/readers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReaders(res.data.data || []);
    } catch {
      toast.error('❌ Không thể tải danh sách độc giả');
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data || []);
    } catch {
      toast.error('❌ Không thể tải danh sách sách');
    }
  };

  const fetchBorrowedCount = async (readerId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/borrows/active/${readerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBorrowedCount(res.data.borrowedBooksCount || 0);
    } catch {
      toast.error('❌ Không thể kiểm tra số sách đã mượn');
    }
  };

  const handleToggleBook = (book) => {
    if (book.quantity <= 0) {
      toast.error(`⚠️ "${book.title}" đã hết sách`);
      return;
    }

    const isSelected = selectedBooks.find((b) => b._id === book._id);
    const total = borrowedCount + (isSelected ? 0 : 1);

    if (total > 3) {
      toast.error('⚠️ Độc giả đã đạt giới hạn 3 sách mượn');
      return;
    }

    if (isSelected) {
      setSelectedBooks(selectedBooks.filter((b) => b._id !== book._id));
    } else {
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  const handleCreate = async () => {
    if (!selectedReader || selectedBooks.length === 0) {
      toast.error('⚠️ Vui lòng chọn độc giả và ít nhất 1 quyển sách');
      return;
    }

    if (borrowedCount + selectedBooks.length > 3) {
      toast.error('⚠️ Tổng số sách mượn vượt quá giới hạn 3 quyển');
      return;
    }

    try {
      const borrowData = {
        reader: selectedReader._id,
        books: selectedBooks.map((b) => ({
          book: b._id,
          quantity: 1,
        })),
        borrowDate,
        dueDate: returnDate,
      };

      await axios.post(`${API_BASE_URL}/api/borrows`, borrowData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('✅ Tạo phiếu mượn thành công');
      onBorrowCreated?.();
      handleReset();
    } catch (err) {
      toast.error('❌ Lỗi khi tạo phiếu mượn');
    }
  };

  const handleReset = () => {
    setSelectedReader(null);
    setSelectedBooks([]);
    setReaderSearch('');
    setBookSearch('');
    setReturnDate('');
    onClose?.();
  };

  const filteredReaders = readers.filter((reader) =>
    `${reader.fullName} ${reader.email} ${reader.readerCode} ${reader.phone}`
      .toLowerCase()
      .includes(readerSearch.toLowerCase())
  );

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.bookCode} ${book.author}`
      .toLowerCase()
      .includes(bookSearch.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>📚 Tạo Phiếu Mượn Sách</h2>

        <div className="modal-section">
          {/* Độc giả */}
          <div className="modal-column">
            <label>🔍 Tìm độc giả:</label>
            <input
              type="text"
              placeholder="Tên, email, mã độc giả, SĐT..."
              value={readerSearch}
              onChange={(e) => setReaderSearch(e.target.value)}
            />
            <div className="scroll-table">
              <table className="select-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>SĐT</th>
                    <th>Chọn</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReaders.map((reader) => (
                    <tr
                      key={reader._id}
                      className={selectedReader?._id === reader._id ? 'selected-row' : ''}
                    >
                      <td>{reader.readerCode}</td>
                      <td>{reader.fullName}</td>
                      <td>{reader.email}</td>
                      <td>{reader.phone}</td>
                      <td>
                        <button onClick={() => setSelectedReader(reader)}>
                          {selectedReader?._id === reader._id ? '✓' : 'Chọn'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedReader && (
              <p className="limit-note">📌 Đã mượn: {borrowedCount} / 3 sách</p>
            )}
          </div>

          {/* Sách */}
          <div className="modal-column">
            <label>🔍 Tìm sách:</label>
            <input
              type="text"
              placeholder="Tên, mã sách, tác giả..."
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
            />
            <div className="scroll-table">
              <table className="select-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Tiêu đề</th>
                    <th>Tác giả</th>
                    <th>Còn</th>
                    <th>Chọn</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book._id}>
                      <td>{book.bookCode}</td>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.quantity}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedBooks.some((b) => b._id === book._id)}
                          onChange={() => handleToggleBook(book)}
                          disabled={
                            (!selectedBooks.some((b) => b._id === book._id) &&
                              borrowedCount + selectedBooks.length >= 3) ||
                            book.quantity === 0
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <small>📌 Đã chọn: {selectedBooks.length} sách</small>
          </div>
        </div>

        {/* Ngày mượn & trả */}
        <div className="date-section">
          <label>📅 Ngày mượn:</label>
          <input type="date" value={borrowDate} readOnly />

          <label>📅 Ngày trả (20 ngày sau):</label>
          <input type="date" value={returnDate} readOnly />
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            onClick={handleCreate}
            disabled={!selectedReader || selectedBooks.length === 0}
          >
            ✅ Tạo Phiếu Mượn
          </button>
          <button className="cancel-btn" onClick={handleReset}>
            ❌ Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

