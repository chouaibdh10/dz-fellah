import React, { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import './AdminLayout.css'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen((open) => !open)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="admin-layout">
      <button
        className="admin-sidebar-toggle"
        aria-label="Menu"
        aria-expanded={sidebarOpen}
        onClick={toggleSidebar}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>
      {sidebarOpen && <div className="admin-sidebar-backdrop" onClick={closeSidebar} />}
      <AdminSidebar isOpen={sidebarOpen} onLinkClick={closeSidebar} />
      <div className="admin-main-content">
        {children}
      </div>
    </div>
  )
}

export default AdminLayout
