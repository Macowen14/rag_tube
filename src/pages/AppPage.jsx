import React, { useState } from "react";
import useStore from "../store/useStore";
import VideoIngest from "../components/VideoIngest";
import ChatInterface from "../components/ChatInterface";
import NotesDisplay from "../components/NotesDisplay";
import ModelSelector from "../components/ModelSelector";
import { MessageSquare, FileText, Youtube, Menu, Settings } from "lucide-react";

const AppPage = () => {
	const [activeConfig, setActiveConfig] = useState("chat"); // 'ingest' | 'chat' | 'notes'
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Helper to render active component
	const renderContent = () => {
		switch (activeConfig) {
			case "ingest":
				return (
					<div className="max-w-3xl mx-auto pt-10">
						<h2 className="text-2xl font-bold mb-6">Ingest New Video</h2>
						<VideoIngest />
						<div className="mt-12 p-6 bg-dark-light/50 rounded-xl border border-white/5">
							<h3 className="text-lg font-semibold mb-2">Instructions</h3>
							<ul className="list-disc list-inside space-y-2 text-gray-400">
								<li>Paste a YouTube video URL or ID.</li>
								<li>Click "Process" to fetch transcripts and embed chunks.</li>
								<li>Once done, switch to Chat or Notes to interact with it.</li>
							</ul>
						</div>
					</div>
				);
			case "chat":
				return (
					<div className="h-full">
						<ChatInterface />
					</div>
				);
			case "notes":
				return (
					<div className="h-full">
						<NotesDisplay />
					</div>
				);
			default:
				return <ChatInterface />;
		}
	};

	const NavButton = ({ id, label, icon: Icon }) => (
		<button
			onClick={() => {
				setActiveConfig(id);
				setMobileMenuOpen(false);
			}}
			className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
				activeConfig === id
					? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-white/10 shadow-lg"
					: "text-gray-400 hover:text-white hover:bg-white/5"
			}`}
		>
			<Icon size={20} className={activeConfig === id ? "text-secondary" : ""} />
			<span className="font-medium">{label}</span>
			{activeConfig === id && (
				<div className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
			)}
		</button>
	);

	return (
		<div className="flex h-full overflow-hidden">
			{/* Mobile Menu Overlay */}
			{mobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black/80 z-20 md:hidden backdrop-blur-sm"
					onClick={() => setMobileMenuOpen(false)}
				></div>
			)}

			{/* Sidebar Navigation */}
			<aside
				className={`
            fixed md:relative top-16 md:top-0 left-0 bottom-0 z-30
            w-64 bg-dark/95 md:bg-transparent border-r border-white/10 md:border-none
            transform transition-transform duration-300 ease-in-out
            ${
							mobileMenuOpen
								? "translate-x-0"
								: "-translate-x-full md:translate-x-0"
						}
            p-4 flex flex-col gap-2
      `}
			>
				<div className="mb-4 md:hidden flex justify-between items-center">
					<span className="font-bold text-lg">Menu</span>
					<button onClick={() => setMobileMenuOpen(false)} className="p-2">
						<Menu />
					</button>
				</div>

				<div className="flex flex-col gap-2">
					<NavButton id="ingest" label="Ingest Video" icon={Youtube} />
					<NavButton id="chat" label="AI Chat" icon={MessageSquare} />
					<NavButton id="notes" label="Generate Notes" icon={FileText} />
				</div>

				<div className="mt-auto p-4 bg-dark-light/30 rounded-xl border border-white/5">
					<div className="text-xs text-gray-500 uppercase font-semibold mb-2">
						Active Model
					</div>
					<ModelSelector />
				</div>
			</aside>

			{/* Main Content Area */}
			<main className="flex-1 relative flex flex-col min-w-0 bg-dark/50">
				{/* Mobile Header */}
				<div className="md:hidden flex items-center justify-between p-4 border-b border-white/10">
					<button
						onClick={() => setMobileMenuOpen(true)}
						className="p-2 text-gray-400"
					>
						<Menu />
					</button>
					<span className="font-semibold text-white capitalize">
						{activeConfig}
					</span>
					<div className="w-8"></div> {/* Spacer */}
				</div>

				<div className="flex-1 p-4 md:p-8 overflow-hidden">
					{renderContent()}
				</div>
			</main>
		</div>
	);
};

export default AppPage;
