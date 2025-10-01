# Stock Image Management Platform

A web application for users to manage, search, sort, and reorder their personal stock image collections.

-----

## ✨ Key Features

  * **Gallery Management:** View, edit, and delete image metadata (title, file).
  * **Drag-and-Drop Reordering:** Intuitive custom reordering of images.
  * **Edit and Delete Image:** User can able to delete or edit uploaded images.
  * **Load More Pagination:** Smooth, modern loading experience for large galleries.
  * **Filtering & Sorting:** Search images by title and sort by custom order or date.
  * **Secure Auth:** User login and signup via JWT.

-----

## 💻 Tech Stack

| Component | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | **Next.js** (App Router) | Modern React framework |
| **State/Data** | **SWR** | Efficient data fetching and caching |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework |
| **Backend** | **Node.js + Express** | Core API framework |
| **Architecture** | **InversifyJS** | Dependency Injection (Clean Architucture) |
| **Database** | **MongoDB / Mongoose** | Data persistence |
| **Container** | **Docker** | Development environment setup |

-----

## ⚙️ Setup & Run

### Prerequisites

Make sure you have **Node.js**, **npm**, and **Docker** installed.

### 1\. Environment Variables

Create the following files and populate them with your configuration :

#### `server/.env`

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/stock_image_db
JWT_SECRET=YOUR_VERY_LONG_SECRET_KEY_HERE
CLOUD_STORAGE_ACCESS_KEY=your_key
CLOUD_STORAGE_SECRET_KEY=your_secret
ect....
```

#### `client/.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/api
```

### 2\. Backend (Server)

```bash
# Install server dependencies
cd server
npm install

# Build and start the containers (API + MongoDB)
docker-compose up --build 
```

### 3\. Frontend (Client)

```bash
# Install client dependencies
cd client
npm install

# Start the Next.js app in development mode
npm run dev
```

-----

## 🔗 Access

  * **Frontend:** `http://localhost:3000`
  * **Backend API:** `http://localhost:4000/api`


-----

## 🤝 License

This project is licensed under the **MIT License**.
