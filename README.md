# Portfolio - MD Tousif

A modern, full-stack portfolio website built with React, Express.js, and PostgreSQL.

## 🌐 Live Demo

**Live Website:** [https://mdtousif.onrender.com](https://mdtousif.onrender.com)

## 🚀 Features

- **Modern UI/UX**: Built with Tailwind CSS and Radix UI components
- **Responsive Design**: Optimized for all devices
- **Admin Panel**: Content management system
- **Authentication**: Secure user login system
- **File Upload**: Support for image and document uploads
- **Email Integration**: Contact form functionality
- **Real-time Features**: WebSocket support for live updates
- **TypeScript**: Full type safety across the stack

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **Wouter** - Client-side routing

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database operations
- **PostgreSQL** - Database (Neon serverless)
- **Passport.js** - Authentication
- **JWT** - Session management
- **Multer** - File uploads
- **Nodemailer** - Email functionality
- **WebSocket** - Real-time communication

## 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory with:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 📁 Project Structure



├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # Page components
│ │ └── ...
├── server/ # Express.js backend
│ ├── routes/ # API routes
│ ├── middleware/ # Express middleware
│ └── ...
├── shared/ # Shared utilities
├── uploads/ # File uploads directory
└── ...





## 🌟 For Users

This portfolio showcases a comprehensive full-stack application with the following key features:

### **Interactive Elements**
- Smooth animations and transitions using Framer Motion
- Responsive design that works on all devices
- Modern UI components built with Radix UI
- Real-time updates and notifications

### **Content Management**
- Admin panel for easy content updates
- File upload system for images and documents
- Dynamic content rendering
- SEO-optimized pages

### **Communication Features**
- Contact form with email integration
- Real-time messaging capabilities
- Professional email notifications
- Secure form handling

### **Technical Excellence**
- TypeScript for type safety
- Modern React patterns and hooks
- Optimized performance with Vite
- Database-driven content management

## 🌐 Deployment

The project is deployed on **Render** at [https://mdtousif.onrender.com](https://mdtousif.onrender.com)

### Deployment Steps:
1. Connect your repository to Render
2. Set up environment variables
3. Configure build commands:
   - Build Command: `npm run build`
   - Start Command: `npm run start`

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**MD Tousif**
- Portfolio: [https://mdtousif.onrender.com](https://mdtousif.onrender.com)

---

⭐ If you find this project helpful, please give it a star!
