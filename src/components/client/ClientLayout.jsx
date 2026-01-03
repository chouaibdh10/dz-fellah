import React from 'react'
import ClientSidebar from './ClientSidebar'
import '../../styles/ClientLayout.css'

const ClientLayout = ({ children }) => {
  return (
    <div className="client-layout">
      <ClientSidebar />
      <div className="client-main-content">
        {children}
      </div>
    </div>
  )
}

export default ClientLayout
