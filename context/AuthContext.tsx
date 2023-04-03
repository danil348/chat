import { createContext, useState } from "react";

export type UserContextType = {
	currentUser: any
	setCurrentUser: any 
}

type ChildrenUserContextType = {
	children: React.ReactNode
}

type AuthUser = {
	email: string
	name: string
}

export const AuthContext = createContext({} as UserContextType)

export const AuthContextProvider = ({children} : ChildrenUserContextType) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

	return (
		<AuthContext.Provider value={{currentUser ,setCurrentUser }} >
			{children}
		</AuthContext.Provider>
	)
}
