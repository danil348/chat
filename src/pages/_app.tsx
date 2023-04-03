import '@/styles/globals.scss'

import React, { useContext } from 'react'
import '../../components/Button/Button.scss'
import '../../components/Input/Input.scss'
import '../../components/Layout/Chats/Chats.scss'
import '../../components/Layout/Layout.scss'
import '../../components/Layout/NavBarItem/NavBarItem.scss'
import '../../components/Layout/Profile/Profile.scss'
import '../../components/Layout/Search/Search.scss'
import '../../components/Modal/Modal.scss'
import '../../components/Sidebar/Sidebar.scss'
import { AuthContext, AuthContextProvider } from '../../context/AuthContext'
import Home from '../pages/index'

export default function App() {


  return (
    <AuthContextProvider>
      <React.StrictMode>
        <Home/>
      </React.StrictMode>
    </AuthContextProvider>
  )
}
