# ASTU FIND - Campus Lost & Found System

A full-stack digital solution for **Adama Science and Technology University (ASTU)** students to report, track, and reclaim lost items. Built with a focus on security, transparency, and ease of use.

## 🚀 Key Features
- **Dual Reporting:** Separate dedicated feeds for "Lost" and "Found" items.
- **Admin Dashboard:** Centralized control for admins to verify ownership claims and manage system statistics.
- **Ownership Verification:** Secure claim system requiring Telegram handles and detailed proof of ownership.
- **Smart Filtering:** Search by item name, category (Electronics, IDs, etc.), or date.
- **Image Support:** Integrated image uploads for visual verification of found items.

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend:** Node.js, Express.js.
- **Database:** PostgreSQL.
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt password hashing.

## 📁 Project Structure
- `/frontend`: React application (UI/UX).
- `/backend`: Node.js server, API routes, and database configuration.
- `/uploads`: Storage for item images.

## 🔧 Installation & Setup
1. **Clone the repo:** `git clone [your-repo-link]`
2. **Setup Database:** Run the provided SQL schema in your PostgreSQL environment.
3. **Install Backend:** `cd backend && npm install`
4. **Install Frontend:** `cd frontend && npm install`
5. **Environment Variables:** Create a `.env` in `/backend` with your DB credentials.
6. **Start:** Run `npm start` in both directories.

---
*Developed for ASTU Students.*