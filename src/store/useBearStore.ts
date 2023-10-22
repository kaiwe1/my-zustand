import { create } from "../zustand";

const useBearStore = create((set) => ({
    bear: 0,
    increment: () => set((state) => ({ bear: state.bear + 1})),
    decrement: () => set((state) => ({ bear: state.bear - 1}))
}))

export default useBearStore