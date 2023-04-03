import {
  createContext,
  useContext,
  useReducer
} from "react";
import { AuthContext } from "./AuthContext";

export type ChatContextType = {
	state: any
	dispatch: React.Dispatch<any>
}

type ChildrenUserContextType = {
	children: React.ReactNode
}

export const ChatContext = createContext({} as ChatContextType);

export const ChatContextProvider = ({ children } : ChildrenUserContextType) => {
  const currentUser  = useContext(AuthContext)
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state : any[], action : any) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.currentUser?.uid > action.payload?.uid
              ? currentUser.currentUser?.uid + action.payload?.uid
              : action.payload?.uid + currentUser.currentUser?.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};