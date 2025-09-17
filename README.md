### Project Overview

This project is a microservice for a School Payment and Dashboard Application. It has a backend that manages transactions and payments through a REST API and a frontend dashboard for displaying data. [cite\_start]The backend uses **Node.js** with **NestJS**, connects to **MongoDB Atlas**, and integrates with a payment gateway[cite: 8, 9, 11]. [cite\_start]The frontend is built with **React.js** and styled with **Tailwind CSS** or another framework[cite: 141, 144, 146].

-----

### Features

#### Backend

  * [cite\_start]**Payment Gateway Integration**: The application includes a `POST /create-payment` route that accepts payment details and forwards them to the payment API's `create-collect-request` endpoint[cite: 46, 47, 48]. [cite\_start]It generates JWT-signed payloads as required by the payment gateway[cite: 49].
  * [cite\_start]**Webhook Integration**: A `POST /webhook` endpoint is available to receive transaction updates from the payment gateway and update the database accordingly[cite: 59, 61, 80].
  * [cite\_start]**User Authentication**: All API endpoints are secured using **JWT Authentication**[cite: 36, 38].
  * [cite\_start]**Database Schemas**: The application uses **MongoDB** and defines schemas for `Order`, `Order Status`, and `Webhook Logs`[cite: 12, 30, 33].
  * [cite\_start]**Data Retrieval**: It provides endpoints to fetch transactions, including a route that uses a MongoDB aggregation pipeline to combine order and order status schemas[cite: 83, 85].
  * [cite\_start]**Performance & Scalability**: The backend supports pagination and sorting for list endpoints and uses indexing on important fields to speed up queries[cite: 119, 120, 121].

#### Frontend

  * [cite\_start]**Dashboard Pages**: The frontend features a dashboard that displays a paginated, searchable list of all transactions fetched from the `/transactions` API[cite: 150, 151].
  * [cite\_start]**Transaction Filtering**: Users can filter transactions by status (e.g., "Success", "Pending", "Failed"), school IDs, and date ranges[cite: 160, 161]. [cite\_start]Filters are persistent in the URL[cite: 162].
  * [cite\_start]**Transaction Details**: There is a page to display transactions for a specific `school_id`[cite: 164].
  * [cite\_start]**Status Check**: A dedicated page or modal allows users to check the status of a transaction by its `custom_order_id`[cite: 167].

-----

### API Endpoints

[cite\_start]All endpoints are secured with **JWT Authentication**[cite: 38].

  * [cite\_start]**`POST /create-payment`**: Initiates a new payment request[cite: 46].
  * [cite\_start]**`POST /webhook`**: Receives and processes webhook events from the payment gateway[cite: 59, 61].
  * [cite\_start]**`GET /transactions`**: Fetches all transactions with support for pagination and sorting[cite: 84, 119, 120].
  * [cite\_start]**`GET /transactions/school/:schoolId`**: Retrieves all transactions for a specific school[cite: 97, 98].
  * [cite\_start]**`GET /transaction-status/:custom_order_id`**: Checks the current status of a transaction[cite: 100, 101].

-----

### Backend Setup

#### Prerequisites

  * Node.js
  * MongoDB Atlas

#### Installation

1.  Clone the repository.
2.  Navigate to the project directory.
3.  Install dependencies: `npm install`

#### Running the Project

1.  [cite\_start]Create a `.env` file based on the **Environment Configuration** section below[cite: 107].
2.  Start the application in development mode: `npm run start:dev`

### Frontend Setup

#### Prerequisites

  * Node.js

#### Installation

1.  Navigate to the frontend directory.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

-----

### Environment Configuration

[cite\_start]Create a `.env` file in your backend project root with the following variables[cite: 107]:

```
MONGODB_URI=<Your MongoDB Atlas connection string>
PAYMENT_API_KEY=<Your Payment API Key>
PAYMENT_PG_KEY=<Your Payment PG Key>
JWT_SECRET=<A strong, random string for JWT signing>
JWT_EXPIRY=<JWT expiry time, e.g., '1h' or '7d'>
```

[cite\_start]You can find the payment API credentials in the project description[cite: 52, 53, 54, 55, 56, 57].

-----

### Deployment

  * [cite\_start]**Backend**: The backend should be hosted on a cloud platform like Heroku or AWS[cite: 130].
  * [cite\_start]**Frontend**: The frontend should be deployed on a service like Netlify, Vercel, or AWS Amplify[cite: 174].

-----

### Submission Guidelines

  * [cite\_start]**GitHub Repository**: Push your code to a public GitHub repository[cite: 132].
  * [cite\_start]**Documentation**: Include a comprehensive `README.md` file with setup instructions and API usage examples[cite: 113, 114, 115].
  * [cite\_start]**URLs**: Share the hosted project link and the GitHub repository URL[cite: 137].
  * [cite\_start]**Env File**: Provide the `.env` file for the project[cite: 135].
