# 🚀 CareerNet

CareerNet is a full-stack **professional networking platform** inspired by platforms like LinkedIn. It allows users to create professional profiles, connect with other users, create posts, interact with posts through likes and comments, and receive notifications.

The application is built using the **MERN Stack** with **Socket.IO** for real-time communication and **Cloudinary** for image storage.

---

## ✨ Features

### 🔐 Authentication

* User Signup and Login
* Password hashing using **bcrypt**
* JWT-based authentication
* Protected API routes using authentication middleware
* Persistent login using JWT token

### 👤 User Profile

Users can create and manage their professional profiles.

Profile information includes:

* First Name
* Last Name
* Username
* Email
* Profile Picture
* Cover Image
* Bio / About
* Skills
* Education
* Experience

Users can also update their profile information and profile images.

---

## 📝 Posts

Users can create and interact with professional posts.

### Post functionality

* Create posts
* Add post description/content
* Upload post images
* View posts
* Like posts
* Unlike posts
* Comment on posts
* Delete posts

Post interactions are connected with the notification system.

---

## ❤️ Likes & 💬 Comments

CareerNet supports interaction with posts through:

* Like / Unlike
* Add comments
* View comments
* Delete comments

**Socket.IO** is used to provide real-time updates for post interactions.

---

## 🤝 Connection System

CareerNet provides a professional networking system where users can connect with each other.

### Connection features

* Send connection request
* Accept connection request
* Reject connection request
* Remove connection
* Check connection status
* View received connection requests
* View current connections
* Real-time connection status updates

Connection statuses include:

```text
none
pending
accepted
```

---

## 🔔 Notifications

CareerNet includes a notification system for important user interactions.

Notifications are generated for activities such as:

* Likes
* Comments
* Accepted connection requests

Notifications are stored in MongoDB and can be retrieved through the notification API.

---

## ⚡ Real-Time Communication

**Socket.IO** is used in CareerNet for real-time functionality.

Real-time functionality includes:

* Connection status updates
* Like updates
* Comment updates
* Connection-related updates

The backend maintains connected users using a Socket.IO user-to-socket mapping.

---

## 🖼️ Image Upload

CareerNet uses:

* **Multer** for handling uploaded files
* **Cloudinary** for cloud-based image storage

Images can be uploaded for:

* Profile picture
* Cover image
* Posts

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router
* Axios
* Tailwind CSS
* Socket.IO Client
* React Hot Toast
* React Icons
* Vite

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Socket.IO
* Multer
* Cloudinary
* CORS
* dotenv

---

# 📂 Project Structure

```text
CareerNet/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

# 🔌 API Structure

The backend provides APIs for authentication, users, posts, connections and notifications.

## Authentication

```text
POST /api/auth/signup
POST /api/auth/login
```

## User

```text
GET  /api/user/getCurrentUser
PUT  /api/user/updateProfile
```

## Posts

```text
POST   /api/post/create
GET    /api/post/getAll
DELETE /api/post/delete/:postId
POST   /api/post/like/:postId
POST   /api/post/comment/:postId
```

## Connections

```text
POST   /api/connection/send/:id
PUT    /api/connection/accept/:connectionId
PUT    /api/connection/reject/:connectionId
GET    /api/connection/status/:id
DELETE /api/connection/remove/:connectionId
GET    /api/connection/requests
GET    /api/connection/
```

## Notifications

```text
GET /api/notification/
```

> API paths can depend on the backend's configured base route.

---

# 🗄️ Database

CareerNet uses **MongoDB** with **Mongoose** for database management.

The application maintains data for entities such as:

* Users
* Posts
* Comments
* Connections
* Notifications

Relationships between users, posts and interactions are managed using MongoDB ObjectIds and Mongoose references.

---

# 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=8000

MONGODB_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Use the exact variable names configured in your backend environment/configuration.

---

# ⚙️ Installation & Setup

## 1. Clone the repository

```bash
git clone https://github.com/Akshat-Gupta-19/CareerNet.git
```

```bash
cd CareerNet
```

---

## 2. Setup Backend

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the `.env` file and add the required environment variables.

Start the backend:

```bash
npm run dev
```

---

## 3. Setup Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

---

# 🌐 Application Flow

```text
User
  │
  ▼
React Frontend
  │
  │ Axios
  ▼
Express Backend
  │
  ├── Authentication
  ├── User/Profile
  ├── Posts
  ├── Connections
  └── Notifications
  │
  ▼
MongoDB
```

For real-time functionality:

```text
React Client
     │
     │ Socket.IO
     ▼
Socket.IO Server
     │
     ▼
Connected Users
```

---

# 🔐 Authentication Flow

```text
Signup
  ↓
Password hashed using bcrypt
  ↓
User stored in MongoDB
  ↓
Login
  ↓
JWT generated
  ↓
JWT stored on client
  ↓
Protected API requests
  ↓
Authentication middleware
  ↓
Authorized user
```

---

# 🤝 Connection Flow

```text
User A
  │
  │ Send Request
  ▼
User B
  │
  ├── Accept
  │     ↓
  │   Connected
  │
  └── Reject
        ↓
      Request Rejected
```

Connection changes can also be communicated through Socket.IO so that the UI can update without requiring a full page refresh.

---

# 📱 Responsive UI

The frontend is built using **React and Tailwind CSS** with responsive layouts for different screen sizes.

The application contains dedicated UI sections for:

* Navigation
* Feed
* Profile
* Network
* Connections
* Posts
* Notifications
* Authentication

---

# 🚀 Deployment

CareerNet is structured as a separate frontend and backend application, allowing both parts to be deployed independently.

The backend can be deployed on services such as **Render**, while the React frontend can be deployed on platforms such as **AWS Amplify** or other frontend hosting services.

---

# 🎯 Project Goals

The main goals of CareerNet are to provide:

* A professional networking environment
* User profile management
* Professional connections
* Social interactions through posts
* Real-time communication
* Notifications
* A modern responsive interface

The project also demonstrates practical implementation of a complete **MERN stack application** with authentication, REST APIs, MongoDB, file uploads and real-time Socket.IO communication.

---

# 👨‍💻 Author

**Akshat Gupta**

MERN Stack Developer

### GitHub

https://github.com/Akshat-Gupta-19

### CareerNet Repository

https://github.com/Akshat-Gupta-19/CareerNet

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
