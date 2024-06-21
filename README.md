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

3. Có những gì để hỗ trợ phân quyền
Trong ExpressJS, có nhiều cách để hỗ trợ phân quyền và xác thực người dùng :
1.	Middleware Tự Viết:
o	Có thể tự viết middleware để kiểm tra quyền hạn người dùng trước khi xử lý các yêu cầu.
o	Ví dụ:
function checkRole(role) {
  return function(req, res, next) {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  }
}

app.get('/admin', checkRole('admin'), function(req, res) {
  res.send('Welcome Admin!');
});
2.	Passport.js:
o	Passport là một middleware phổ biến để xác thực trong Node.js, hỗ trợ nhiều chiến lược xác thực như username/password, OAuth, JWT, v.v.
o	Sau khi xác thực, có thể sử dụng thông tin người dùng để kiểm tra quyền hạn.
o	Ví dụ:
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    // Kiểm tra thông tin đăng nhập
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// Middleware kiểm tra quyền
function checkRole(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  }
}

app.get('/admin', checkRole('admin'), function(req, res) {
  res.send('Welcome Admin!');
});
3.	JSON Web Token (JWT):
o	JWT là một cách phổ biến để xác thực và phân quyền trong các ứng dụng web.
o	Sử dụng thư viện như jsonwebtoken để tạo và xác thực token.
o	Ví dụ:
const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret';

// Tạo token
function generateToken(user) {
  return jwt.sign(user, secret, { expiresIn: '1h' });
}

// Middleware kiểm tra token và phân quyền
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, secret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
}

function checkRole(role) {
  return function(req, res, next) {
    if (req.user.role === role) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  }
}

app.get('/admin', authenticateToken, checkRole('admin'), function(req, res) {
  res.send('Welcome Admin!');
});


4.	RBAC (Role-Based Access Control):
o	Sử dụng thư viện như accesscontrol để triển khai kiểm soát truy cập dựa trên vai trò.
o	Ví dụ:
const AccessControl = require('accesscontrol');
const ac = new AccessControl();

ac.grant('user')
  .readOwn('profile')
  .updateOwn('profile');

ac.grant('admin')
  .extend('user')
  .readAny('profile')
  .updateAny('profile')
  .deleteAny('profile');

function checkPermission(action, resource) {
  return function(req, res, next) {
    const permission = ac.can(req.user.role)[action](resource);
    if (permission.granted) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  }
}

app.get('/profile', authenticateToken, checkPermission('readOwn', 'profile'), function(req, res) {
  res.send('Your profile');
});

app.delete('/profile/:id', authenticateToken, checkPermission('deleteAny', 'profile'), function(req, res) {
  res.send('Profile deleted');
});

4. Phương pháp nào tốt nhất để bảo mật trong Express JS
Không có một phương pháp duy nhất nào có thể coi là an toàn nhất để bảo mật một ứng dụng ExpressJS. Bảo mật là một lĩnh vực phức tạp và yêu cầu phải kết hợp nhiều kỹ thuật và công cụ để bảo vệ ứng dụng khỏi các mối đe dọa khác nhau. Tuy nhiên, có thể tăng cường bảo mật ứng dụng của mình bằng cách tuân thủ các phương pháp sau một cách nghiêm ngặt:
1.	Sử dụng Helmet:
o	Helmet giúp bảo vệ ứng dụng bằng cách thiết lập các tiêu đề HTTP bảo mật. Đây là bước đầu tiên và cơ bản nhất để bảo vệ ứng dụng.
o	Cài đặt và sử dụng:
const helmet = require('helmet');
app.use(helmet());
2.	Xác thực và Phân quyền:
o	Sử dụng Passport.js hoặc JSON Web Token (JWT) để xác thực và phân quyền người dùng. Đây là yếu tố then chốt để đảm bảo chỉ những người dùng hợp lệ mới có thể truy cập vào các tài nguyên quan trọng.
o	Ví dụ sử dụng JWT:
const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret';

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, secret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
}

