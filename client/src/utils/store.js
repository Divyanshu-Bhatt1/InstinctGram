import {create} from "zustand";

const useStore=create((set)=>(
    {
        isAuthenticated:false,
        setIsAuthenticated:(authStatus) => set({ isAuthenticated: authStatus }),
        userId:null,
        setUserId:(id) => set({ userId: id }),
        socket:null,
        setSocket:(socketI) => set({ socket: socketI })

    }
))

export default useStore;