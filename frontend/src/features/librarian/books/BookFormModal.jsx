import React, { useState, useEffect, useCallback } from 'react';
import '../styles/BookFormModal.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;

export default function BookFormModal({ visible, onClose, onSubmit, bookData }) {
  const [form, setForm] = useState({});
  const [coverPreview, setCoverPreview] = useState(null);

  const generatePreview = useCallback((file) => {
    if (!file) return null;
    return file instanceof File
      ? URL.createObjectURL(file)
      : `${API_BASE_URL}/uploads/covers/${file}`;
  }, []);

  useEffect(() => {
    if (bookData) {
      setForm(bookData);
      setCoverPreview(generatePreview(bookData.coverImage));
    } else {
      setForm({});
      setCoverPreview(null);
    }
  }, [bookData, generatePreview]);

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (name === 'coverImage') {
      const file = files[0];
      setForm((prev) => ({ ...prev, coverImage: file }));
      setCoverPreview(generatePreview(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }, [generatePreview]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in form) {
      const value = form[key];
      if (key === 'coverImage' && value instanceof File) {
        data.append('coverImage', value);
      } else if (value !== undefined && value !== null) {
        data.append(key, value);
      }
    }
    onSubmit(data);
  }, [form, onSubmit]);

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form className="book-form" onSubmit={handleSubmit}>
          <h3>{bookData ? '📘 Cập nhật sách' : '📕 Thêm sách mới'}</h3>

          <div className="form-grid">
            <div className="form-left">
              {bookData && (
                <label>
                  Mã sách:
                  <input
                    name="bookCode"
                    value={form.bookCode || ''}
                    readOnly
                  />
                </label>
              )}
              <label>
                Tên sách:
                <input
                  name="title"
                  onChange={handleChange}
                  value={form.title || ''}
                  required
                />
              </label>

              <label>
                Tác giả:
                <input
                  name="author"
                  onChange={handleChange}
                  value={form.author || ''}
                  required
                />
              </label>

              <label>
                Thể loại:
                <input
                  name="category"
                  onChange={handleChange}
                  value={form.category || ''}
                  required
                />
              </label>

              <label>
                Nhà xuất bản:
                <input
                  name="publisher"
                  onChange={handleChange}
                  value={form.publisher || ''}
                />
              </label>

              <label>
                Năm xuất bản:
                <input
                  name="year"
                  type="number"
                  onChange={handleChange}
                  value={form.year || ''}
                />
              </label>

              <label>
                Số lượng:
                <input
                  name="quantity"
                  type="number"
                  onChange={handleChange}
                  value={form.quantity || ''}
                  required
                />
              </label>
            </div> 
            <div className="form-right">
              <label>
                Mô tả nội dung:
                <textarea
                  name="description"
                  onChange={handleChange}
                  value={form.description || ''}
                />
              </label>
              <label>
                Ảnh bìa:
                <input
                  name="coverImage"
                  type="file"
                  onChange={handleChange}
                  accept="image/*"
                />
              </label>

              {coverPreview && (
                <div className="preview-wrapper">
                  <img src={coverPreview} alt="Ảnh bìa" className="preview-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">💾 Lưu</button>
            <button type="button" className="cancel-btn" onClick={onClose}>❌ Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  );
}
