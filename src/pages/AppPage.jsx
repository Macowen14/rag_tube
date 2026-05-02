import React, { useState } from "react";
import VideoIngest from "../components/VideoIngest";
import ChatInterface from "../components/ChatInterface";
import NotesDisplay from "../components/NotesDisplay";
import ModelSelector from "../components/ModelSelector";
import {
	FileText,
	Menu,
	MessageSquare,
	PanelLeftClose,
	Youtube,
} from "lucide-react";

const AppPage = () => {
	const [activeConfig, setActiveConfig] = useState("chat");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const renderContent = () => {
		switch (activeConfig) {
			case "ingest":
				return (
					<div className="mx-auto max-w-3xl space-y-6 pt-4 md:pt-8">
						<div>
							<p className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-tube">
								Add source
							</p>
							<h2 className="text-3xl font-black tracking-normal text-ink">
								Ingest a YouTube video
							</h2>
							<p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
								Paste a public YouTube link or video ID. RAG Tube will fetch the
								transcript, chunk it, and prepare it for grounded chat and notes.
							</p>
						</div>
						<VideoIngest />
						<div className="rounded-lg border border-line bg-panel p-5">
							<h3 className="mb-3 text-sm font-black uppercase tracking-[0.12em] text-muted">
								Workflow
							</h3>
							<div className="grid gap-3 md:grid-cols-3">
								{[
									"Paste URL",
									"Process transcript",
									"Ask or export",
								].map((step, index) => (
									<div
										key={step}
										className="rounded-md border border-line bg-paper-soft p-4"
									>
										<div className="mb-3 flex h-7 w-7 items-center justify-center rounded bg-ink text-xs font-black text-paper">
											{index + 1}
										</div>
										<p className="text-sm font-bold text-ink">{step}</p>
									</div>
								))}
							</div>
						</div>
					</div>
				);
			case "chat":
				return <ChatInterface />;
			case "notes":
				return <NotesDisplay />;
			default:
				return <ChatInterface />;
		}
	};

	const NavButton = ({ id, label, icon: Icon }) => (
		<button
			type="button"
			onClick={() => {
				setActiveConfig(id);
				setMobileMenuOpen(false);
			}}
			className={`w-full flex items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-bold transition-colors ${
				activeConfig === id
					? "bg-ink text-paper"
					: "text-muted hover:bg-panel hover:text-ink"
			}`}
		>
			<Icon
				size={18}
				className={activeConfig === id ? "text-circuit" : "text-muted"}
			/>
			<span>{label}</span>
			{activeConfig === id && (
				<span className="ml-auto h-2 w-2 rounded-full bg-circuit"></span>
			)}
		</button>
	);

	return (
		<div className="flex h-full overflow-hidden bg-paper">
			{mobileMenuOpen && (
				<button
					type="button"
					aria-label="Close menu overlay"
					className="fixed inset-0 z-20 bg-coal/60 md:hidden"
					onClick={() => setMobileMenuOpen(false)}
				/>
			)}

			<aside
				className={`
					fixed md:relative top-16 md:top-0 left-0 bottom-0 z-30
					w-72 border-r border-line bg-paper-soft
					transform transition-transform duration-300 ease-in-out
					${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
					flex flex-col p-4
				`}
			>
				<div className="mb-5 flex items-center justify-between md:hidden">
					<span className="text-sm font-black uppercase tracking-[0.12em] text-muted">
						Menu
					</span>
					<button
						type="button"
						onClick={() => setMobileMenuOpen(false)}
						className="rounded-md border border-line bg-panel p-2 text-muted"
						aria-label="Close menu"
					>
						<PanelLeftClose size={18} />
					</button>
				</div>

				<div className="mb-5 rounded-lg border border-line bg-panel p-4">
					<p className="text-xs font-black uppercase tracking-[0.12em] text-muted">
						Workspace
					</p>
					<p className="mt-2 text-2xl font-black text-ink">Video lab</p>
				</div>

				<div className="flex flex-col gap-2">
					<NavButton id="ingest" label="Ingest Video" icon={Youtube} />
					<NavButton id="chat" label="AI Chat" icon={MessageSquare} />
					<NavButton id="notes" label="Generate Notes" icon={FileText} />
				</div>

				<div className="mt-auto rounded-lg border border-line bg-panel p-4">
					<div className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-muted">
						Active model
					</div>
					<ModelSelector />
				</div>
			</aside>

			<main className="flex min-w-0 flex-1 flex-col bg-paper">
				<div className="flex items-center justify-between border-b border-line bg-paper-soft p-3 md:hidden">
					<button
						type="button"
						onClick={() => setMobileMenuOpen(true)}
						className="rounded-md border border-line bg-panel p-2 text-muted"
						aria-label="Open menu"
					>
						<Menu size={18} />
					</button>
					<span className="text-sm font-black capitalize text-ink">
						{activeConfig}
					</span>
					<div className="w-9" />
				</div>

				<div className="min-h-0 flex-1 overflow-hidden p-4 md:p-6">
					{renderContent()}
				</div>
			</main>
		</div>
	);
};

export default AppPage;
