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

#### 1. Tại sao Express lại được sử dụng phổ biến
-	Sự phổ biến của Javascript. JavaScript là một ngôn ngữ lập trình rất phổ biến và có ảnh hưởng lớn đối với web và phát triển phần mềm. Mà Expressjs lại hỗ trợ Javascript, do đó nếu bạn đã biết đến Javascript thì chắc chắn việc lập trình bằng Express.js là vô cùng đơn giản. Ngay cả những người mới bắt đầu tham gia vào lĩnh vực phát triển web này cũng có thể sử dụng Expressjs. Chính vì tính phổ biến, dễ học và dễ sử dụng này mà Express.js cho phép các tài năng trẻ tham gia và đạt được nhiều thành công trong phát triển ứng dụng web.
-	Hỗ trợ xây dựng website một cách nhanh chóng. Express.js có thể giúp làm giảm một nửa thời gian viết mã mà vẫn xây dựng lên các ứng dụng web hiệu quả. Không chỉ trợ giúp về mặt thời gian Expressjs còn làm giảm những áp lực cần thiết để xây dựng với sự trợ giúp của các tính năng khác nhau của nó.Express js còn cung cấp một phần mềm trung gian đảm nhận nhiệm vụ đưa ra các quyết định để phản hồi chính xác những yêu cầu của khách hàng.
-	Express là một công cụ miễn phí. Express.js là một mã nguồn mở hoàn toàn miễn phí. Người dùng có thể tải xuống nguồn mã hóa, sử dụng, chỉnh sửa và phân phối nó theo cách tự động thực hiện các điều khoản của việc mở nguồn mã giấy phép. Điều này cho phép các nhà phát triển xây dựng web và API ứng dụng mà không phải trả bất kỳ khoản phí nào khi sử dụng framework này. Công nghệ mang đến điều kiện thuận lợi cho cả những dự án lớn và nhỏ có nhu cầu sử dụng Express.js mà không cần phải lo lắng về các chi phí phát triển.

#### 2. Cách để truyền tham số và xử lý tuyến đường trong Express.js

##### Truyền tham số trong Express.js

Các cách để truyền tham số trong Express.js bao gồm: tham số trong đường dẫn (route parameters), tham số trong truy vấn (query parameters) và tham số trong thân của yêu cầu (request body).

- **Tham số trong đường dẫn**: Được định nghĩa bằng dấu `:` trong URL và được truy cập thông qua `req.params.{parameter-name}`.
  
