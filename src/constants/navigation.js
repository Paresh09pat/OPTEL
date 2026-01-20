// src/constants/navigation.js
import homeIcon from '/icons/home.png'
import exploreIcon from '/icons/compass.png'
import albumsIcon from '/icons/album.png'
import savedIcon from '/icons/save.png'
import eventsIcon from '/icons/event.png'
import forumIcon from '/icons/forum.png'
import groupsIcon from '/icons/group.png'
import pagesIcon from '/icons/page.png'
import blogIcon from '/icons/blog.png'
import articleIcon from '/icons/article.png'
import jobsIcon from '/icons/job.png'
import offerIcon from '/icons/job.png' // Using job icon as placeholder, can be replaced later
import moreIcon from '/icons/more.png'
import marketIcon from '/icons/market.svg'

export const navigationItems = [
  {
    id: 'home',
    name: 'Home',
    path: '/',
    icon: homeIcon,
  },
  {
     id: 'explore',
     name: 'Explore',
     path: '/explore',
     icon: exploreIcon,
  },
  {
    id: 'albums',
    name: 'Albums',
    path: '/my-albums',
    icon: albumsIcon,
  },
  {
    id: 'saved-posts',
    name: 'Saved Posts',
    path: '/saved-posts',
    icon: savedIcon,
  },
  {
    id: 'events',
    name: 'Events',
    path: '/events',
    icon: eventsIcon,
  },
  {
    id: 'forum',
    name: 'Forum',
    path: '/forum',
    icon: forumIcon,
  },
  {
    id: 'my-groups',
    name: 'My Groups',
    path: '/my-groups',
    icon: groupsIcon,
  },
  {
    id: 'my-pages',
    name: 'My Pages',
    path: '/pagescomp/mainpages',
    icon: pagesIcon,
  },
  {
    id: 'blog',
    name: 'Blog',
    path: '/blog',
    icon: blogIcon,
  },
  {
    id: 'article',
    name: 'Article',
    path: '/article',
    icon: articleIcon,
  },
  {
    id: 'jobs',
    name: 'Jobs',
    path: '/jobs',
    icon: jobsIcon,
  },
  {
    id: 'offers',
    name: 'Offers',
    path: '/offers',
    icon: offerIcon,
    color: 'bg-gray-100', // Default background color for icon
  },
  {
    id: 'market',
    name: 'Market',
    path: '/market',
    icon: marketIcon,
    color: 'bg-purple-100', // Default background color for icon
  },
  // {
  //   id: 'more',
  //   name: 'More',
  //   path: '/more',
  //   icon: moreIcon,
  // },
]
