# MovieWebsite

![image](https://github.com/buiduythong1810/MovieWebsite/assets/162859217/60a181cb-a286-4bc0-a774-4f3596106d56)

## Nhóm thực hiện: Nhóm 10

![image](https://github.com/buiduythong1810/MovieWebsite/assets/162859217/0f4589f7-219d-4702-aa39-4936db25f176)

### Tên đề tài: Web xem phim giống Netflix

#### Các chức năng của web:
- Đăng nhập/đăng kí dựa trên tên người dùng và mật khẩu
- Tìm kiếm theo từ khóa hoặc theo nhãn, vote
- Dán nhãn dựa theo thể loại phim
- Phân loại người dùng bao gồm miễn phí và trả phí
- Thanh toán thông qua app ngân hàng, ví điện tử
- Chạy quảng cáo

#### Công cụ:
- **Front-end:** HTML, CSS
- **Back-end:** ExpressJS

#### Dependencies
- **axios**: ^1.6.8
- **bcryptjs**: ^2.4.3
- **body-parser**: ^1.20.2
- **cookie-parser**: ^1.4.6
- **cors**: ^2.8.5
- **crypto**: ^1.0.1
- **dateformat**: ^5.0.3
- **dotenv**: ^16.4.5
- **express**: ^4.19.2
- **hbs**: ^4.2.0
- **mongoose**: ^8.3.4
- **morgan**: ^1.10.0

- **Database:** MongoDB

#### Cài đặt:
- Cài đặt expressjs và các Dependencies.
- `MovieWeb/finalserver.js` là server xử lí các chức năng của web.
- `MovieWeb/.env` lưu các biến môi trường của PAYPAL và đường dẫn kết nối đến MongoDB.
- `MovieWeb/services/paypal.js` xử lí chức năng thanh toán.
- `MovieWeb/public` chứa các trang HTML.
- `MovieWeb/public/assets` chứa CSS, script của trang HTML, video và hình ảnh sử dụng trong web.
- `MovieWeb/config` chứa dữ liệu dùng trong MongoDB dưới dạng JSON.

#### Link video seminar giữa kì
[Link video](https://www.youtube.com/watch?v=thEt2cocwCQ)

#### Link deploy
[Link deploy](https://movie-github-io.onrender.com)
