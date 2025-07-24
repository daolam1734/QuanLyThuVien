import { useState, useEffect } from 'react';
import axios from 'axios';
import EditLibrarianModal from './EditLibrarianModal';
import '../../styles/admin.css';
import { useAuth } from '../../contexts/AuthContext';

export default function LibrarianList() {
  const [librarians, setLibrarians] = useState([]);
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { token } = useAuth(); // ✅ Lấy token

  const fetchLibrarians = async () => {
    try {
      const res = await axios.get('/api/admin/librarians', {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Gửi token trong header
        },
      });
      setLibrarians(res.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách thủ thư:', err);
    }
  };

  useEffect(() => {
    if (token) fetchLibrarians();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa thủ thư này?')) return;
    try {
      await axios.delete(`/api/admin/librarians/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Đừng quên gửi token ở đây nữa
        },
      });
      alert('Đã xóa thành công');
      fetchLibrarians();
    } catch (err) {
      console.error(err);
      alert('Xóa thất bại');
    }
  };

  const handleEdit = (librarian) => {
    setSelectedLibrarian(librarian);
    setShowModal(true);
  };

  return (
    <div className="admin-table-container">
      <h2>📋 Danh sách thủ thư</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {librarians.map((librarian) => (
            <tr key={librarian._id}>
              <td>{librarian.fullName}</td>
              <td>{librarian.email}</td>
              <td>{librarian.phone || '-'}</td>
              <td>
                <button onClick={() => handleEdit(librarian)}>✏️ Sửa</button>
                <button onClick={() => handleDelete(librarian._id)} className="btn-danger">
                  ❌ Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal chỉnh sửa */}
      {showModal && (
        <EditLibrarianModal
          librarian={selectedLibrarian}
          onClose={() => setShowModal(false)}
          onUpdated={fetchLibrarians}
        />
      )}
    </div>
  );
}
