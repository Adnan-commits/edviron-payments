# School Payment Dashboard

A comprehensive microservice application for managing school payments with a modern dashboard interface.

## 🏗️ Project Overview

This project consists of a **backend microservice** that handles payment transactions through a REST API and a **frontend dashboard** for data visualization and management.

- **Backend**: Built with Node.js and NestJS, connected to MongoDB Atlas with payment gateway integration
- **Frontend**: Developed using React.js with Tailwind CSS for modern, responsive styling

---

## ✨ Features

### Backend Features

- **🔒 Secure Authentication**: All API endpoints protected with JWT Authentication
- **💳 Payment Gateway Integration**: Direct integration with payment API through `POST /create-payment` endpoint
- **📡 Real-time Webhooks**: Automatic transaction status updates via webhook integration
- **🗄️ Robust Database**: MongoDB schemas for Orders, Order Status, and Webhook Logs
- **📊 Advanced Data Retrieval**: MongoDB aggregation pipelines for complex queries
- **🚀 Performance Optimized**: Pagination, sorting, and database indexing for scalability

### Frontend Features

- **📈 Interactive Dashboard**: Paginated and searchable transaction listings
- **🔍 Advanced Filtering**: Filter by status, school ID, and date ranges with URL persistence
- **🏫 School-specific Views**: Dedicated transaction pages for individual schools
- **✅ Status Tracking**: Real-time transaction status checking by order ID

---

## 🚀 API Endpoints

All endpoints require JWT Authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/create-payment` | Initiate a new payment request |
| `POST` | `/webhook` | Process payment gateway webhook events |
| `GET` | `/transactions` | Fetch all transactions (paginated & sortable) |
| `GET` | `/transactions/school/:schoolId` | Get transactions for specific school |
| `GET` | `/transaction-status/:custom_order_id` | Check transaction status |

---

## 🛠️ Setup Instructions

### Backend Setup

#### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account

#### Installation
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables (see [Environment Configuration](#environment-configuration))

4. Start development server
   ```bash
   npm run start:dev
   ```

### Frontend Setup

#### Prerequisites
- Node.js (v14 or higher)

#### Installation
1. Navigate to frontend directory
   ```bash
   cd frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start development server
   ```bash
   npm run dev
   ```

---

## ⚙️ Environment Configuration

Create a `.env` file in your backend project root:

```env
# Database
MONGODB_URI=<Your MongoDB Atlas connection string>

# Payment Gateway
PAYMENT_API_KEY=<Your Payment API Key>
PAYMENT_PG_KEY=<Your Payment PG Key>

# Authentication
JWT_SECRET=<Strong random string for JWT signing>
JWT_EXPIRY=<JWT expiry time, e.g., '1h' or '7d'>
```

> **Note**: Payment API credentials can be found in the project description documentation.

---

## 🌐 Deployment

### Backend Deployment
Deploy to cloud platforms such as:
- Heroku
- AWS EC2/Elastic Beanstalk
- Google Cloud Platform
- DigitalOcean

### Frontend Deployment
Deploy to static hosting services:
- Netlify
- Vercel
- AWS Amplify
- GitHub Pages

---


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support and questions, please open an issue in the GitHub repository.
