import React, { useState } from 'react';

export default function SystemSettings() {
  const [borrowDays, setBorrowDays] = useState(7);

  const handleSave = () => {
    alert('Đã lưu cài đặt!');
    // Gửi API lưu cấu hình nếu cần
  };

  return (
    <div className="system-settings">
      <label>
        Thời gian mượn tối đa (ngày):
        <input
          type="number"
          value={borrowDays}
          onChange={(e) => setBorrowDays(e.target.value)}
        />
      </label>
      <button onClick={handleSave}>Lưu</button>
    </div>
  );
}
