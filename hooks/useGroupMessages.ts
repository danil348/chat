import { create } from "zustand";

interface GroupMessagesStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useGroupMessages = create<GroupMessagesStore>((set) => ({
	isOpen: false,
	onOpen: () => set({isOpen: true}),
	onClose: () => set({isOpen: false})
}))

export default useGroupMessages