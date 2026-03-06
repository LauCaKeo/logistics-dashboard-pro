# 🚛 Logistics Dashboard Pro

Hệ thống quản lý logistics toàn diện với tích hợp Google Sheets, Telegram Bot, Email automation và báo cáo tự động.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-15.4.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-blue)

## ✨ Tính năng chính

### 📊 Dashboard thông minh

- Theo dõi chuyến xe real-time
- Thống kê tổng quan (sản phẩm, chi phí, quãng đường)
- Phân tích hiệu suất vận chuyển
- Responsive design cho mọi thiết bị

### 🚛 Quản lý chuyến xe

- Ghi nhận chuyến xe mới với thông tin chi tiết
- Tracking trạng thái (bắt đầu → đang vận chuyển → hoàn thành)
- Quản lý sản phẩm đa dạng (6 thương hiệu, 3 sizes)
- Tính toán chi phí tự động

### 📱 Thông báo Telegram

- **Bot:** @reactintegrationkhovanbot (Chat ID: 1361977198)
- Thông báo hoàn thành chuyến xe
- Báo cáo hàng ngày tự động
- Commands: `/start`, `/status`, `/today`, `/help`
- Cảnh báo và alerts theo thời gian thực

### 📧 Email Automation

- **Báo cáo hàng ngày** (7:00 AM)
- **Báo cáo tuần** (Thứ 2 hàng tuần)
- **Báo cáo quý** (Đầu quý)
- **Báo cáo năm** (1/1 hàng năm)
- Templates đẹp với HTML responsive

### 📊 Google Sheets Integration

- Lưu trữ dữ liệu chuyến xe tự động
- Cấu hình động từ Google Sheets
- Backup và sync real-time
- Export báo cáo định kỳ

### 🤖 Automation đầy đủ

- Cron jobs tự động (Vercel)
- Tích hợp Google Drive lưu trữ
- Workflow hoàn chỉnh từ A-Z
- Monitoring và logging

## 🚀 Cài đặt nhanh

### 1. Clone và cài đặt dependencies

```bash
git clone <repository-url>
cd logistics-dashboard-pro
npm install
```

### 2. Cấu hình môi trường (.env.local)

```env
# Google APIs
GOOGLE_CLIENT_EMAIL=your-service-account-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----"
GOOGLE_SHEETS_ID=your-google-sheets-id
GOOGLE_DRIVE_FOLDER_ID=your-drive-folder-id

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# Email (SendGrid hoặc SMTP)
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=logistics@yourcompany.com
EMAIL_TO=manager@yourcompany.com,admin@yourcompany.com

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
CRON_SECRET=your-secret-key
```

### 3. Chạy development server

```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000) để xem dashboard.

## 🎛️ API Endpoints

### Telegram

- `POST /api/telegram/send-notification` - Gửi thông báo
- `POST /api/telegram/webhook` - Webhook handler
- `GET /api/telegram/bot-info` - Thông tin bot

### Email

- `POST /api/email/send-report` - Gửi báo cáo
- `GET /api/email/send-report` - Test connection

### Trips

- `POST /api/trips` - Tạo chuyến xe mới
- `GET /api/trips` - Lấy danh sách chuyến

### Cron Jobs

- `POST /api/cron/daily-report` - Báo cáo ngày (07:00)
- `POST /api/cron/weekly-report` - Báo cáo tuần (Thứ 2)

## 🎯 Trạng thái dự án

### ✅ Đã hoàn thành

- ✅ **Khởi tạo dự án Next.js** với TypeScript, Tailwind CSS, App Router
- ✅ **Cài đặt đầy đủ dependencies** cho Google Sheets, Telegram, Email, PDF, Charts
- ✅ **Tạo type definitions** đầy đủ cho domain logic
- ✅ **Tích hợp Google Sheets** - Ghi nhận chuyến xe, lấy config, tạo sheet mới
- ✅ **Tích hợp Telegram Bot** - Thông báo, commands, webhook, báo cáo
- ✅ **Email Service** - SendGrid/SMTP, templates HTML responsive
- ✅ **Google Drive Integration** - Lưu trữ báo cáo PDF/Excel, backup dữ liệu
- ✅ **API endpoints đầy đủ** - Trips, notifications, reports, cron jobs
- ✅ **Dashboard Component** - Thống kê, danh sách chuyến xe, actions
- ✅ **Trip Tracking Form** - Ghi nhận chuyến xe mới, quản lý sản phẩm
- ✅ **Vercel cron jobs** - Báo cáo tự động hàng ngày/tuần
- ✅ **Production build** - Không lỗi TypeScript, accessibility compliant
- ✅ **Development helper script** - Script bash hỗ trợ development

### 🔄 Cần hoàn thành

- 🔧 **Cấu hình thực tế** - Google Sheets API, Telegram Bot, SendGrid
- 🚀 **Deploy lên Vercel** - Cấu hình biến môi trường, test end-to-end
- 📊 **Advanced reporting** - PDF generation, Excel export với charts
- 🔐 **Authentication** - Đăng nhập admin, phân quyền người dùng
- 📱 **Mobile optimization** - PWA, responsive design improvements
- 🧪 **Testing** - Unit tests, integration tests, E2E tests

### 🎯 Ưu tiên tiếp theo

1. **Cấu hình biến môi trường thực tế**
2. **Deploy và test trên Vercel**
3. **Tích hợp Google APIs thực tế**
4. **Test workflow end-to-end**

---

**Được xây dựng với ❤️ bằng Next.js, TypeScript & Tailwind CSS**

🚛 **Logistics Dashboard Pro** - Giải pháp quản lý vận chuyển thông minh và hiện đại!

# logistics-dashboard-final
