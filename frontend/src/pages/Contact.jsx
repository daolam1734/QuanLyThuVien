import React, { useState } from 'react';
import '../styles/Contact.css';
import emailjs from 'emailjs-com';

const Contact = () => {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      e.target,
      process.env.REACT_APP_EMAILJS_USER_ID
    ).then(
      (result) => {
        console.log('Email sent:', result.text);
        setSuccess(true);
        e.target.reset();
        setTimeout(() => setSuccess(false), 5000);
      },
      (error) => {
        console.error('Email failed:', error.text);
        alert("❌ Gửi email thất bại. Vui lòng thử lại sau.");
      }
    );
  };

  return (
    <div className="container">
      <div className="hero-section">
        <div className="floating-elements">
          <div className="floating-book">📚</div>
          <div className="floating-book">📖</div>
          <div className="floating-book">📓</div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Liên Hệ Với Chúng Tôi</h1>
          <p className="hero-subtitle">Thư viện Đại học Trà Vinh - Nơi tri thức hội tụ</p>
        </div>
      </div>

      <div className="content-grid">
        <div className="contact-form-section">
          <h2 className="section-title">Gửi Tin Nhắn</h2>
          {success && (
            <div className="success-message">
              Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên *</label>
              <input type="text" className="form-control" id="fullName" name="fullName" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input type="email" className="form-control" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input type="tel" className="form-control" id="phone" name="phone" />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Chủ đề *</label>
              <select className="form-control" id="subject" name="subject" required>
                <option value="">Chọn chủ đề</option>
                <option value="book-inquiry">Hỏi về sách/tài liệu</option>
                <option value="library-card">Thẻ thư viện</option>
                <option value="borrowing">Mượn/trả sách</option>
                <option value="facilities">Tiện ích thư viện</option>
                <option value="technical-support">Hỗ trợ kỹ thuật</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Nội dung tin nhắn *</label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows="5"
                required
                placeholder="Vui lòng mô tả chi tiết yêu cầu của bạn..."
              />
            </div>
            <button type="submit" className="btn-submit">Gửi Tin Nhắn</button>
          </form>
        </div>

        <div className="contact-info-section">
          <h2 className="section-title">Thông Tin Liên Hệ</h2>

          {[ 
            { icon: '📍', title: 'Địa chỉ', content: 'Số 126, Nguyễn Thiện Thành, Khóm 4, Phường 5, TP. Trà Vinh, Tỉnh Trà Vinh' },
            { icon: '📞', title: 'Điện thoại', content: <>0294 3855 246<br />0294 3855 269</> },
            { icon: '✉️', title: 'Email', content: <>library@tvu.edu.vn<br />info@tvu.edu.vn</> },
            { icon: '🌐', title: 'Website', content: 'www.tvu.edu.vn' },
          ].map((item, idx) => (
            <div className="contact-item" key={idx}>
              <div className="contact-icon">{item.icon}</div>
              <div className="contact-details">
                <h4>{item.title}</h4>
                <p>{item.content}</p>
              </div>
            </div>
          ))}

          <div className="working-hours">
            <h4>Giờ Mở Cửa</h4>
            <div className="hours-item">
              <span className="hours-day">Thứ 2 - Thứ 6:</span>
              <span className="hours-time">7:00 - 21:00</span>
            </div>
            <div className="hours-item">
              <span className="hours-day">Thứ 7:</span>
              <span className="hours-time">7:30 - 17:00</span>
            </div>
            <div className="hours-item">
              <span className="hours-day">Chủ nhật:</span>
              <span className="hours-time">8:00 - 17:00</span>
            </div>
          </div>

          <div className="map-section">
            <iframe
              title="TVU Library Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.126073441582!2d106.34393901078552!3d9.923456874305762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0175ea296facb%3A0x55ded92e29068221!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBUcsOgIFZpbmg!5e0!3m2!1svi!2s!4v1753365298132!5m2!1svi!2s"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
