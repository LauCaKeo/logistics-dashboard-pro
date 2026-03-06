import { ReportData, VehicleTrip } from '@/types'
import sgMail from '@sendgrid/mail'
import nodemailer from 'nodemailer'

export class EmailService {
  private transporter: nodemailer.Transporter | null = null
  private usesSendGrid: boolean
  private from: string
  private recipients: string[]

  constructor() {
    this.from = process.env.EMAIL_FROM || 'logistics@company.com'
    this.recipients = (process.env.EMAIL_TO || '').split(',').filter(Boolean)
    this.usesSendGrid = process.env.EMAIL_SERVICE === 'sendgrid'

    if (this.usesSendGrid) {
      if (process.env.SENDGRID_API_KEY) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      }
    } else {
      this.setupSMTP()
    }
  }

  private setupSMTP(): void {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  // Gửi báo cáo hàng ngày
  async sendDailyReport(reportData: ReportData): Promise<boolean> {
    const subject = `📊 Báo cáo hàng ngày - ${reportData.startDate.toLocaleDateString('vi-VN')}`
    const html = this.generateDailyReportHTML(reportData)

    return this.sendEmail(subject, html)
  }

  // Gửi báo cáo tuần
  async sendWeeklyReport(reportData: ReportData): Promise<boolean> {
    const subject = `📈 Báo cáo tuần - ${reportData.startDate.toLocaleDateString('vi-VN')} đến ${reportData.endDate.toLocaleDateString('vi-VN')}`
    const html = this.generateWeeklyReportHTML(reportData)

    return this.sendEmail(subject, html)
  }

  // Gửi báo cáo quý
  async sendQuarterlyReport(reportData: ReportData): Promise<boolean> {
    const quarter = Math.floor(reportData.startDate.getMonth() / 3) + 1
    const year = reportData.startDate.getFullYear()
    const subject = `📊 Báo cáo Quý ${quarter}/${year}`
    const html = this.generateQuarterlyReportHTML(reportData)

    return this.sendEmail(subject, html)
  }

  // Gửi báo cáo năm
  async sendYearlyReport(reportData: ReportData): Promise<boolean> {
    const year = reportData.startDate.getFullYear()
    const subject = `🎊 Báo cáo năm ${year}`
    const html = this.generateYearlyReportHTML(reportData)

    return this.sendEmail(subject, html)
  }

  // Gửi thông báo hoàn thành chuyến
  async sendTripCompletionNotification(trip: VehicleTrip): Promise<boolean> {
    const subject = `✅ Hoàn thành chuyến xe ${trip.id}`
    const html = this.generateTripCompletionHTML(trip)

    return this.sendEmail(subject, html)
  }

  // Gửi email tùy chỉnh
  async sendCustomEmail(subject: string, message: string, isHTML = false): Promise<boolean> {
    return this.sendEmail(subject, isHTML ? message : this.wrapInTemplate(message))
  }

  // Hàm gửi email chính
  private async sendEmail(subject: string, html: string): Promise<boolean> {
    try {
      if (this.recipients.length === 0) {
        console.warn('No email recipients configured')
        return false
      }

      if (this.usesSendGrid) {
        const msg = {
          to: this.recipients,
          from: this.from,
          subject,
          html,
        }

        await sgMail.sendMultiple(msg)
      } else {
        if (!this.transporter) {
          console.error('SMTP transporter not configured')
          return false
        }

        await this.transporter.sendMail({
          from: this.from,
          to: this.recipients.join(','),
          subject,
          html,
        })
      }

      console.log(`Email sent successfully: ${subject}`)
      return true
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }

  // Generate HTML templates
  private generateDailyReportHTML(reportData: ReportData): string {
    const { summary, trips } = reportData
    const date = reportData.startDate.toLocaleDateString('vi-VN')

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Báo cáo hàng ngày</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; }
            .summary { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .summary-item { display: inline-block; margin: 10px 20px; text-align: center; }
            .summary-number { font-size: 2em; font-weight: bold; color: #667eea; }
            .trips-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .trips-table th, .trips-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .trips-table th { background: #667eea; color: white; }
            .status-completed { color: #28a745; font-weight: bold; }
            .status-in-transit { color: #ffc107; font-weight: bold; }
            .footer { text-align: center; color: #666; margin-top: 30px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 Báo cáo hàng ngày</h1>
                <p>Ngày: ${date}</p>
            </div>

            <div class="summary">
                <h2>📈 Tóm tắt</h2>
                <div class="summary-item">
                    <div class="summary-number">${summary.totalTrips}</div>
                    <div>Tổng chuyến</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">${summary.totalProducts.toLocaleString()}</div>
                    <div>Sản phẩm</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">${(summary.totalCost / 1000000).toFixed(1)}M</div>
                    <div>Chi phí (VNĐ)</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">${summary.totalDistance}</div>
                    <div>Km</div>
                </div>
            </div>

            <h2>🚛 Chi tiết chuyến xe</h2>
            <table class="trips-table">
                <thead>
                    <tr>
                        <th>Mã chuyến</th>
                        <th>Xe</th>
                        <th>Tuyến đường</th>
                        <th>Trạng thái</th>
                        <th>Chi phí</th>
                    </tr>
                </thead>
                <tbody>
                    ${trips
                      .map(
                        (trip) => `
                        <tr>
                            <td>${trip.id}</td>
                            <td>${trip.vehicleId}</td>
                            <td>${trip.route}</td>
                            <td class="status-${trip.status}">${this.getStatusText(trip.status)}</td>
                            <td>${trip.cost.toLocaleString()} ₫</td>
                        </tr>
                    `,
                      )
                      .join('')}
                </tbody>
            </table>

            <div class="footer">
                <p>📱 Truy cập dashboard: <a href="${process.env.NEXT_PUBLIC_APP_URL}">${process.env.NEXT_PUBLIC_APP_NAME}</a></p>
                <p>Email được gửi tự động lúc ${new Date().toLocaleString('vi-VN')}</p>
            </div>
        </div>
    </body>
    </html>`
  }

  private generateWeeklyReportHTML(reportData: ReportData): string {
    const { performance } = reportData
    const startDate = reportData.startDate.toLocaleDateString('vi-VN')
    const endDate = reportData.endDate.toLocaleDateString('vi-VN')

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Báo cáo tuần</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; }
            .performance { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
            .performance-card { background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center; }
            .performance-number { font-size: 2.5em; font-weight: bold; color: #667eea; }
            .chart-placeholder { background: #eee; height: 200px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📈 Báo cáo tuần</h1>
                <p>Từ ${startDate} đến ${endDate}</p>
            </div>

            <div class="performance">
                <div class="performance-card">
                    <div class="performance-number">${performance.onTimeDelivery}%</div>
                    <div>Đúng giờ</div>
                </div>
                <div class="performance-card">
                    <div class="performance-number">${performance.costEfficiency}%</div>
                    <div>Hiệu quả chi phí</div>
                </div>
                <div class="performance-card">
                    <div class="performance-number">${performance.fuelEfficiency}%</div>
                    <div>Tiết kiệm nhiên liệu</div>
                </div>
            </div>

            <div class="chart-placeholder">
                📊 Biểu đồ xu hướng (sẽ được thêm vào phiên bản tiếp theo)
            </div>
        </div>
    </body>
    </html>`
  }

  private generateQuarterlyReportHTML(reportData: ReportData): string {
    const quarter = Math.floor(reportData.startDate.getMonth() / 3) + 1
    const year = reportData.startDate.getFullYear()

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Báo cáo quý</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; }
            .insights { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 Báo cáo Quý ${quarter}/${year}</h1>
            </div>

            <div class="insights">
                <h2>💡 Insights & Phân tích</h2>
                <p>• Tổng cộng ${reportData.summary.totalTrips} chuyến xe trong quý</p>
                <p>• Chi phí trung bình: ${reportData.summary.averageCostPerKm.toLocaleString()} ₫/km</p>
                <p>• Tổng doanh thu: ${reportData.summary.totalCost.toLocaleString()} ₫</p>
            </div>
        </div>
    </body>
    </html>`
  }

  private generateYearlyReportHTML(reportData: ReportData): string {
    const year = reportData.startDate.getFullYear()

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Báo cáo năm</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; }
            .highlights { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎊 Báo cáo năm ${year}</h1>
                <p>Tổng kết hoạt động logistics</p>
            </div>

            <div class="highlights">
                <h2>🏆 Điểm nổi bật năm ${year}</h2>
                <p>• Tổng chuyến xe: ${reportData.summary.totalTrips.toLocaleString()}</p>
                <p>• Tổng sản phẩm vận chuyển: ${reportData.summary.totalProducts.toLocaleString()}</p>
                <p>• Tổng chi phí: ${reportData.summary.totalCost.toLocaleString()} ₫</p>
                <p>• Quãng đường: ${reportData.summary.totalDistance.toLocaleString()} km</p>
            </div>
        </div>
    </body>
    </html>`
  }

  private generateTripCompletionHTML(trip: VehicleTrip): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Hoàn thành chuyến xe</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 20px; border-radius: 10px; text-align: center; }
            .details { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Chuyến xe hoàn thành</h1>
                <p>Mã chuyến: ${trip.id}</p>
            </div>

            <div class="details">
                <h2>📋 Thông tin chi tiết</h2>
                <p><strong>Xe:</strong> ${trip.vehicleId}</p>
                <p><strong>Tài xế:</strong> ${trip.driverName}</p>
                <p><strong>Tuyến đường:</strong> ${trip.route}</p>
                <p><strong>Chi phí:</strong> ${trip.cost.toLocaleString()} ₫</p>
                <p><strong>Quãng đường:</strong> ${trip.distance} km</p>
                <p><strong>Hoàn thành lúc:</strong> ${trip.endTime?.toLocaleString('vi-VN')}</p>
                ${trip.notes ? `<p><strong>Ghi chú:</strong> ${trip.notes}</p>` : ''}
            </div>
        </div>
    </body>
    </html>`
  }

  private wrapInTemplate(message: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
    </body>
    </html>`
  }

  private getStatusText(status: string): string {
    const statusMap = {
      started: 'Bắt đầu',
      in_transit: 'Đang vận chuyển',
      completed: 'Hoàn thành',
      cancelled: 'Hủy bỏ',
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  // Test email configuration
  async testConnection(): Promise<boolean> {
    try {
      if (this.usesSendGrid) {
        // Test SendGrid connection by sending a test email to the first recipient
        if (this.recipients.length > 0) {
          await sgMail.send({
            to: this.recipients[0],
            from: this.from,
            subject: 'Test Connection - Logistics Dashboard',
            text: 'Email service is working correctly!',
          })
        }
      } else {
        if (this.transporter) {
          await this.transporter.verify()
        }
      }
      return true
    } catch (error) {
      console.error('Email connection test failed:', error)
      return false
    }
  }
}

export const emailService = new EmailService()
