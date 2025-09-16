<<<<<<< HEAD
# Student Notes & Resource Sharing Platform

A full-stack MERN application that allows students to share, discover, and manage educational resources and notes. Built with React, Node.js, Express, and MongoDB.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure signup/login with JWT tokens
- **Note Management**: Upload, view, download, and delete notes
- **Resource Sharing**: Share PDFs, documents, and other educational materials
- **Search & Filter**: Find notes by title, description, tags, or comments
- **Social Features**: Like, dislike, save, and comment on notes
- **User Profiles**: View uploaded, liked, and saved notes

### Advanced Features
- **Reporting System**: Report inappropriate content with reasons
- **Admin Panel**: Manage users, notes, and reports
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant UI updates for all actions

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with CSS custom properties

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Student-Notes-Platform/
├── backend/                 # Backend API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   └── package.json       # Backend dependencies
├── frontend/              # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
├── .gitignore             # Git ignore rules
├── env.example            # Environment variables template
└── README.md              # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Lokeshkunapuli/student-notes-platform.git
cd student-notes-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/student_notes_platform
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_ORIGIN=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application
- Frontend: https://student-notes-platform.onrender.com
- Backend API: https://student-notes-backend-vugj.onrender.com

## 🚀 Deployment

### Backend (Render/Heroku)
1. Push your code to GitHub
2. Connect your repository to Render/Heroku
3. Set environment variables in the deployment platform
4. Deploy

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variable: `VITE_API_BASE_URL=https://your-backend-url.com`
5. Deploy

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Notes
- `GET /api/notes` - Get all notes (with search/filter)
- `POST /api/notes` - Upload a new note
- `DELETE /api/notes/:id` - Delete a note (owner only)
- `POST /api/notes/:id/like` - Like a note
- `POST /api/notes/:id/dislike` - Dislike a note
- `POST /api/notes/:id/report` - Report a note

### Users
- `GET /api/users/:id` - Get user profile
- `POST /api/users/:id/save` - Save/unsave a note

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/notes` - Get all notes
- `GET /api/admin/reports` - Get reported notes
- `PATCH /api/admin/users/:id/block` - Block/unblock user
- `DELETE /api/admin/notes/:id` - Delete any note

## 🎨 Features in Detail

### Theme System
- Toggle between light and dark themes
- Persistent theme preference
- Smooth transitions
- Consistent styling across all components

### Reporting System
- Report inappropriate content
- Admin panel to review reports
- Detailed report information
- Action buttons for admins

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly buttons
- Optimized for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@Lokeshkunapuli]([https://github.com/Lokeshkunapuli])
- Email: kunapulilokesh777@gmail.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the fast build tool
- MongoDB for the flexible database
- All the open-source contributors
=======
# student-notes-platform
>>>>>>> 68a5a87d56260d103162900db17e49a34b03e09a