![image](https://github.com/buiduythong1810/MovieWebsite/assets/108381886/080b78bb-911e-44cc-ba8a-dbc67f92e288)

- **Tham số trong truy vấn**: Được truyền trong URL sau dấu `?` và được truy cập thông qua `req.query.{parameter-name}`.

![image](https://github.com/buiduythong1810/MovieWebsite/assets/108381886/3a1527e8-edd6-4734-9c0b-4fc9ab6dbb16)

- **Tham số trong thân yêu cầu**: Thường được sử dụng khi gửi dữ liệu từ form hoặc từ API và cần sử dụng middleware `body-parser` để phân tích thân yêu cầu như `req.body.{parameter-name}`.

![image](https://github.com/buiduythong1810/MovieWebsite/assets/108381886/21d01065-ff09-4a0a-b440-6c1ff1044de9)

##### Xử lý tuyến đường (routing) trong Express.js

Xử lý tuyến đường trong Express.js là quá trình định tuyến các yêu cầu HTTP đến các xử lý cụ thể dựa trên URL, phương thức HTTP và xác định các hàm callback được gọi khi một yêu cầu cụ thể đến với máy chủ.

Dưới đây là hàm xử lý tuyến đường để lấy thông tin về một bộ phim bao gồm các bước:

1. **Xử lí tham số trong đường dẫn**
2. **Dùng middleware `getMovieDetail` để lấy thông tin về phim dựa trên tham số lấy được**
3. **Trả dữ liệu về**
4. **Xử lí lỗi**

![image](https://github.com/buiduythong1810/MovieWebsite/assets/108381886/e8f78f7a-d945-42c9-a540-9521fa469c24)


#### 1. Làm thế nào để thiết kế một APT RESTFul đơn giản dễ bảo trì bằng Express JS
Thiết kế một API RESTful đơn giản dễ bảo trì bằng Express.js cần tuân theo các nguyên tắc cơ bản về RESTful và áp dụng các thực hành tốt nhất trong phát triển ứng dụng web. Các bước cơ bản để xây dựng một API RESTful bằng Express.js bao gồm:
-	Tạo cấu trúc dự án rõ ràng giúp dễ bảo trì.  
-	Tách biệt các lớp controller, service, và model để code dễ bảo trì và mở rộng.
-	Sử Dụng Định Dạng Thích Hợp Cho Dữ Liệu Trả Về. Thông thường sử dụng JSON vì nó phổ biến và dễ đọc.
-	Sử dụng middleware: Tạo middleware cho các tác vụ chung như xác thực, ghi log.
-	Quản lý lỗi: Tạo một middleware để xử lý lỗi và trả về phản hồi phù hợp.
-	Tạo các route theo chuẩn:
-	 
    o	Sử dụng Danh Từ Số Nhiều để biểu thị tập hợp các tài nguyên. Ví dụ: /users, /products, /orders.
 	
    o	Tránh sử dụng động từ trong tên route vì phương thức HTTP đã biểu thị hành động. Nên sử dụng các phương thức HTTP (GET, POST, PUT, DELETE) để biểu thị hành động cụ thể trên tài nguyên.
    
         GET /users - Lấy danh sách người dùng.
        
         GET /users/{id} - Lấy thông tin chi tiết về một người dùng cụ thể.
        
         POST /users - Tạo một người dùng mới.
        
         PUT /users/{id} - Cập nhật thông tin người dùng cụ thể.
        
         DELETE /users/{id} - Xóa một người dùng cụ thể.
 	
    o	Sử dụng Danh Từ cho Sub-resources: khi một tài nguyên có các tài nguyên con, hãy sử dụng dạng /resource/{resourceId}/sub-resource.
 	
        	Ví dụ: /users/{userId}/orders - Lấy danh sách đơn hàng của một người dùng cụ thể.
 	
    o	Sử Dụng Tên Route Có Nghĩa: đảm bảo tên route rõ ràng và dễ hiểu, mô tả chính xác tài nguyên hoặc hành động.
 	
        	Ví dụ: /products/{productId}/reviews - Lấy đánh giá của một sản phẩm cụ thể.
 	
    o	Sử Dụng Ký Tự Thường và Dấu Gạch Ngang để phân tách các từ trong tên route.
 	
        	Ví dụ: /user-profiles, /order-items.
 	
    o	Sử Dụng Query Parameters cho Lọc, Sắp Xếp và Phân Trang
 	
        	Ví dụ: /users?status=active, /products?category=electronics&sort=price&order=asc, /users?page=2&limit=20.
 	
  -	Cung Cấp Phản Hồi HTTP Trạng Thái Phù Hợp. Sử dụng các mã trạng thái HTTP để phản ánh kết quả của các request:

        o	200 OK: Yêu cầu thành công.
   	
        o	400 Bad Request: Yêu cầu không hợp lệ.
   	
        o	401 Unauthorized: Người dùng chưa được xác thực.
   	
        o	403 Forbidden: Người dùng không có quyền truy cập tài nguyên.
   	
        o	404 Not Found: Không tìm thấy tài nguyên.
   	
        o	500 Internal Server Error: Lỗi server.
-	Bảo Mật API.

        o	Sử Dụng HTTPS để bảo vệ dữ liệu truyền tải
     	
        o	Sử dụng token hoặc OAuth cho xác thực và phân quyền.
     	
        o	Rate Limiting: Giới hạn số lượng yêu cầu từ một nguồn để tránh tấn công DDoS.
   	
-	Cung cấp tài liệu API rõ ràng để người dùng có thể dễ dàng hiểu và sử dụng API.

