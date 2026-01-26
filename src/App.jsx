import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { ChatProvider } from './context/ChatContext';
import { CreatePostProvider } from './context/CreatePostContext';

// Page imports
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Albums from "./pages/Albums";
import SavedPosts from "./pages/SavedPosts";
import Events from "./pages/Events";
import Forum from "./pages/Forum";
import MyGroups from "./pages/MyGroups";
import MyPages from "./pages/PagesComp/MyPages";
import Blog from "./pages/Blog";
import Article from "./pages/Article";
import Jobs from "./pages/Jobs";
import Offers from "./pages/Offers";
import Market from "./pages/Market";
import ProductDetail from "./pages/ProductDetail";
import More from "./pages/More";
import ChatDetailed from "./pages/ChatDetailed";
import MyAlbums from "./pages/MyAlbums";
import FullAlbumView from "./pages/FullAlbum";
import CreateAlbum from "./pages/CreateAlbum";
import MainPages from "./pages/PagesComp/MainPages";
import CreatePage from "./pages/PagesComp/CreatePage";
import PageDetailed from "./pages/PagesComp/PageDetailed";
import MainPageSetting from "./pages/PageSetting/MainPageSetting";
import MainProfileSetting from "./pages/ProfileSetting/MainProfileSetting";
import Profile from "./pages/Profile";
import PageProfile from "./pages/PageSetting/PageProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Register from "./pages/PageSetting/Register";
import ProfilePhotoUpload from "./pages/ProfilePhotoUpload";
import TellUsAboutYou from "./pages/TellUsAboutYou";
import ProtectedRoute from "./components/ProtectedRoute";
import BlogDetailed from "./pages/BlogDetailed";
import CreateBlog from "./pages/CreateBlog";
import CreateJob from "./pages/CreateJob";
import CreateForum from "./pages/CreateForum";
import PostDetail from "./pages/PostDetail";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import NotFound404 from "./pages/NotFound404";
import GroupDetailed from "./pages/GroupDetailed";
import ForumDetailed from "./pages/ForumDetailed";
import JobDetailed from "./pages/JobDetailed";
import OfferDetailed from "./pages/OfferDetailed";
import Wallet from "./pages/Wallet";
import VerifyAccount from "./pages/VerifyAccount";
import { ToastContainer } from "react-toastify";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(localStorage.getItem("session_id"));

  return (
    <CreatePostProvider>
      <ChatProvider>
        <Routes>
          {/* Public Routes (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile-photo-upload" element={<ProfilePhotoUpload />} />
          <Route path="/tell-us-about-you" element={<TellUsAboutYou />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="*" element={<NotFound404 />} />

          {/* Protected / Layout Routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/saved-posts" element={<SavedPosts />} />
              <Route path="/events" element={<Events />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/:forumId" element={<ForumDetailed />} />
              <Route path="/forum/create" element={<CreateForum />} />
              <Route path="/PagesComp/MainPages" element={<MainPages />} />
              <Route path="/page/:pageId" element={<PageDetailed />} />
              <Route path="/page/:pageId/settings" element={<MainPageSetting />} />
              <Route path="/my-groups" element={<MyGroups />} />
              <Route path="/group/:groupId" element={<GroupDetailed />} />
              <Route path="/my-pages" element={<MyPages />} />
              <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:blogId" element={<BlogDetailed />} />
              <Route path="/blog/create" element={<CreateBlog />} />
              <Route path="/post/:postId" element={<PostDetail />} />
              <Route path="/article" element={<Article />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:jobId" element={<JobDetailed />} />
              <Route path="/jobs/create" element={<CreateJob />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/offers/:offerId" element={<OfferDetailed />} />
              <Route path="/market" element={<Market />} />
              <Route path="/market/:productId" element={<ProductDetail />} />
              <Route path="/more" element={<More />} />
              <Route path="/chat-detailed/:chatId" element={<ChatDetailed />} />
              <Route path="/my-albums" element={<MyAlbums />} />
              <Route path="/my-albums/:albumTitle" element={<FullAlbumView />} />
              <Route path="/my-albums/create" element={<CreateAlbum />} />
              <Route path="/pagescomp/mainpages/createpage" element={<CreatePage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/profile-settings" element={<MainProfileSetting />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/verify-account" element={<VerifyAccount />} />
              <Route path="/PageProfile" element={<PageProfile />} />
            </Route>
          </Route>
        </Routes>
        
        {/* Toast notifications container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ChatProvider>
    </CreatePostProvider>
  );
}

export default App;
