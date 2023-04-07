import '@/styles/globals.scss'

import React from 'react'
import { AuthContextProvider } from '../../context/AuthContext'
import { ChatContextProvider } from '../../context/ChatContext'
import Home from '../pages/index'

import '../../components/Button/Button.scss'
import '../../components/Input/Input.scss'
import '../../components/Layout/Chats/Chats.scss'
import '../../components/Layout/Chats/Messege/Messege.scss'
import '../../components/Layout/Chats/SelectUsersModal/SelectUsersModal.scss'
import '../../components/Layout/Layout.scss'
import '../../components/Layout/NavBarItem/NavBarItem.scss'
import '../../components/Layout/Profile/Profile.scss'
import '../../components/Layout/Search/Search.scss'
import '../../components/Layout/Settings/Settings.scss'
import '../../components/Layout/Settings/SettingsContent/SettingsContent.scss'
import '../../components/Layout/Settings/SettingScreans/UserProfileSettings/UserProfileSettings.scss'
import '../../components/Layout/Settings/SettingsSidebar/SettingsSidebar.scss'
import '../../components/Modal/Modal.scss'
import '../../components/modals/SearchModal/SearchModal.scss'
import '../../components/Sidebar/Sidebar.scss'
import '../../components/TopBar/TopBar.scss'
import { GroupChatContextProvider } from '../../context/GroupChatContext'

export default function App() {
  

  return (
    <AuthContextProvider>
      <ChatContextProvider>
        <GroupChatContextProvider>
          <React.StrictMode>
            <Home/>
          </React.StrictMode>
        </GroupChatContextProvider>
      </ChatContextProvider>
    </AuthContextProvider>
  )
}
