import { create } from "zustand";

interface UserProfileSettingsStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useUserProfileSettings = create<UserProfileSettingsStore>((set) => ({
	isOpen: true,
	onOpen: () => set({isOpen: true}),
	onClose: () => set({isOpen: false})
}))

export default useUserProfileSettings