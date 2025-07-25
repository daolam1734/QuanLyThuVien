import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';
import BookDetailModal from '../components/shared/book/BookDetailModal';
import BorrowRequestModal from '../components/shared/book/BorrowRequestModal';
import BookCard from '../components/shared/book/BookCard';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;

const tabs = [
  { label: '📌 Tất cả', value: 'all' },
  { label: '🆕 Sách mới', value: 'new' },
  { label: '🏛 Hà Nội', value: 'Hà Nội' },
  { label: '🏛 Tri Thức', value: 'Tri Thức' },
  { label: '🏛 Xây Dựng', value: 'Xây Dựng' },
];

const bannerImages = [
  '/banners/banner1.jpg',
  '/banners/banner2.jpg',
  '/banners/banner3.jpg',
];

export default function Home() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowBook, setBorrowBook] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({ members: 0, online: 0, guests: 0, books: 0 });
  const [currentBanner, setCurrentBanner] = useState(0);
  const location = useLocation();
  const { user } = useAuth();

  // Slide ảnh banner tự động
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/books/public`);
        console.log('📚 Books:', res.data);
        setBooks(res.data);
        setFilteredBooks(res.data);
        setStats((prev) => ({ ...prev, books: res.data.length }));
      } catch (err) {
        console.error('❌ Lỗi khi tải danh mục sách:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/stats/public`);
        console.log('📊 Stats:', res.data);
        if (res.data && typeof res.data === 'object') {
          setStats(res.data);
        }
      } catch (err) {
        console.error('❌ Lỗi khi tải thống kê:', err);
      }
    };

    fetchBooks();
    fetchStats();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const keyword = query.get('search')?.toLowerCase() || '';

    const filter = () => {
      let filtered = [...books];

      if (activeTab === 'new') {
        filtered = filtered
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
      } else if (activeTab === 'featured') {
        filtered = filtered.filter((b) => b.isFeatured);
      } else if (activeTab !== 'all') {
        filtered = filtered.filter((b) => b.publisher?.includes(activeTab));
      }

      if (keyword) {
        const normalize = (str) =>
          str?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const normalizedKeyword = normalize(keyword);

        filtered = filtered.filter((book) =>
          normalize(book.title).includes(normalizedKeyword) ||
          normalize(book.author).includes(normalizedKeyword) ||
          normalize(book.publisher).includes(normalizedKeyword)
        );
      }

      setFilteredBooks(filtered);
    };

    filter();
  }, [books, activeTab, location.search]);

  const handleBorrowClick = (book) => {
    if (user?.role === 'reader') {
      setBorrowBook(book);
    } else {
      window.location.href = '/register';
    }
  };

  return (
    <div className="book-catalog-container">
      <div className="sidebar">
        <h2>📚 Danh mục sách</h2>
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={activeTab === tab.value ? 'active' : ''}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="summary-bar">
          <h3>📊 Thống kê</h3>
          <p>👤 Thành viên: {stats.members}</p>
          <p>🟢 Đang trực tuyến: {stats.online}</p>
          <p>👥 Khách: {stats.guests}</p>
          <p>📘 Tổng sách: {stats.books}</p>
        </div>
      </div>

      <div className="book-content">
        <div className="book-banner">
          {bannerImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Banner ${idx}`}
              style={{ opacity: currentBanner === idx ? 1 : 0 }}
            />
          ))}
        </div>

        {loading ? (
          <p>Đang tải sách...</p>
        ) : filteredBooks.length === 0 ? (
          <p>Không có sách nào để hiển thị.</p>
        ) : (
          <div className="book-grid">
            {filteredBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onClick={() => setSelectedBook(book)}
                onBorrow={handleBorrowClick}
              />
            ))}
          </div>
        )}
      </div>

      {selectedBook && (
        <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
      {borrowBook && (
        <BorrowRequestModal book={borrowBook} onClose={() => setBorrowBook(null)} />
      )}
    </div>
  );
}