app.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});
3.	Sử dụng HTTPS:
o	Đảm bảo rằng ứng dụng luôn sử dụng HTTPS để mã hóa dữ liệu truyền tải. Điều này bảo vệ dữ liệu khỏi bị đánh cắp hoặc thay đổi khi truyền tải qua mạng.
o	Cài đặt chứng chỉ SSL và cấu hình máy chủ web để sử dụng HTTPS.
4.	Chống tấn công XSS và CSRF:
o	Sử dụng xss-clean để ngăn chặn các cuộc tấn công Cross-Site Scripting (XSS).
const xss = require('xss-clean');
app.use(xss());
o	Sử dụng csurf middleware để bảo vệ chống lại CSRF.
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(csrf({ cookie: true }));

app.get('/form', (req, res) => {
  res.render('send', { csrfToken: req.csrfToken() });
});

app.post('/process', (req, res) => {
  res.send('Data is being processed');
});
5.	Hạn chế tốc độ và bảo vệ chống tấn công DDoS:
o	Sử dụng express-rate-limit để hạn chế số lượng yêu cầu từ một IP trong một khoảng thời gian nhất định.
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100 // giới hạn mỗi IP là 100 yêu cầu mỗi 15 phút
});

app.use(limiter);
6.	Thiết lập CORS đúng cách:
o	Cấu hình CORS để chỉ cho phép các miền tin cậy truy cập API 
const cors = require('cors');
const corsOptions = {
  origin: 'https://trusted-domain.com',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
7.	Bảo mật cấu hình và biến môi trường:
o	Đảm bảo không để lộ thông tin nhạy cảm trong mã nguồn hoặc các file cấu hình.
o	Sử dụng dotenv để quản lý biến môi trường:
require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD;
8.	Cập nhật thường xuyên các thư viện:
o	Thường xuyên kiểm tra và cập nhật các thư viện và dependencies để tránh các lỗ hổng bảo mật đã biết.
9.	Sử dụng các công cụ và dịch vụ bảo mật bên ngoài:
o	Sử dụng các dịch vụ như Snyk, OWASP ZAP để quét và phát hiện các lỗ hổng bảo mật trong ứng dụng.
10.	Kiểm tra và giám sát liên tục:
o	Triển khai hệ thống giám sát và ghi nhật ký để theo dõi hoạt động của ứng dụng và phát hiện sớm các hành vi bất thường.
Kết hợp tất cả các phương pháp trên sẽ giúp xây dựng một hệ thống bảo mật mạnh mẽ và toàn diện cho ứng dụng ExpressJS của mình. Không có một phương pháp đơn lẻ nào là "an toàn nhất", mà sự an toàn đạt được qua việc áp dụng đồng thời nhiều biện pháp bảo mật.

5. Express có thích hợp với dự án có ngân sách nhỏ hay không
Express là một framework nhẹ và linh hoạt cho Node.js, và thường rất thích hợp cho các dự án có ngân sách nhỏ vì:
1.	Miễn phí và Mã nguồn mở: Express là một phần mềm mã nguồn mở, nghĩa là có thể sử dụng nó mà không phải trả bất kỳ chi phí nào.
2.	Cộng đồng lớn và tài liệu phong phú: Với một cộng đồng lớn và tài liệu phong phú, có thể dễ dàng tìm thấy hỗ trợ và giải pháp cho các vấn đề gặp phải mà không cần thuê chuyên gia đắt đỏ.
3.	Cấu hình tối thiểu: Express không yêu cầu cấu hình phức tạp, giúp tiết kiệm thời gian và tiền bạc trong quá trình phát triển.
4.	Hiệu suất cao: Express rất nhẹ và hiệu quả, giúp xây dựng các ứng dụng web nhanh chóng mà không cần đầu tư nhiều vào tài nguyên phần cứng.
5.	Thư viện và Module phong phú: Có rất nhiều thư viện và module có sẵn cho Express, giúp dễ dàng mở rộng chức năng mà không cần phải tự phát triển từ đầu.
6.	Phù hợp với nhiều loại dự án: Từ các ứng dụng nhỏ đến các hệ thống lớn, Express đều có thể được tùy chỉnh để phù hợp với nhu cầu của dự án, giúp tiết kiệm chi phí phát triển ban đầu.
Tóm lại, Express là một lựa chọn lý tưởng cho các dự án có ngân sách nhỏ nhờ vào tính linh hoạt, hiệu quả, và cộng đồng hỗ trợ mạnh mẽ.



	

