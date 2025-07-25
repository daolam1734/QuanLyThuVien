import React, { useEffect, useState } from 'react';
import { getAllBorrowRequests, approveBorrowRequest, rejectBorrowRequest } from '../../../api/borrowRequest.api';
import '../styles/BorrowRequestManager.css';
import { toast } from 'react-hot-toast';

export default function BorrowRequestManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllBorrowRequests();
      // Lọc ra các yêu cầu đang pending (chưa duyệt)
      setRequests(data.filter(r => r.status === 'pending'));
    } catch (error) {
      toast.error('Lỗi tải danh sách yêu cầu mượn!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Bạn có chắc duyệt yêu cầu này?')) return;

    try {
      await approveBorrowRequest(id);
      toast.success('Đã duyệt yêu cầu!');
      fetchRequests();
    } catch (error) {
      toast.error('Lỗi duyệt yêu cầu!');
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Bạn có chắc từ chối yêu cầu này?')) return;

    try {
      await rejectBorrowRequest(id);
      toast.success('Đã từ chối yêu cầu!');
      fetchRequests();
    } catch (error) {
      toast.error('Lỗi từ chối yêu cầu!');
      console.error(error);
    }
  };

  return (
    <div className="borrow-request-manager">
      <h2>📩 Danh sách yêu cầu mượn sách</h2>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : requests.length === 0 ? (
        <p>Không có yêu cầu mượn mới nào.</p>
      ) : (
        <table className="request-table">
          <thead>
            <tr>
              <th>Tên sách</th>
              <th>Độc giả</th>
              <th>Số lượng</th>
              <th>Ngày gửi</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.book?.title || 'Không rõ'}</td>
                <td>{req.reader?.fullName || 'Ẩn danh'}</td>
                <td>{req.quantity}</td>
                <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-approve" onClick={() => handleApprove(req._id)}>✔️ Duyệt</button>
                  <button className="btn-reject" onClick={() => handleReject(req._id)}>❌ Từ chối</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
