import { create } from "zustand";

interface FooStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useFoo = create<FooStore>((set) => ({
	isOpen: false,
	onOpen: () => set({isOpen: true}),
	onClose: () => set({isOpen: false})
}))

export default useFoo