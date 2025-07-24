import { useEffect, useState } from 'react';
import './BorrowedBooks.css';

export default function BorrowedBooks() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        const res = await fetch('/api/my-borrows', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache', // ✅ Ngăn cache
            Pragma: 'no-cache',
          },
        });

        if (res.status === 304) {
          console.log('Không có dữ liệu mới.');
          return;
        }

        if (!res.ok) {
          throw new Error('Không thể tải dữ liệu');
        }

        const data = await res.json();
        setBorrows(data);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu mượn sách:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, []);

  const today = new Date();

  if (loading) return <p>Đang tải...</p>;
  if (borrows.length === 0) return <p>Bạn chưa mượn sách nào.</p>;

  return (
    <div className="borrowed-container">
      <h2>Sách đã mượn</h2>
      <table className="borrowed-table">
        <thead>
          <tr>
            <th>Tên sách</th>
            <th>Số lượng</th>
            <th>Hạn trả</th>
            <th>Trạng thái</th>
            <th>Thông báo</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map((borrow) =>
            borrow.books.map(({ book, quantity }) => {
              const dueDate = new Date(borrow.dueDate);
              const returned = borrow.status === 'returned';
              const isLate = !returned && today > dueDate;

              return (
                <tr key={`${borrow._id}-${book._id}`}>
                  <td>{book.title}</td>
                  <td>{quantity}</td>
                  <td>{dueDate.toLocaleDateString()}</td>
                  <td className={returned ? 'status-returned' : 'status-borrowed'}>
                    {returned ? 'Đã trả' : 'Chưa trả'}
                  </td>
                  <td className="late-warning">
                    {isLate ? '⚠️ Quá hạn!' : ''}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
