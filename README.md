# 🚗 ApexMotors Car Dealership Inventory System

A full-stack **Car Dealership Inventory Management System** built with **React, TypeScript, Node.js, Express.js, and MongoDB**.

The application provides a complete dealership management solution with secure authentication, role-based authorization, inventory management, vehicle purchasing, and an intuitive admin dashboard.

---

# 🚀 Live Demo

> Coming Soon

---

# 📸 Screenshots

## Customer Dashboard

![Customer Dashboard](https://res.cloudinary.com/dtz0urit6/image/upload/q_auto:best,f_jpg/cloudinary-tools-uploads/euyohvmucqvshol44jdr)

## Admin Dashboard

![Admin Dashboard](https://res.cloudinary.com/dtz0urit6/image/upload/q_auto:best,f_jpg/cloudinary-tools-uploads/oxxcjeeffsahcpjkltks)

## Vehicle Purchase

![Purchase Modal](https://res.cloudinary.com/dtz0urit6/image/upload/q_auto:best,f_jpg/cloudinary-tools-uploads/uyxzsucnux6d10opa6ul)

## Restock Vehicle

![Restock Modal](https://res.cloudinary.com/dtz0urit6/image/upload/q_auto:best,f_jpg/cloudinary-tools-uploads/jezdf9ybjkw8ldyuzape)

---

# ✨ Features

- 🔐 JWT Authentication
- 👤 Role-Based Access Control (Admin & User)
- 🚗 Browse Vehicle Inventory
- 🔍 Search & Filter Vehicles
- 💳 Purchase Vehicles
- 📦 Real-Time Stock Updates
- 🛠 Admin Inventory Management
- ➕ Add New Vehicles
- ✏ Update Vehicle Information
- ❌ Delete Vehicles
- 🔄 Restock Inventory
- 📱 Fully Responsive Design
- 🌙 Modern Dark Theme
- ⚡ Fast React + Vite Frontend

---

# 🛠 Tech Stack

## Frontend

- React 18
- TypeScript
- Vite
- React Router DOM
- React Hook Form
- Zod
- Tailwind CSS
- Axios
- Lucide React

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Express Validator

---

## Testing

### Backend

- Jest
- Supertest

### Frontend

- Vitest
- React Testing Library

---

---

# 📋 Prerequisites

- Node.js (v16+)
- MongoDB
- npm

---

# 🔧 Installation

## 1. Clone Repository

```bash
git clone https://github.com/Arshpreet-Singh-Dadarwal/ApexMotors-Car-Dealership.git

cd ApexMotors-Car-Dealership
```

---

## 2. Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_secret_key
```

Run backend

```bash
npm run dev
```

---

## 3. Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env` file.

Example

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend

```bash
npm run dev
```

---

# 🌱 Seed Database

```bash
cd backend

npm run seed
```

---

# 🧪 Running Tests

## Backend

```bash
cd backend

npm test
```

Coverage

```bash
npm run test:report
```

---

## Frontend

```bash
cd frontend

npm test
```

Coverage

```bash
npm run test:report
```

---

# 📚 API Endpoints

## Authentication

| Method | Endpoint | Description | Access |
|---------|----------|-------------|--------|
| POST | `/api/auth/register` | Register User | Public |
| POST | `/api/auth/login` | Login User | Public |
| GET | `/api/auth/me` | Current User | Private |

---

## Vehicles

| Method | Endpoint | Access |
|---------|----------|--------|
| GET | `/api/vehicles` | Private |
| GET | `/api/vehicles/search` | Private |
| GET | `/api/vehicles/:id` | Private |
| GET | `/api/vehicles/category/:category` | Private |
| GET | `/api/vehicles/stats/summary` | Admin |
| POST | `/api/vehicles` | Admin |
| PUT | `/api/vehicles/:id` | Admin |
| DELETE | `/api/vehicles/:id` | Admin |
| POST | `/api/vehicles/:id/purchase` | Private |
| POST | `/api/vehicles/:id/restock` | Admin |

---

# 🔍 Search Parameters

Supported query parameters:

- `q`
- `make`
- `model`
- `category`
- `minPrice`
- `maxPrice`

---

# 🗄 Database Schema

## User

```javascript
{
  email: String,
  password: String,
  fullName: String,
  role: "admin" | "user",
  createdAt: Date
}
```

---

## Vehicle

```javascript
{
  make: String,
  model: String,
  category: String,
  price: Number,
  quantity: Number,
  year: Number,
  description: String,
  image_url: String,
  created_at: Date,
  updated_at: Date
}
```

---

# 🤖 AI Usage

This project was developed with assistance from several AI tools.

## ChatGPT

Used for:

- Project architecture planning
- Express.js backend development
- MongoDB schema design
- JWT Authentication
- API implementation
- Debugging
- Code review

---

## Bolt AI

Used for:

- UI/UX Design
- React Components
- Tailwind CSS layouts
- Responsive Design
- Dark Theme implementation

---

## DeepSeek

Used for:

- Backend optimization
- Performance improvements
- Bug fixing
- Database query optimization
- Test generation

---

# 💡 AI Prompt Examples

### ChatGPT

> "How do I implement JWT authentication in Express with MongoDB and bcrypt?"

---

### Bolt AI

> "Create a modern dashboard for a car dealership with a dark theme and glassmorphism."

---

### DeepSeek

> "My purchase endpoint is not updating inventory correctly."

---

# 📈 AI Impact

### Productivity

AI accelerated development by approximately **60–70%** by reducing time spent on boilerplate code, UI generation, debugging, and testing.

### Learning

Using AI improved my understanding of:

- JWT Authentication
- MongoDB Design
- React Component Architecture
- Error Handling
- Test Driven Development

### Code Quality

AI helped improve:

- Security
- Performance
- Code Organization
- Testing Coverage

---

# ⚠ Challenges

- AI-generated code sometimes required manual refinement.
- Some generated solutions were not optimal for the project's specific requirements.
- Every AI-generated solution was reviewed and tested before integration.

---

# 🧠 Development Approach

I followed a **Human-in-the-Loop** workflow:

- Generate ideas using AI
- Understand every implementation
- Modify code as needed
- Test manually
- Verify functionality before integration

---

# 📊 Test Coverage

## Backend

| Module | Coverage |
|----------|----------|
| Overall | 90%+ |
| Authentication | 95% |
| Vehicle Controller | 92% |
| Middleware | 85% |

---

## Frontend

| Module | Coverage |
|----------|----------|
| Overall | 85%+ |
| Components | 88% |
| Pages | 82% |

---

# 👨‍💻 Author

**Arshpreet Singh Dadarwal**

GitHub: https://github.com/Arshpreet-Singh-Dadarwal

---

---

⭐ If you found this project useful, consider giving it a star!
