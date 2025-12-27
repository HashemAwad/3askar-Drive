# 3askar Drive

A full-stack cloud storage platform enabling secure file and folder management with collaborative sharing capabilities, built as a modern alternative to Google Drive.

## Key Features

- **Hierarchical File Organization**: Nested folder structures with breadcrumb navigation and recursive operations
- **GridFS-Powered Storage**: Large file storage (up to 100MB per file) using MongoDB GridFS chunking
- **Multi-Authentication System**: OAuth 2.0 (Google) and credential-based authentication with bcrypt password hashing
- **Granular Access Control**: File/folder sharing with read/write permission management
- **Intelligent Views**: My Drive, Starred, Shared, and Trash segregation with location-based filtering
- **Batch Operations**: Multi-select capabilities for move, trash, restore, star, and download actions
- **Real-Time Storage Tracking**: Per-user quota management (500MB default) with automatic usage calculation
- **Advanced Search**: Full-text search across files and folders with metadata filtering
- **Password Recovery**: Token-based email reset flow using Nodemailer
- **Data Integrity Tools**: Orphan detection and cleanup scripts for GridFS consistency
- **Responsive UI**: Material-UI components with adaptive grid/list view modes

## Architecture / Design Overview

### Backend (Node.js + Express)
```
backend/
├── models/          # Mongoose schemas (User, File, Folder)
├── routes/          # RESTful API endpoints
│   ├── auth.js      # OAuth & credential authentication
│   ├── files. js     # File CRUD, upload/download via GridFS
│   ├── folders.js   # Folder hierarchy, nesting, sharing
│   ├── batch.js     # Bulk operations (trash, star, move)
│   └── user.js      # Profile, storage stats, user lookup
├── middleware/      # Authentication guards (ensureAuth)
├── utils/           # Storage quotas, email sender, orphan cleanup
└── config/          # Passport. js strategy configuration
```

**Core Technologies:**
- **Database**: MongoDB Atlas with GridFS for binary storage
- **Auth**: Passport.js (Google OAuth 2.0), bcryptjs for local credentials
- **Session Management**: cookie-session with configurable TTL
- **File Processing**: Multer (memory storage) + GridFS streams
- **Email**: Nodemailer with Gmail SMTP

### Frontend (React + Vite)
```
frontend/3askar/src/
├── components/      # Reusable UI (MenuBar, HoverActions, dialogs)
├── pages/           # Route-level views (MyDrive, Starred, Shared, Bin)
├── context/         # React Context (AuthContext, FileContext)
├── api/             # Axios HTTP clients (filesApi, foldersApi)
├── styles/          # Theme utilities (selection, card styles)
└── utils/           # Filtering, file type helpers
```

**Core Technologies:**
- **Framework**: React 19 with React Router v7
- **UI Library**: Material-UI v7 (MUI)
- **State Management**: Context API with optimized re-render strategies
- **HTTP Client**: Axios with credential-based sessions
- **Build Tool**: Vite 7 with HMR

### Data Flow
1. **Upload**:  Client → Multer (memory buffer) → GridFS stream → MongoDB chunks + File metadata
2. **Download**: Client → GridFS aggregation → stream to response
3. **Sharing**: Frontend permission dialog → backend `sharedWith` array update → access control middleware
4. **Folder Zip**:  Recursive GridFS fetch → Archiver stream → downloadable . zip

## How It Works

### Authentication Flow
- **OAuth**:  Redirect to Google consent → callback with profile → Passport session serialization
- **Local**:  Email/password → bcrypt compare → session creation (1hr default, 30 days if "Remember Me")

### File Management
1. **Upload**: Files chunked by GridFS (256KB default), metadata stored with `gridFsId` reference
2. **Permissions**: Read/write checks via `owner` or `sharedWith` array validation
3. **Soft Delete**: `isDeleted` flag + `location:  "TRASH"` for 30-day grace period

### Storage Accounting
- `updateStorage(userId, size, action)` increments/decrements `storageUsed` on upload/delete
- Upload blocked if `storageUsed + fileSize > storageLimit`

### Folder Hierarchy
- **Path Building**: Recursive parent lookup to construct `/Parent/Child/GrandChild`
- **Navigation**: `parentFolder` references enable tree traversal, breadcrumb generation via `getBreadcrumb` API

## Project Structure

