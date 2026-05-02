import React from "react";
import { Link } from "react-router-dom";
import {
	ArrowRight,
	Brain,
	FileText,
	MessageSquare,
	Play,
	Search,
	Sparkles,
	Youtube,
} from "lucide-react";

const HomePage = () => {
	const features = [
		{
			icon: Youtube,
			title: "Transcript ingestion",
			desc: "Paste a YouTube URL and turn the transcript into searchable context.",
		},
		{
			icon: MessageSquare,
			title: "Grounded chat",
			desc: "Ask questions with answers tied back to the video source.",
		},
		{
			icon: FileText,
			title: "Study-ready notes",
			desc: "Generate structured summaries, takeaways, and topic notes.",
		},
	];

	return (
		<div className="h-full overflow-y-auto">
			<section className="min-h-[calc(100vh-4rem)] px-4 py-8 md:px-6 md:py-10">
				<div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
					<div className="space-y-8">
						<div className="inline-flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2 text-sm font-semibold text-muted">
							<span className="h-2 w-2 rounded-full bg-circuit"></span>
							Video knowledge workspace
						</div>

						<div className="space-y-5">
							<h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-normal text-ink md:text-7xl">
								RAG Tube turns videos into answers.
							</h1>
							<p className="max-w-2xl text-lg leading-8 text-muted md:text-xl">
								Drop in a lecture, tutorial, interview, or walkthrough. RAG Tube
								builds context from the transcript so you can ask, compare, and
								summarize without scrubbing the timeline.
							</p>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row">
							<Link
								to="/app"
								className="inline-flex items-center justify-center gap-2 rounded-md bg-tube px-5 py-3 text-sm font-bold text-white shadow-[0_10px_25px_rgba(225,29,46,0.22)] transition-colors hover:bg-tube-dark"
							>
								Open workspace <ArrowRight size={18} />
							</Link>
							<a
								href="https://github.com/Macowen14/youtube_RAG"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-panel px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-paper-soft"
							>
								View repository
							</a>
						</div>
					</div>

					<div className="rounded-lg border border-line bg-panel shadow-[0_24px_70px_rgba(24,21,18,0.12)]">
						<div className="flex items-center justify-between border-b border-line px-4 py-3">
							<div className="flex items-center gap-2">
								<div className="flex h-9 w-9 items-center justify-center rounded-md bg-tube text-white">
									<Play size={18} fill="currentColor" />
								</div>
								<div>
									<p className="text-sm font-black text-ink">Workspace preview</p>
									<p className="text-xs font-medium text-muted">
										Ingest, ask, cite, and export
									</p>
								</div>
							</div>
							<div className="rounded bg-paper px-2 py-1 text-xs font-bold text-muted">
								LIVE RAG
							</div>
						</div>

						<div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
							<div className="border-b border-line p-4 md:border-b-0 md:border-r">
								<div className="aspect-video rounded-md bg-coal p-3 text-paper">
									<div className="mb-3 flex items-center justify-between">
										<div className="flex items-center gap-2 text-xs font-bold">
											<Youtube size={16} className="text-tube" />
											youtube.com/watch
										</div>
										<span className="text-xs text-paper/60">12:48</span>
									</div>
									<div className="flex h-[calc(100%-1.75rem)] items-center justify-center rounded bg-graphite">
										<div className="flex h-14 w-14 items-center justify-center rounded-md bg-tube text-white">
											<Play size={24} fill="currentColor" />
										</div>
									</div>
								</div>

								<div className="mt-4 space-y-2">
									{[
										"Transcript indexed",
										"33 chunks embedded",
										"Citations ready",
									].map((item) => (
										<div
											key={item}
											className="flex items-center justify-between rounded border border-line bg-paper-soft px-3 py-2 text-sm"
										>
											<span className="font-semibold text-ink">{item}</span>
											<span className="h-2 w-2 rounded-full bg-circuit"></span>
										</div>
									))}
								</div>
							</div>

							<div className="p-4">
								<div className="mb-4 flex items-center gap-2 rounded-md border border-line bg-paper-soft px-3 py-2">
									<Search size={16} className="text-circuit" />
									<span className="text-sm font-semibold text-muted">
										What were the core steps in the workflow?
									</span>
								</div>
								<div className="space-y-3">
									<div className="rounded-md bg-ink p-4 text-paper">
										<div className="mb-2 flex items-center gap-2 text-sm font-bold text-circuit">
											<Brain size={16} />
											Answer
										</div>
										<p className="text-sm leading-6 text-paper/85">
											The video moves from capture to transcript cleanup, then
											retrieval, prompting, and final notes. The key idea is to
											keep answers grounded in source passages.
										</p>
									</div>
									<div className="rounded-md border border-line bg-paper-soft p-4">
										<div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-note">
											<Sparkles size={16} />
											Notes generated
										</div>
										<ul className="space-y-2 text-sm text-muted">
											<li>1. Build transcript context before asking.</li>
											<li>2. Use citations to inspect the answer.</li>
											<li>3. Export notes when the topic is stable.</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mx-auto mt-8 grid max-w-7xl gap-3 md:grid-cols-3">
					{features.map((feature) => {
						const Icon = feature.icon;

						return (
							<div
								key={feature.title}
								className="rounded-lg border border-line bg-panel p-5"
							>
								<div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-paper text-tube">
									<Icon size={20} />
								</div>
								<h3 className="mb-2 text-base font-black text-ink">
									{feature.title}
								</h3>
								<p className="text-sm leading-6 text-muted">{feature.desc}</p>
							</div>
						);
					})}
				</div>
			</section>
		</div>
	);
};

export default HomePage;
