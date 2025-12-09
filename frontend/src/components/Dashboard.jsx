import React from 'react'
import '../css/Dasboard.css'
import Sidebar_use from './Sidebar_use'
import FloatingChatbot from './Chat'

const Dashboard = () => {
  return (
    <div>
        <Sidebar_use />
        <FloatingChatbot />
    </div>
  )
}

export default Dashboard