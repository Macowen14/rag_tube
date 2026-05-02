import React, { useEffect } from "react";
import { supabase } from "../lib/supabase";
import useAuthStore from "../store/useAuthStore";
import useStore from "../store/useStore";

const AuthProvider = ({ children }) => {
	const setSession = useAuthStore((state) => state.setSession);
	const clearSession = useAuthStore((state) => state.clearSession);
	const setActiveUser = useStore((state) => state.setActiveUser);
	const resetState = useStore((state) => state.resetState);

	useEffect(() => {
		if (!supabase) {
			clearSession();
			return undefined;
		}

		let mounted = true;

		supabase.auth.getSession().then(({ data }) => {
			if (!mounted) return;
			setSession(data.session);
			setActiveUser(data.session?.user?.id ?? null);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_OUT") {
				clearSession();
				setActiveUser(null);
				resetState();
				return;
			}

			setSession(session);
			setActiveUser(session?.user?.id ?? null);
		});

		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, [clearSession, resetState, setActiveUser, setSession]);

	return children;
};

export default AuthProvider;
