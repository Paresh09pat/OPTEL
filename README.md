# Optel App

A modern React application built with Vite, Tailwind CSS (v4), and React Router. Features a beautiful side navigation menu inspired by social media platforms.

## 🚀 Features

- **Modern Tech Stack**: React 18, Vite, Tailwind CSS v4, React Router DOM
- **Responsive Design**: Beautiful side navigation with colorful icons
- **Proper Folder Structure**: Organized components, pages, and utilities
- **React Icons**: FontAwesome icons for consistent design
- **Active Route Highlighting**: Visual feedback for current page
- **User Profile Section**: Complete with avatar and user details

## 📁 Project Structure

```
src/
├── components/
│   └── layout/
│       ├── SideMenu.jsx      # Main navigation sidebar
│       └── MainLayout.jsx    # Layout wrapper component
├── pages/                    # All page components
│   ├── Home.jsx
│   ├── Explore.jsx
│   ├── Albums.jsx
│   ├── SavedPosts.jsx
│   ├── Events.jsx
│   ├── Forum.jsx
│   ├── MyGroups.jsx
│   ├── MyPages.jsx
│   ├── Blog.jsx
│   ├── Article.jsx
│   ├── Jobs.jsx
│   └── More.jsx
├── constants/
│   └── navigation.js         # Navigation menu configuration
├── App.jsx                   # Main app component with routing
├── main.jsx                  # React app entry point
└── index.css                 # Global styles with Tailwind imports
```

## 🛠️ Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 🎨 Design Features

- **Sidebar Navigation**: Fixed width sidebar with logo, navigation items, create post button, and user profile
- **Colorful Icons**: Each navigation item has a unique colored background with white icons
- **Active States**: Visual highlighting for the current page
- **Hover Effects**: Smooth transitions on hover and click interactions
- **User Profile**: Bottom section with avatar, name, and username

## 🔧 Technology Details

- **Tailwind CSS v4**: Using the latest Vite plugin for optimal performance
- **React Router**: Client-side routing with active route detection
- **React Icons**: FontAwesome icons for consistent iconography
- **Responsive**: Mobile-first design approach

## 📝 Navigation Items

The sidebar includes these main sections:
- Home, Explore, Albums, Saved Posts
- Events, Forum, My Groups, My Pages
- Blog, Article, Jobs, More

Each item has its own route and page component for easy expansion.

## 🎯 Future Enhancements

- Add authentication system
- Implement real user profiles
- Add dark mode support
- Mobile responsive sidebar
- Search functionality
- Notification system 