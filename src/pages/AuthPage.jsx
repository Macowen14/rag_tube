import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Github, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import { getAuthRedirectUrl, isSupabaseConfigured, supabase } from "../lib/supabase";

const AuthPage = () => {
	const [mode, setMode] = useState("signin");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const user = useAuthStore((state) => state.user);
	const initialized = useAuthStore((state) => state.initialized);
	const location = useLocation();
	const navigate = useNavigate();

	const from = location.state?.from?.pathname || "/app";

	if (initialized && user) {
		return <Navigate to={from} replace />;
	}

	const handleOAuth = async (provider) => {
		if (!supabase) {
			toast.error("Supabase is not configured");
			return;
		}

		setLoading(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: getAuthRedirectUrl(from),
			},
		});

		if (error) {
			toast.error(error.message);
			setLoading(false);
		}
	};

	const handleEmailAuth = async (event) => {
		event.preventDefault();
		if (!supabase) {
			toast.error("Supabase is not configured");
			return;
		}

		if (!email.trim() || !password) {
			toast.error("Enter an email and password");
			return;
		}

		setLoading(true);
		try {
			const result =
				mode === "signin"
					? await supabase.auth.signInWithPassword({ email, password })
					: await supabase.auth.signUp({
							email,
							password,
							options: {
								emailRedirectTo: getAuthRedirectUrl(from),
							},
						});

			if (result.error) {
				toast.error(result.error.message);
				return;
			}

			if (mode === "signup" && !result.data.session) {
				toast.success("Check your email to confirm your account.");
				return;
			}

			navigate(from, { replace: true });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="h-full overflow-y-auto bg-paper px-4 py-8 md:px-6 md:py-12">
			<div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
				<div className="space-y-6">
					<div className="inline-flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2 text-sm font-bold text-muted">
						<ShieldCheck size={16} className="text-circuit" />
						Secure workspace access
					</div>
					<div className="space-y-4">
						<h1 className="max-w-2xl text-5xl font-black leading-[0.98] tracking-normal text-ink md:text-6xl">
							Sign in before working with video knowledge.
						</h1>
						<p className="max-w-xl text-lg leading-8 text-muted">
							Your Supabase session will gate app requests, provide a bearer
							token to the backend, and keep generated notes scoped to your
							account.
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-line bg-panel p-5 shadow-[0_24px_70px_rgba(24,21,18,0.12)]">
					<div className="mb-5 flex rounded-md border border-line bg-paper-soft p-1">
						<button
							type="button"
							onClick={() => setMode("signin")}
							className={`flex-1 rounded px-3 py-2 text-sm font-black transition-colors ${
								mode === "signin" ? "bg-ink text-paper" : "text-muted"
							}`}
						>
							Sign in
						</button>
						<button
							type="button"
							onClick={() => setMode("signup")}
							className={`flex-1 rounded px-3 py-2 text-sm font-black transition-colors ${
								mode === "signup" ? "bg-ink text-paper" : "text-muted"
							}`}
						>
							Create account
						</button>
					</div>

					{!isSupabaseConfigured && (
						<div className="mb-4 rounded-md border border-amber-note/30 bg-amber-note/10 p-3 text-sm font-semibold leading-6 text-ink">
							Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`
							before using auth.
						</div>
					)}

					<div className="grid gap-3 sm:grid-cols-2">
						<button
							type="button"
							onClick={() => handleOAuth("google")}
							disabled={loading || !isSupabaseConfigured}
							className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-paper-soft px-4 py-3 text-sm font-black text-ink transition-colors hover:bg-panel disabled:text-muted"
						>
							<span className="flex h-5 w-5 items-center justify-center rounded bg-tube text-xs font-black text-white">
								G
							</span>
							Google
						</button>
						<button
							type="button"
							onClick={() => handleOAuth("github")}
							disabled={loading || !isSupabaseConfigured}
							className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-paper-soft px-4 py-3 text-sm font-black text-ink transition-colors hover:bg-panel disabled:text-muted"
						>
							<Github size={18} />
							GitHub
						</button>
					</div>

					<div className="my-5 flex items-center gap-3">
						<div className="h-px flex-1 bg-line"></div>
						<span className="text-xs font-black uppercase tracking-[0.12em] text-muted">
							or email
						</span>
						<div className="h-px flex-1 bg-line"></div>
					</div>

					<form onSubmit={handleEmailAuth} className="space-y-3">
						<label className="flex items-center gap-3 rounded-md border border-line bg-paper-soft px-3 py-3 focus-within:border-circuit">
							<Mail size={18} className="text-muted" />
							<input
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="Email address"
								className="min-w-0 flex-1 bg-transparent text-sm font-medium text-ink placeholder:text-muted/70 focus:outline-none"
								autoComplete="email"
							/>
						</label>
						<label className="flex items-center gap-3 rounded-md border border-line bg-paper-soft px-3 py-3 focus-within:border-circuit">
							<LockKeyhole size={18} className="text-muted" />
							<input
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder="Password"
								className="min-w-0 flex-1 bg-transparent text-sm font-medium text-ink placeholder:text-muted/70 focus:outline-none"
								autoComplete={mode === "signin" ? "current-password" : "new-password"}
							/>
						</label>
						<button
							type="submit"
							disabled={loading || !isSupabaseConfigured}
							className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-tube px-5 py-3 text-sm font-black text-white transition-colors hover:bg-tube-dark disabled:bg-line disabled:text-muted"
						>
							{loading && <Loader2 className="animate-spin" size={16} />}
							{mode === "signin" ? "Sign in with email" : "Create account"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
