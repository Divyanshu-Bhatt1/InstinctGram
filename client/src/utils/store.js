import {create} from "zustand";

const useStore=create((set)=>(
    {
        isAuthenticated:false,
        setIsAuthenticated:(authStatus) => set({ isAuthenticated: authStatus }),
        userId:null,
        setUserId:(id) => set({ userId: id }),
        socket:null,
        setSocket:(socket) => set({ socket: socket })

    }
))

export default useStore;