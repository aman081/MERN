# Urjaa Sports Fest - Backend API

## 🏗️ Architecture Overview

This is a **MERN stack** backend for the Urjaa College Sports Fest Management System, built with:
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database & ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Express Validator** - Input validation
- **Rate Limiting** - Security protection

## 📁 Project Structure

```
server/
├── models/           # Database schemas
│   ├── User.js      # Admin & public users
│   ├── Event.js     # Sports events
│   ├── Photo.js     # Event photos
│   ├── Announcement.js # Public announcements
│   └── Comment.js   # User comments
├── controllers/      # Business logic
│   ├── authController.js
│   ├── eventController.js
│   └── leaderboardController.js
├── routes/          # API endpoints
│   ├── auth.js
│   ├── events.js
│   ├── leaderboard.js
│   ├── photos.js
│   ├── announcements.js
│   └── comments.js
├── middleware/      # Custom middleware
│   └── auth.js     # JWT authentication
├── utils/          # Utilities
│   └── cloudinary.js # Image upload
└── server.js       # Main server file
```

## 🔐 Authentication System

### User Types
1. **Admin Users**
   - Single shared account for coordinators
   - Username/password login
   - Full CRUD access to all features

2. **Public Users**
   - Email/password login
   - Can only comment on announcements
   - No registration (handled offline)

### JWT Implementation
- **Token Expiry**: 7 days
- **Secure Storage**: Bearer token in Authorization header
- **Role-based Access**: Admin vs Public user permissions

## 📊 Database Models

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['admin', 'public']),
  name: String (required for public users)
}
```

### Event Model
```javascript
{
  name: String (required),
  description: String (required),
  day: Date (required),
  time: String (required),
  venue: String (required),
  branchTags: [String] (e.g., ['CSE', 'ECE']),
  gameType: String (e.g., 'Cricket', 'Football'),
  category: String (enum: ['Boys', 'Girls']),
  eventType: String (enum: ['Individual', 'Team']),
  points: {
    first: Number,
    second: Number,
    third: Number
  },
  coverImage: String (Cloudinary URL),
  status: String (enum: ['Upcoming', 'Active', 'Concluded']),
  winners: [{
    position: String (enum: ['First', 'Second', 'Third', 'Team']),
    branch: String,
    points: Number,
    playerOfTheMatch: String (optional, Team events only)
  }]
}
```

### Other Models
- **Photo**: Event photos with captions and tags
- **Announcement**: Public announcements with optional images
- **Comment**: User comments on announcements

## 🚀 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/admin/login` | Admin login | Public |
| POST | `/api/auth/public/login` | Public user login | Public |
| GET | `/api/auth/me` | Get current user | Authenticated |

### Events
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/events` | Get all events (with filters) | Public |
| GET | `/api/events/:id` | Get single event | Public |
| POST | `/api/events` | Create event | Admin |
| PUT | `/api/events/:id` | Update event | Admin |
| DELETE | `/api/events/:id` | Delete event | Admin |
| PATCH | `/api/events/:id/status` | Update event status | Admin |
| PATCH | `/api/events/:id/winners` | Add winners | Admin |

### Leaderboard
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/leaderboard` | Get branch rankings | Public |
| GET | `/api/leaderboard/points-system` | Get points system | Public |

### Other Endpoints
- **Photos**: Upload and retrieve event photos
- **Announcements**: Create and view announcements
- **Comments**: Add and manage comments

## 🎯 Key Features

### Event Management
- ✅ **CRUD Operations**: Create, read, update, delete events
- ✅ **Status Tracking**: Upcoming → Active → Concluded
- ✅ **Winner System**: Individual (1st, 2nd, 3rd) vs Team (winner + Player of Match)
- ✅ **Filtering**: By status, branch, game type
- ✅ **Validation**: Input sanitization and validation

### Leaderboard System
- ✅ **Auto-calculation**: Based on concluded events
- ✅ **Points System**: Configurable points per position
- ✅ **Tie-breaking**: Most 1st place medals wins
- ✅ **Real-time Updates**: Updates when events are concluded

### Security Features
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Password Hashing**: bcrypt encryption
- ✅ **Input Validation**: XSS and injection protection
- ✅ **Rate Limiting**: DDoS protection
- ✅ **CORS Configuration**: Cross-origin security
- ✅ **Role-based Access**: Admin vs Public permissions

### Image Management
- ✅ **Cloudinary Integration**: Cloud image storage
- ✅ **Image Optimization**: Automatic resizing and compression
- ✅ **Multiple Formats**: Support for various image types
- ✅ **Secure Uploads**: Validation and size limits

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Cloudinary account (for images)

### Installation
1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   - Local MongoDB: `mongodb://localhost:27017/urjaa`
   - MongoDB Atlas: Use connection string from Atlas dashboard

4. **Start Server**
   ```bash
   npm run dev  # Development
   npm start    # Production
   ```

### Environment Variables
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/urjaa
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:5173
```

## 🧪 Testing

### Model Testing
```bash
node test-models.js
```

### API Testing
Use Postman or curl to test endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Get events
curl http://localhost:5000/api/events

# Admin login
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

## 📈 Performance Optimizations

### Database Indexes
- Events: `status`, `branchTags`, `gameType`, `day`
- Photos: `eventId`, `isCover`
- Comments: `announcementId`, `userId`

### Caching Strategy
- Leaderboard: Consider Redis for high traffic
- Event listings: In-memory caching for frequently accessed data

### Security Measures
- Rate limiting: 100 requests per 15 minutes
- Input sanitization: All user inputs validated
- JWT expiration: 7-day tokens with refresh capability
- CORS: Configured for frontend domain only

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas for database
- [ ] Configure Cloudinary for image storage
- [ ] Set strong JWT secret
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Recommended Platforms
- **Backend**: Render, Railway, or Heroku
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary
- **Monitoring**: LogRocket, Sentry

## 🔧 Development Workflow

1. **Feature Development**
   - Create/update models
   - Implement controllers
   - Add routes
   - Test with Postman

2. **Testing Strategy**
   - Unit tests for controllers
   - Integration tests for API endpoints
   - Database connection testing

3. **Code Quality**
   - ESLint for code formatting
   - Prettier for consistent styling
   - Git hooks for pre-commit validation

## 📝 API Response Format

All API responses follow a consistent format:

```javascript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## 🎉 What's Next?

The backend is now ready for:
1. **Frontend Integration**: Connect with React app
2. **Database Population**: Add sample data
3. **Image Upload**: Implement Cloudinary integration
4. **Testing**: Add comprehensive test suite
5. **Deployment**: Deploy to production environment

---

**Built with ❤️ for Urjaa Sports Fest 2025** 