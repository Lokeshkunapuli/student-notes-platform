# Deployment Guide

This guide will help you deploy your Student Notes & Resource Sharing Platform to various hosting services.

## 🚀 Quick Deploy Options

### Option 1: Render (Recommended for Backend)

#### Backend Deployment on Render

1. **Create a Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch
   - Configure:
     - **Name**: `student-notes-backend`
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: `Node`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/student_notes_platform
   JWT_SECRET=your_super_secret_jwt_key_here
   CLIENT_ORIGIN=https://your-frontend-domain.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the backend URL (e.g., `https://student-notes-backend.onrender.com`)

### Option 2: Vercel (Recommended for Frontend)

#### Frontend Deployment on Vercel

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: `Vite`
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Set Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend-domain.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note the frontend URL (e.g., `https://student-notes-platform.vercel.app`)

### Option 3: Netlify (Alternative for Frontend)

#### Frontend Deployment on Netlify

1. **Create a Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "New site from Git"
   - Connect your GitHub repository
   - Configure:
     - **Build Command**: `npm run build`
     - **Publish Directory**: `dist`
     - **Base Directory**: `frontend`

3. **Set Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend-domain.onrender.com`

## 🐳 Docker Deployment

### Local Development with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker Deployment

1. **Build Images**
   ```bash
   # Backend
   cd backend
   docker build -t student-notes-backend .

   # Frontend
   cd frontend
   docker build -t student-notes-frontend .
   ```

2. **Run Containers**
   ```bash
   # Backend
   docker run -d -p 5000:5000 \
     -e MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/student_notes_platform \
     -e JWT_SECRET=your_jwt_secret \
     student-notes-backend

   # Frontend
   docker run -d -p 80:80 \
     -e VITE_API_BASE_URL=https://your-backend-domain.com \
     student-notes-frontend
   ```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a free cluster

2. **Configure Database**
   - Create a database named `student_notes_platform`
   - Create a user with read/write permissions
   - Whitelist your IP addresses (0.0.0.0/0 for all IPs)

3. **Get Connection String**
   - Copy the connection string
   - Replace `<password>` with your user password
   - Use this as your `MONGO_URI`

### Local MongoDB

```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
mongod --dbpath /data/db
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/student_notes_platform
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_ORIGIN=https://your-frontend-domain.vercel.app
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-backend-domain.onrender.com
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CLIENT_ORIGIN` matches your frontend URL exactly
   - Check for trailing slashes in URLs

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

3. **Build Failures**
   - Check Node.js version (18+ required)
   - Clear node_modules and reinstall
   - Verify all environment variables are set

4. **Frontend Not Loading**
   - Check if backend is running
   - Verify `VITE_API_BASE_URL` is correct
   - Check browser console for errors

### Health Checks

- **Backend**: `https://your-backend-domain.com/`
- **Frontend**: `https://your-frontend-domain.com/`

Both should return status information.

## 📊 Monitoring

### Render
- View logs in Render dashboard
- Monitor resource usage
- Set up alerts for downtime

### Vercel
- View deployment logs
- Monitor performance
- Set up analytics

## 🔄 Updates

### Updating Backend
1. Push changes to GitHub
2. Render will automatically redeploy
3. Check deployment logs

### Updating Frontend
1. Push changes to GitHub
2. Vercel will automatically redeploy
3. Check deployment status

## 🛡️ Security

### Production Checklist
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Set up proper CORS
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity

## 📈 Performance

### Optimization Tips
- Enable gzip compression
- Use CDN for static assets
- Optimize images
- Implement caching strategies
- Monitor database performance

## 🆘 Support

If you encounter issues:
1. Check the logs
2. Verify environment variables
3. Test locally first
4. Check service status pages
5. Review this guide

For additional help, create an issue in the GitHub repository.
