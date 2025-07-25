import React from 'react';
import '../styles/About.css'; // Đảm bảo đường dẫn CSS đúng

export default function About() {
  return (
    <div className="about-container">
      {/* Phần Hero - Giới thiệu chung */}
      <section className="hero">
        <div className="hero-text">
          <h1>Thư viện Trường Đại học Trà Vinh</h1>
          <p>
            “Không có tri thức thì không có sự giải phóng khỏi vô minh” – thư viện là nơi khởi đầu cho <br/> hành trình tri thức ấy.
          </p>
          <p className="hero-subtext">
            Thư viện TVU là trung tâm tri thức, hỗ trợ toàn diện hoạt động học tập, giảng dạy và nghiên cứu khoa học của cộng đồng nhà trường, góp phần xây dựng một xã hội học tập suốt đời.
          </p>
        </div>
        <img src="https://imgcdn.tapchicongthuong.vn/tcct-media/23/7/27/ai-hoc-tra-vinh.jpg" alt="Toàn cảnh Thư viện TVU" className="hero-image" />
        {/* Placeholder image, bạn nên thay bằng ảnh thực tế */}
      </section>

      {/* Phần Sứ mệnh & Tầm nhìn */}
      <section className="mission">
        <h2>🎯 Sứ mệnh & Tầm nhìn</h2>
        <div className="mission-content">
          <div className="mission-item">
            <h3>Sứ mệnh</h3>
            <p>
              Chúng tôi mang trong mình sứ mệnh trở thành cánh tay nối dài tri thức đến cộng đồng học tập, cung cấp nguồn tài nguyên đa dạng và chất lượng cao, thúc đẩy văn hóa đọc và nghiên cứu khoa học. Thư viện không chỉ là nơi lưu giữ sách vở, mà còn là không gian học thuật sáng tạo – nơi mọi sinh viên, giảng viên có thể tiếp cận tri thức hiện đại, cập nhật và sâu sắc.
            </p>
          </div>
          <div className="mission-item">
            <h3>Tầm nhìn</h3>
            <p>
              Phấn đấu trở thành thư viện đại học hiện đại, dẫn đầu về ứng dụng công nghệ số và cung cấp nguồn tài nguyên học liệu đa dạng, chất lượng cao tại khu vực Đồng bằng sông Cửu Long, góp phần nâng cao chất lượng đào tạo và nghiên cứu của Trường Đại học Trà Vinh, hướng tới hội nhập quốc tế.
            </p>
          </div>
        </div>
      </section>

      {/* Phần Hình thành & Phát triển */}
      <section className="history">
        <h2>📜 Hành trình Phát triển</h2>
        <div className="history-timeline">
          <div className="timeline-item">
            <h3>Năm 2001 - Khởi nguyên và Nền tảng</h3>
            <p>Thư viện được thành lập cùng với sự ra đời của Trường Đại học Trà Vinh, bắt đầu với một kho sách khiêm tốn nhằm phục vụ nhu cầu học tập ban đầu của sinh viên.</p>
          </div>
          <div className="timeline-item">
            <h3>Giai đoạn 2005-2010 - Mở rộng và Đa dạng hóa</h3>
            <p>Đầu tư mạnh mẽ vào việc bổ sung các đầu sách, tạp chí chuyên ngành. Bắt đầu triển khai các giải pháp công nghệ thông tin cơ bản để quản lý tài liệu.</p>
          </div>
          <div className="timeline-item">
            <h3>Giai đoạn 2011-2016 - Phát triển Thư viện điện tử</h3>
            <p>Triển khai hệ thống thư viện điện tử, số hóa một phần tài liệu và cung cấp quyền truy cập trực tuyến, đánh dấu bước chuyển mình quan trọng trong việc ứng dụng công nghệ.</p>
          </div>
          <div className="timeline-item">
            <h3>Từ 2017 đến nay - Hội nhập và Hiện đại hóa</h3>
            <p>Nâng cấp toàn diện cơ sở vật chất, mở rộng không gian học tập. Tăng cường tích hợp các cơ sở dữ liệu quốc tế, và phát triển các dịch vụ hỗ trợ nghiên cứu chuyên sâu, hướng tới tiêu chuẩn quốc tế.</p>
          </div>
          {/* Có thể thêm các mốc thời gian cụ thể hơn nếu có thông tin chi tiết từ TVU */}
        </div>
      </section>

      {/* Phần Cơ sở vật chất & Dịch vụ nổi bật */}
      <section className="facilities">
        <h2>🏛 Cơ sở vật chất & Dịch vụ nổi bật</h2>
        <div className="facilities-grid">
          <div className="facility-item">
            <h3>📚 Kho tài liệu phong phú</h3>
            <ul>
              <li>Hơn **70.000** đầu sách, tạp chí chuyên ngành đa dạng lĩnh vực.</li>
              <li>Bộ sưu tập tài liệu tham khảo, giáo trình, luận văn, luận án và đề tài nghiên cứu khoa học.</li>
              <li>Nguồn tài liệu học tiếng Khmer và các ngôn ngữ bản địa khác.</li>
            </ul>
          </div>
          <div className="facility-item">
            <h3>💻 Thư viện số hiện đại</h3>
            <ul>
              <li>Hơn **20.000** tài liệu học thuật số hóa, bao gồm E-books, E-journals, và báo cáo khoa học.</li>
              <li>Truy cập miễn phí đến các cơ sở dữ liệu trực tuyến uy tín như **ProQuest, SpringerLink, ScienceDirect** (nếu thư viện có đăng ký).</li>
              <li>Hệ thống tra cứu tài liệu nhanh chóng, tiện lợi qua cổng thông tin thư viện.</li>
            </ul>
          </div>
          <div className="facility-item">
            <h3>🛋 Không gian học tập đa dạng</h3>
            <ul>
              <li>Khu vực tự học yên tĩnh, phòng học nhóm linh hoạt với trang thiết bị hiện đại.</li>
              <li>Không gian đọc sách thư giãn, phòng nghiên cứu chuyên sâu dành cho giảng viên và nghiên cứu sinh.</li>
              <li>Phòng máy tính cấu hình cao với các phần mềm chuyên dụng.</li>
            </ul>
          </div>
          <div className="facility-item">
            <h3>⚙️ Tiện ích & Dịch vụ hỗ trợ</h3>
            <ul>
              <li>**Wi-Fi tốc độ cao miễn phí** phủ sóng toàn bộ thư viện.</li>
              <li>Dịch vụ mượn – trả sách tự động, trực tuyến, gia hạn sách dễ dàng qua tài khoản cá nhân.</li>
              <li>Dịch vụ in ấn, photocopy, scan tài liệu tiện lợi với chi phí ưu đãi.</li>
              <li>Tư vấn và hướng dẫn tìm kiếm, khai thác thông tin từ các nguồn tài liệu.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Phần Các Hoạt Động & Sự Kiện (MỚI) */}
      <section className="activities">
        <h2>🎉 Hoạt động & Sự kiện</h2>
        <p>
          Thư viện TVU không chỉ là nơi học tập mà còn là trung tâm của nhiều hoạt động văn hóa, học thuật ý nghĩa, góp phần làm phong phú đời sống sinh viên và cán bộ giảng viên.
        </p>
        <div className="activity-list">
          <div className="activity-item">
            <h3>Ngày hội Sách và Văn hóa đọc</h3>
            <p>Tổ chức định kỳ nhằm khuyến khích văn hóa đọc, giới thiệu sách mới và tạo không gian giao lưu cho cộng đồng yêu sách.</p>
          </div>
          <div className="activity-item">
            <h3>Hội thảo Chuyên đề & Tập huấn kỹ năng</h3>
            <p>Thường xuyên tổ chức các buổi hội thảo về phương pháp nghiên cứu, kỹ năng tìm kiếm thông tin, sử dụng tài liệu số và các chuyên đề học thuật.</p>
          </div>
          <div className="activity-item">
            <h3>Triển lãm chuyên đề</h3>
            <p>Các buổi triển lãm sách, tài liệu theo chủ đề (ví dụ: về văn hóa Khmer, lịch sử địa phương, các ngày lễ lớn) nhằm lan tỏa tri thức đa dạng.</p>
          </div>
        </div>
      </section>

      {/* Phần Đội ngũ nhân sự */}
      <section className="team">
        <h2>🤝 Đội ngũ Thư viện</h2>
        <p>
          Đội ngũ cán bộ thư viện tại TVU là những chuyên gia tận tâm, được đào tạo bài bản và luôn sẵn lòng hỗ trợ bạn trong mọi khía cạnh: từ việc tìm kiếm tài liệu, hướng dẫn sử dụng các dịch vụ số, cho đến giải đáp các thắc mắc chuyên sâu về nghiên cứu. Chúng tôi cam kết mang đến trải nghiệm tốt nhất và thân thiện nhất cho mọi người dùng.
        </p>
        {/* Có thể thêm ảnh đội ngũ hoặc thông tin liên hệ của các bộ phận */}
      </section>

      {/* Phần Đối tác & Liên kết (MỚI) */}
      <section className="partnerships">
        <h2>🌍 Đối tác & Liên kết</h2>
        <p>
          Thư viện Đại học Trà Vinh tích cực mở rộng hợp tác với các tổ chức, thư viện trong và ngoài nước để đa dạng hóa nguồn tài nguyên và nâng cao chất lượng dịch vụ.
        </p>
        <div className="partner-logos">
          {/* Bạn có thể thêm các logo đối tác ở đây */}
          <img src="https://via.placeholder.com/100x50?text=Logo+Partner+1" alt="Partner Logo 1" />
          <img src="https://via.placeholder.com/100x50?text=Logo+Partner+2" alt="Partner Logo 2" />
          <img src="https://via.placeholder.com/100x50?text=Logo+Partner+3" alt="Partner Logo 3" />
          {/* Thêm nhiều logo hơn nếu có */}
        </div>
        <p className="partnership-text">
          Thông qua các mối quan hệ này, chúng tôi mang đến cho bạn quyền truy cập vào các cơ sở dữ liệu quốc tế, chương trình trao đổi tài liệu và nhiều cơ hội học hỏi khác.
        </p>
      </section>

      {/* Phần Thành Tựu Nổi Bật (MỚI) */}
      <section className="achievements">
        <h2>🏆 Thành tựu nổi bật</h2>
        <div className="achievement-list">
          <div className="achievement-item">
            <h3>Giải thưởng Thư viện Xuất sắc (202X)</h3>
            <p>Được công nhận về sự đổi mới trong quản lý và cung cấp dịch vụ thư viện.</p>
          </div>
          <div className="achievement-item">
            <h3>Tăng trưởng tài liệu số 📈</h3>
            <p>Hàng năm tăng trưởng X% số lượng tài liệu số, phục vụ hiệu quả nhu cầu học tập trực tuyến.</p>
          </div>
          <div className="achievement-item">
            <h3>Đóng góp cộng đồng</h3>
            <p>Tổ chức thành công nhiều chương trình đọc sách cộng đồng, lan tỏa tri thức đến học sinh, người dân địa phương.</p>
          </div>
        </div>
      </section>

      {/* Phần Câu hỏi thường gặp */}
      <section className="faq">
        <h2>❓ Câu hỏi thường gặp</h2>
        <div className="faq-item">
          <h3>Làm thế nào để đăng ký thẻ thư viện và sử dụng dịch vụ?</h3>
          <p>
            Sinh viên và cán bộ giảng viên có thể đăng ký thẻ thư viện tại quầy thông tin thư viện (Tầng trệt) trong giờ hành chính. Vui lòng mang theo **thẻ sinh viên/cán bộ** và **CMND/CCCD** để hoàn tất thủ tục. Sau khi có thẻ, bạn có thể sử dụng các dịch vụ mượn trả, truy cập thư viện số và các tiện ích khác.
          </p>
        </div>
        <div className="faq-item">
          <h3>Tôi có thể mượn bao nhiêu cuốn sách và trong thời gian bao lâu?</h3>
          <p>
            Quy định về số lượng sách và thời gian mượn khác nhau tùy thuộc vào đối tượng người dùng:
            <ul>
              <li>**Sinh viên**: Tối đa 5 cuốn sách/tài liệu trong 15 ngày.</li>
              <li>**Giảng viên/Nghiên cứu sinh**: Tối đa 10 cuốn sách/tài liệu trong 30 ngày.</li>
            </ul>
            Bạn có thể gia hạn trực tuyến qua tài khoản cá nhân hoặc tại quầy mượn trả nếu sách không có người đặt trước.
          </p>
        </div>
        <div className="faq-item">
          <h3>Thư viện có mở cửa vào cuối tuần không?</h3>
          <p>
            Thư viện mở cửa từ **Thứ Hai đến Thứ Sáu** (Sáng: 7:30 - 11:30, Chiều: 13:30 - 17:00). Thư viện **không mở cửa vào cuối tuần** và các ngày lễ. Vui lòng kiểm tra lịch hoạt động chi tiết trên trang chủ của thư viện để cập nhật thông tin mới nhất.
          </p>
        </div>
        <div className="faq-item">
          <h3>Làm sao để tìm kiếm tài liệu trong thư viện số?</h3>
          <p>
            Bạn có thể truy cập cổng thông tin thư viện điện tử tại **[Địa chỉ website thư viện số của TVU]**. Sử dụng thanh tìm kiếm để nhập từ khóa, tên tác giả, hoặc tên sách. Hệ thống sẽ hiển thị các kết quả liên quan và bạn có thể lọc theo loại tài liệu (sách, tạp chí, luận văn) hoặc định dạng (bản in, bản số).
          </p>
        </div>
      </section>

      {/* Phần Lời kêu gọi hành động cuối cùng */}
      <section className="community-cta">
        <h2>🌟 Tham gia Cộng đồng Thư viện TVU</h2>
        <p>
          Chúng tôi luôn sẵn lòng chào đón bạn! Hãy đến và khám phá kho tàng tri thức tại Thư viện Đại học Trà Vinh. Đừng quên theo dõi các kênh thông tin của chúng tôi để cập nhật những hoạt động, sự kiện và tài liệu mới nhất.
        </p>
        <p className="social-links">
          Kết nối với chúng tôi: <a href="https://www.facebook.com/celri.tvu" target="_blank" rel="noopener noreferrer">Facebook</a>
        </p>
        <p className="final-contact">
          📬 Mọi thắc mắc, đóng góp hoặc cần hỗ trợ, vui lòng liên hệ qua <a href="/contact">trang liên hệ</a> hoặc <br/>Gọi hotline: (02943) 855 246 - 102.
        </p>
      </section>
    </div>
  );
}