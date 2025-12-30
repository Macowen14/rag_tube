import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Youtube, Home, Layout as LayoutIcon, Settings } from "lucide-react";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
	const location = useLocation();

	const isActive = (path) => {
		return location.pathname === path
			? "text-secondary font-bold"
			: "text-gray-400 hover:text-white";
	};

	return (
		<div className="h-screen bg-dark text-white font-sans selection:bg-secondary selection:text-white overflow-hidden flex flex-col">
			{/* Background Gradients (Fixed to Viewport) */}
			<div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
				<div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
				<div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
			</div>

			<nav className="flex-none h-16 z-50 backdrop-blur-md bg-dark/70 border-b border-white/10 relative">
				<div className="container mx-auto px-4 h-full flex items-center justify-between">
					<Link to="/" className="flex items-center gap-2 group">
						<div className="w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
							<img
								src="/logo.png"
								alt="RAG Tube Logo"
								className="w-full h-full object-cover"
							/>
						</div>
						<span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
							RAG Tube
						</span>
					</Link>

					<div className="flex items-center gap-6">
						<Link
							to="/"
							className={`flex items-center gap-2 transition-colors ${isActive(
								"/"
							)}`}
						>
							<Home size={20} />
							<span className="hidden md:block">Home</span>
						</Link>
						<Link
							to="/app"
							className={`flex items-center gap-2 transition-colors ${isActive(
								"/app"
							)}`}
						>
							<LayoutIcon size={20} />
							<span className="hidden md:block">App</span>
						</Link>
					</div>
				</div>
			</nav>

			<main className="flex-1 overflow-hidden relative">{children}</main>

			<Toaster
				position="bottom-right"
				toastOptions={{
					style: {
						background: "#1e293b",
						color: "#fff",
						border: "1px solid rgba(255,255,255,0.1)",
					},
				}}
			/>
		</div>
	);
};

export default Layout;
