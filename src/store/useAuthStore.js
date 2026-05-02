import { create } from "zustand";

const useAuthStore = create((set) => ({
	initialized: false,
	loading: true,
	session: null,
	user: null,
	accessToken: null,

	setSession: (session) =>
		set({
			initialized: true,
			loading: false,
			session,
			user: session?.user ?? null,
			accessToken: session?.access_token ?? null,
		}),

	clearSession: () =>
		set({
			initialized: true,
			loading: false,
			session: null,
			user: null,
			accessToken: null,
		}),
}));

export default useAuthStore;
