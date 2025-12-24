import {create} from 'zustand'
import { axiosInstance } from "../lib/axios.js"; // import axiosInstance from '../lib/axios.js'
import { toast } from "react-hot-toast";
import { initializeSocket, disconnectSocket } from '../socket/socket.client.js';

export const useAuthStore = create((set) => ({
	authUser: null,
	checkingAuth: true,
	loading: false,



	signup: async (signupData) => {
		try {
			set({ loading: true });
			const res = await axiosInstance.post("/auth/signup", signupData);
			set({ authUser: res.data.user });
			initializeSocket(res.data.user._id);


			toast.success("Account created successfully");
			} catch (error) {
				const msg = error?.response?.data?.message || error?.message || "Something went wrong";
				toast.error(msg);
		} finally {
			set({ loading: false });
		}
	},
	login: async (loginData) => {
		try {
			set({ loading: true });
			const res = await axiosInstance.post("/auth/login", loginData);
			set({ authUser: res.data.user });
			initializeSocket(res.data.user._id);
			toast.success("Logged in successfully");
		} catch (error) {
			const msg = error?.response?.data?.message || error?.message || "Something went wrong";
			toast.error(msg);
		} finally {
			set({ loading: false });
		}
	},
	logout: async () => {
		try {
			const res = await axiosInstance.post("/auth/logout");
			disconnectSocket();
			if (res.status === 200) set({ authUser: null });
		} catch (error) {
			const msg = error?.response?.data?.message || error?.message || "Something went wrong";
			toast.error(msg);
		}
	},

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get("/auth/me");
			initializeSocket(res.data.user._id);
			set({ authUser: res.data.user });
		} catch (error) {
			set({ authUser: null });
			console.log(error);
		} finally {
			set({ checkingAuth: false });
		}
	},
	setAuthUser: (user) => set({ authUser: user }),



}))