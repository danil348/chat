import { create } from "zustand";

interface ChatsStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useChats = create<ChatsStore>((set) => ({
	isOpen: true,
	onOpen: () => set({isOpen: true}),
	onClose: () => set({isOpen: false})
}))

export default useChats