import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Layout as LayoutIcon, LogOut, UserCircle } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "../lib/supabase";
import useAuthStore from "../store/useAuthStore";

const Layout = ({ children }) => {
	const location = useLocation();
	const user = useAuthStore((state) => state.user);

	const isActive = (path) => {
		return location.pathname === path
			? "bg-ink text-paper"
			: "text-muted hover:bg-panel hover:text-ink";
	};

	const handleSignOut = async () => {
		if (!supabase) return;
		const { error } = await supabase.auth.signOut();
		if (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className="h-screen bg-paper text-ink font-sans overflow-hidden flex flex-col">
			<nav className="flex-none h-16 z-50 bg-paper/95 border-b border-line relative">
				<div className="h-full max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
					<Link to="/" className="flex items-center gap-2 group">
						<div className="w-9 h-9 rounded-md flex items-center justify-center overflow-hidden border border-line bg-panel">
							<img
								src="/logo.png"
								alt="RAG Tube Logo"
								className="w-full h-full object-cover"
							/>
						</div>
						<span className="text-lg font-black tracking-tight text-ink">
							RAG Tube
						</span>
					</Link>

					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1 rounded-md border border-line bg-paper-soft p-1">
							<Link
								to="/"
								className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold transition-colors ${isActive(
									"/"
								)}`}
							>
								<Home size={16} />
								<span className="hidden md:block">Home</span>
							</Link>
							<Link
								to="/app"
								className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold transition-colors ${isActive(
									"/app"
								)}`}
							>
								<LayoutIcon size={16} />
								<span className="hidden md:block">Workspace</span>
							</Link>
						</div>

						{user ? (
							<div className="hidden items-center gap-2 rounded-md border border-line bg-panel px-2 py-1.5 md:flex">
								<UserCircle size={17} className="text-circuit" />
								<span className="max-w-40 truncate text-xs font-bold text-muted">
									{user.email}
								</span>
								<button
									type="button"
									onClick={handleSignOut}
									className="flex h-7 w-7 items-center justify-center rounded text-muted transition-colors hover:bg-paper-soft hover:text-ink"
									aria-label="Sign out"
									title="Sign out"
								>
									<LogOut size={15} />
								</button>
							</div>
						) : (
							<Link
								to="/auth"
								className={`hidden rounded-md border border-line px-3 py-2 text-sm font-bold transition-colors md:block ${isActive(
									"/auth"
								)}`}
							>
								Sign in
							</Link>
						)}
					</div>
				</div>
			</nav>

			<main className="flex-1 overflow-hidden relative">{children}</main>

			<Toaster
				position="bottom-right"
				toastOptions={{
					style: {
						background: "#ffffff",
						color: "#181512",
						border: "1px solid #d8e1dc",
						boxShadow: "0 18px 45px rgba(24, 21, 18, 0.14)",
					},
				}}
			/>
		</div>
	);
};

export default Layout;
