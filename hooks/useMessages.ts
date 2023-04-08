import { create } from "zustand";

interface MessagesStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useMessages = create<MessagesStore>((set) => ({
	isOpen: false,
	onOpen: () => set({isOpen: true}),
	onClose: () => set({isOpen: false})
}))

export default useMessages