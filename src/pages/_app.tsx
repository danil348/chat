import '@/styles/globals.scss'

import React from 'react'
import { AuthContextProvider } from '../../context/AuthContext'
import { ChatContextProvider } from '../../context/ChatContext'
import Home from '../pages/index'

import '../../components/Button/Button.scss'
import '../../components/Input/Input.scss'
import '../../components/Layout/Chats/Chats.scss'
import '../../components/Layout/Chats/SelectUsersModal/SelectUsersModal.scss'
import '../../components/Layout/Layout.scss'
import '../../components/Layout/NavBarItem/NavBarItem.scss'
import '../../components/Layout/Profile/Profile.scss'
import '../../components/Layout/Search/Search.scss'
import '../../components/Layout/Settings/Settings.scss'
import '../../components/Layout/Settings/SettingsContent/SettingsContent.scss'
import '../../components/Layout/Settings/SettingsSidebar/SettingsSidebar.scss'
import '../../components/Modal/Modal.scss'
import '../../components/Sidebar/Sidebar.scss'
import '../../components/TopBar/TopBar.scss'
import '../../components/modals/SearchModal/SearchModal.scss'

export default function App() {
  return (
    <AuthContextProvider>
      <ChatContextProvider>
        <React.StrictMode>
          <Home/>
        </React.StrictMode>
      </ChatContextProvider>
    </AuthContextProvider>
  )
}
