import {
  ReactNode,
  createContext,
  useReducer
} from "react";

export type ChatContextType = {
	ChatState: any
	dispatchGroupChats: React.Dispatch<any>
}

type ChildrenUserContextType = {
	children: ReactNode
}

export const GroupChatContext = createContext({} as ChatContextType);

export const GroupChatContextProvider = ({ children } : ChildrenUserContextType) => {
  const INITIAL_STATE = {
    ChatsInfo: {},
    Users: {},
    messages: {},
  };

  const GroupChatReducer = (ChatState : any[], action : any) => {
    switch (action.type) {
      case "CHANGE_CHATS":
        if(action.payload?.messages){
          return {
            ChatsInfo: action.payload?.ChatsInfo[0],
            Users: action.payload?.Users,
            messages: action.payload?.messages,
          };
        }else{
          return {
            ChatsInfo: action.payload?.ChatsInfo[0],
            Users: action.payload?.Users,
            messages: {},
          };
        }

      default:
        return ChatState;
    }
  };

  const [ChatState, dispatchGroupChats] = useReducer(GroupChatReducer, INITIAL_STATE);

  return (
    <GroupChatContext.Provider value={{ ChatState, dispatchGroupChats }}>
      {children}
    </GroupChatContext.Provider>
  );
};

