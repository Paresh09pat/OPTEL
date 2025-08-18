import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Page imports
import Home from './pages/Home';
import Explore from './pages/Explore';
import Albums from './pages/Albums';
import SavedPosts from './pages/SavedPosts';
import Events from './pages/Events';
import Forum from './pages/Forum';
import MyGroups from './pages/MyGroups';
import MyPages from './pages/MyPages';
import Blog from './pages/Blog';
import Article from './pages/Article';
import Jobs from './pages/Jobs';
import More from './pages/More';
import ChatDetailed from './pages/ChatDetailed';
import MyAlbums from './pages/MyAlbums';
import FullAlbumView from './pages/FullAlbum';
import CreateAlbum from './pages/CreateAlbum';
import MainPages from './pages/PagesComp/MainPages';
import CreatePage from './pages/PagesComp/CreatePage';
import MainPageSetting from './pages/PageSetting/MainPageSetting';
import Profile from './pages/Profile';
import PageProfile from './pages/PageSetting/PageProfile';
import Login from './pages/Login';
import Register from './pages/PageSetting/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(localStorage.getItem("session_id"));

  const getSession = async () => {
    try {

      setLoading(true);
      setError(null);

      // Get access token from localStorage
      const accessToken = localStorage.getItem("access_token");
      const userId = localStorage.getItem("user_id");

      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      // formData.append('user_id', userId);
      formData.append('type', 'get');
      const response = await fetch(`https://ouptel.com/api/sessions?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData.toString(),
      })

      const data = await response.json();
      if (data?.api_status === 200) {

        localStorage.setItem("session_id", data?.data[0]?.session_id);

      } else {
        setError(response?.data?.errors?.error_text);
      }
      setSession(data?.data[0]?.session_id);

      setLoading(false);

    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
      setLoading(false);
    }

  }
  useEffect(() => {
    getSession();
  }, []);

  return (
    <Routes>
      {/* Public Routes (no layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected / Layout Routes */}
      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/saved-posts" element={<SavedPosts />} />
          <Route path="/events" element={<Events />} />
          <Route path="/forum" element={<Forum />} />
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
          <Route path="/pagescomp/mainpages/createpage" element={<CreatePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pagescomp/mainpages/pagesetting/mainpagesetting" element={<MainPageSetting />} />
          <Route path="/PageProfile" element={<PageProfile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
