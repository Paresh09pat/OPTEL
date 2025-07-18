import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'

// Import all page components
import Home from './pages/Home'
import Explore from './pages/Explore'
import Albums from './pages/Albums'
import SavedPosts from './pages/SavedPosts'
import Events from './pages/Events'
import Forum from './pages/Forum'
import MyGroups from './pages/MyGroups'
import MyPages from './pages/MyPages'
import Blog from './pages/Blog'
import Article from './pages/Article'
import Jobs from './pages/Jobs'
import More from './pages/More'
import ChatDetailed from './pages/ChatDetailed'

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/saved-posts" element={<SavedPosts />} />
        <Route path="/events" element={<Events />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/my-groups" element={<MyGroups />} />
        <Route path="/my-pages" element={<MyPages />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/article" element={<Article />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/more" element={<More />} />
        <Route path="/chat-detailed" element={<ChatDetailed />} />
      </Routes>
    </MainLayout>
  )
}

export default App 