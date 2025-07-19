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
import MyAlbums from './pages/MyAlbums'
import FullAlbumView from './pages/FullAlbum'
import CreateAlbum from './pages/CreateAlbum'
import MainPages from './pages/PagesComp/MainPages'
import CreatePage from './pages/PagesComp/CreatePage'
import MainPageSetting from './pages/PageSetting/MainPageSetting'
import Profile from './pages/Profile'
function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/saved-posts" element={<SavedPosts />} />
        <Route path="/events" element={<Events />} />
        <Route path="/PagesComp/MainPages" element={<MainPages />} />
        <Route path="/my-groups" element={<MyGroups />} />
        <Route path="/my-pages" element={<MyPages />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/article" element={<Article />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/more" element={<More />} />
        <Route path="/chat-detailed" element={<ChatDetailed />} />
        <Route path="/my-albums" element={<MyAlbums />} />
        <Route path="/my-albums/:albumTitle" element={<FullAlbumView />} />
        <Route path="/my-albums/create" element={<CreateAlbum />} />
        <Route path="/PagesComp/MainPages/CreatePage" element={<CreatePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/PageSetting/MainPageSetting" element={<MainPageSetting />} />
      </Routes>
    </MainLayout>
  )
}

export default App 