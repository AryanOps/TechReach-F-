# Node.js Backend for Web Project

This is the backend API for the web project, built with Node.js, Express, and MongoDB.

## Features

- **User Management**: Register, Login, JWT Authentication.
- **Orders Management**: Create, View My Orders, Admin View All, Admin Update Status.
- **Reviews Management**: Add Review, View Reviews, Admin Delete Review.
- **Admin Dashboard**: View All Users, Delete User.

## Setup

1.  **Install Dependencies**
    ```bash
    cd backend
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the `backend` directory with the following content:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/web_project_db
    JWT_SECRET=your_jwt_secret
    ```

3.  **Run Server**
    ```bash
    # Development mode
    npm run dev

    # Production mode
    npm start
    ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get token

### Orders
- `POST /api/orders` - Create a new order (Private)
- `GET /api/orders/myorders` - Get logged-in user's orders (Private)
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Reviews
- `POST /api/reviews` - Create a review (Private)
- `GET /api/reviews` - Get all reviews (Public)
- `DELETE /api/reviews/:id` - Delete a review (Admin)

### Admin
- `GET /api/admin/users` - Get all users (Admin)
- `DELETE /api/admin/users/:id` - Delete a user (Admin)

## Frontend Integration

To connect the frontend:
1.  Ensure the backend is running on `http://localhost:5000`.
2.  Update your frontend API calls to point to this URL.
3.  Store the received JWT token in `localStorage` upon login.
4.  Send the token in the `Authorization` header as `Bearer <token>` for private routes.
