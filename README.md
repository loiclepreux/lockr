# 🔐 LOCKR – Secure Document Sharing Platform

## 📌 Overview

**LOCKR** is a secure web application designed to **store, manage, and share documents** between users with advanced control and security features.

The platform allows users to:

* Upload and manage files
* Share documents with other users
* Define expiration dates for access
* Organize collaboration through groups
* Receive real-time notifications

> 🎯 Goal: Provide a **secure, scalable and user-friendly document management system**

---

## 🚀 Features

### 🔑 Authentication & Security

* User registration & login
* JWT-based authentication
* Password hashing (secure storage)
* Optional **Two-Factor Authentication (2FA)**
* Access control per user

---

### 📄 Document Management

* Upload documents
* View document list
* Download files
* Delete documents
* File metadata (name, date, owner)

---

### 🔁 Document Sharing

* Share a document with another user
* Define an **expiration date**
* Control access rights
* View shared documents (sent & received)

---

### 👥 Groups System

* Create groups
* Add/remove members
* Share documents within groups
* Collaborative environment

---

### 🔔 Notifications

* Real-time notifications for:

  * Document shared
  * Group invitations
  * Activity updates
* Notification history

---

### 👤 User Profile

* Profile management
* Update personal information
* Change password
* Enable/disable 2FA

---

## 🏗️ Architecture

The project follows a **modern full-stack architecture**:

### 🧠 Backend

* Framework: **NestJS**
* ORM: **Prisma**
* Database: PostgreSQL (or compatible)
* API: RESTful

### 🎨 Frontend

* Framework: (à adapter selon ton projet → React / Next.js / autre)
* Styling: TailwindCSS (ou autre)

---

## 🔗 API Structure (Examples)

### Authentication

```http
POST /auth/login
POST /auth/register
```

### Documents

```http
GET    /documents
POST   /documents
DELETE /documents/:id
```

### Sharing

```http
POST /documents/:id/share
GET  /shared
```

### Groups

```http
GET  /groups
POST /groups
```

---

## 📊 Database Design (Simplified)

Main entities:

* **User**
* **Document**
* **SharedDocument**
* **Group**
* **Notification**

Relationships:

* A user owns documents
* A document can be shared with multiple users
* Users can belong to multiple groups

---

## 📱 UX Approach

The application is designed with a **mobile-first approach**:

* Responsive interface
* Vertical navigation
* Optimized for smartphones first, then desktop

---

## 🔐 Security Considerations

* JWT authentication
* Role-based access control
* Secure file handling
* Data validation (DTO / Pipes)
* Protection against unauthorized access

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/lockr.git
cd lockr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
DATABASE_URL=
JWT_SECRET=
PORT=3000
```

### 4. Run the project

```bash
npm run start:dev
```

---

## 📦 Project Structure (Example)

```
src/
├── auth/
├── users/
├── documents/
├── shared/
├── groups/
├── notifications/
├── prisma/
└── main.ts
```

---

## 🧪 Future Improvements

* File versioning
* Public share links
* Advanced search
* Activity logs
* Admin dashboard

---

## 👨‍💻 Author

**Your Name**

---

## 📜 License

This project is open-source and available under the MIT License.
