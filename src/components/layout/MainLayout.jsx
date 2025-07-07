import React from 'react'
import SideMenu from './SideMenu'

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white">
      <SideMenu />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default MainLayout 