```
3askar-Drive/
├── backend/
│   ├── config/
│   │   └── passport.js              # OAuth strategies
│   ├── middleware/
│   │   └── auth.js                  # ensureAuth guard
│   ├── models/
│   │   ├── User.js                  # User schema (Google/local, storage quotas)
│   │   ├── File.js                  # File metadata (gridFsId, sharing, location)
│   │   └── Folder.js                # Folder schema (publicId, nesting, permissions)
│   ├── routes/
│   │   ├── auth.js                  # /auth/login, /auth/google, /auth/logout
│   │   ├── files.js                 # /files/upload, /files/: id, /files/:id/download
│   │   ├── folders. js               # /folders, /folders/:id, /folders/: id/zip
│   │   ├── batch.js                 # /batch/trash, /batch/star, /batch/delete
│   │   └── user.js                  # /user/profile, /user/find
│   ├── utils/
│   │   ├── storage.js               # updateStorage utility
│   │   ├── sendEmail.js             # Nodemailer wrapper
│   │   ├── cleanupOrphans.js        # Orphan scan script
│   │   └── removeOrphans.js         # Orphan deletion script
│   ├── server.js                    # Express app entry point
│   └── package.json
│
├── frontend/3askar/
│   ├── src/
│   │   ├── api/
│   │   │   ├── filesApi.js          # File HTTP operations
│   │   │   └── foldersApi.js        # Folder HTTP operations
│   │   ├── components/
│   │   │   ├── Homepage.jsx         # Main drive view (nested folders)
│   │   │   ├── MenuBar.jsx          # Top navigation bar
│   │   │   ├── ProtectedRoute.jsx   # Auth guard for routes
│   │   │   ├── RenameDialog.jsx     # Modal for rename operations
│   │   │   ├── ShareDialog.jsx      # Sharing permission UI
│   │   │   ├── BatchMoveDialog.jsx  # Folder picker for move ops
│   │   │   ├── DetailsPanel.jsx     # File details sidebar
│   │   │   └── HoverActions.jsx     # Quick action buttons
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # User session state
│   │   │   └── fileContext.jsx      # File/folder global state
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx        # Auth entry (login/register)
│   │   │   ├── MyDrive.jsx          # Root drive view
│   │   │   ├── Starred.jsx          # Starred items view
│   │   │   ├── Shared.jsx           # Shared with me view
│   │   │   ├── Bin.jsx              # Trash view
│   │   │   ├── SearchResults.jsx    # Search results page
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   ├── styles/
│   │   │   └── selectionTheme.js    # MUI theme overrides
│   │   ├── utils/
│   │   │   ├── fileHelpers.js       # Type detection, icon mapping
│   │   │   └── filterHelpers.js     # Search/filter logic
│   │   ├── App.jsx                  # Router configuration
│   │   └── main.jsx                 # React root
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- **Node.js**: v18+ (tested on v20)
- **MongoDB Atlas**: Account with connection URI
- **Gmail Account**: For email notifications (App Password required)
- **Google OAuth Credentials**: Client ID and secret from Google Cloud Console

### Backend Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/HashemAwad/3askar-Drive.git
   cd 3askar-Drive/backend
   npm install
   ```

2. **Environment Configuration**  
   Create `.env` in `backend/`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/3askar-drive
   SESSION_SECRET=your-secret-key-min-32-chars
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-client-id. apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   
   # Email (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   PORT=5000
   ```

3. **Run Development Server**
   ```bash
   npm run dev       # Uses nodemon for hot reload
   # OR
   npm start         # Production mode
   ```

   Server starts on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd ../frontend/3askar
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   App available at `http://localhost:5173`

### Production Build
```bash
npm run build     # Creates optimized build in dist/
npm run preview   # Preview production build
```

## Configuration

### Backend Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `SESSION_SECRET` | Cookie encryption key (32+ chars recommended) | Yes |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 client secret | Yes |
| `EMAIL_USER` | Gmail address for notifications | Yes |
| `EMAIL_PASS` | Gmail app password | Yes |
| `PORT` | Server port | No (default: 5000) |

### Storage Limits
```javascript
// backend/routes/files.js
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;  // 100MB per file

// backend/models/User.js
storageLimit: { default: 500 * 1024 * 1024 }  // 500MB per user
```

### Session Duration
```javascript
// backend/routes/auth.js (POST /login)
if (rememberMe) {
  req.sessionOptions.maxAge = 30 * 24 * 60 * 60 * 1000;  // 30 days
} else {
  req.sessionOptions.maxAge = 60 * 60 * 1000;  // 1 hour
}
```

## Usage Guide

### Basic Operations
```bash
# Upload file via frontend
1. Navigate to My Drive
2. Click "New" → "File Upload"
3. Select file (max 100MB)
4. File streams to GridFS, metadata saved

# Create folder structure
1. Click "New" → "New Folder"
2. Name folder
3. Drag-drop files into folder
4. Folders nestable to arbitrary depth

# Share with permissions
1. Right-click file/folder → "Share"
2. Enter email address
3. Select "Can view" or "Can edit"
4. User receives access (no email notification yet)
```

### API Examples
```javascript
// Upload file
const formData = new FormData();
formData.append('file', fileBlob);
await axios.post('/files/upload', formData, {
  headers:  { 'Content-Type': 'multipart/form-data' }
});

// Create folder
await axios.post('/folders', {
  name: 'Project Files',
  parentFolder: parentId  // null for root
});

// Share folder
await axios.patch(`/folders/${folderId}`, {
  sharedWith: [
    { user: userId, canEdit: true }
  ]
});

// Batch trash
await axios.post('/batch/trash', {
  fileIds: ['file1', 'file2'],
  folderIds: ['folder1'],
  isDeleted: true
});
```

## Roadmap / Future Improvements

- [ ] **Real-Time Collaboration**: Socket.io for live file updates
- [ ] **File Versioning**: Track revisions with rollback capability
- [ ] **Thumbnail Generation**: Image preview using Sharp or Jimp
- [ ] **Elastic Search Integration**: Advanced search with fuzzy matching
- [ ] **Docker Compose**:  Containerized dev environment
- [ ] **CI/CD Pipeline**: GitHub Actions for automated testing/deployment
- [ ] **Mobile App**: React Native companion app
- [ ] **File Comments**: Inline commenting system
- [ ] **Activity Logs**: Audit trail for all operations
- [ ] **Folder/File Templates**: Quick project scaffolding
- [ ] **Public Link Sharing**: Anonymous access with expiration
- [ ] **WebDAV Support**: Mount as network drive

## Contributors

**Project Team** (CMPS 278 - Web Programming & Design)  
- **HashemAwad** 
- **Ameera Albahrani**
- **Ahmad Faleh**

---

**Built with:** MongoDB · Express · React · Node.js · GridFS · Passport.js · Material-UI · Vite
