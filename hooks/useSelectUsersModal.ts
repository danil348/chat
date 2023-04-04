import { create } from "zustand";

interface SelectUsersModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
	onToggle: (isOpen : boolean) => void;
}

const useSelectUsersModal = create<SelectUsersModalStore>((set) => ({
	isOpen: false,
	onOpen: () => set({isOpen: true}),
	onClose: () => set({isOpen: false}),
	onToggle: (opened) => set({isOpen: !opened})
}))

export default useSelectUsersModal