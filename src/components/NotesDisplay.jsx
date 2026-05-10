import React, { useEffect, useState } from "react";
import useStore from "../store/useStore";
import { endpoints } from "../api/client";
import ReactMarkdown from "react-markdown";
import { Copy, Download, FileText, Loader2, Sparkles } from "lucide-react";
import html2pdf from "html2pdf.js";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";

const NotesDisplay = () => {
	const {
		currentVideoId,
		selectedModel,
		notes,
		savedNotesByUser,
		setNotes,
		saveGeneratedNote,
		setSavedNotesForUser,
	} = useStore();
	const user = useAuthStore((state) => state.user);
	const [topic, setTopic] = useState("Key Takeaways and Summary");
	const [loading, setLoading] = useState(false);
	const contentRef = React.useRef(null);
	const savedNotes = savedNotesByUser[user?.id] || [];

	useEffect(() => {
		if (!user?.id || !currentVideoId) return;

		let cancelled = false;

		endpoints
			.getNotes(currentVideoId)
			.then((backendNotes) => {
				if (cancelled) return;

				setSavedNotesForUser(
					user.id,
					backendNotes.map((note) => ({
						id: note.id,
						videoId: note.video_id,
						topic: "Saved note",
						content: note.content,
						modelName: null,
						provider: null,
						createdAt: note.created_at,
					}))
				);
			})
			.catch((error) => {
				console.error("Failed to load saved notes", error);
			});

		return () => {
			cancelled = true;
		};
	}, [currentVideoId, setSavedNotesForUser, user?.id]);

	const handleGenerate = async () => {
		if (!currentVideoId) {
			toast.error("Please ingest a video first");
			return;
		}

		setLoading(true);
		try {
			const response = await endpoints.generateNotes(
				currentVideoId,
				topic,
				{ modelName: selectedModel }
			);
			setNotes(response.answer);
			try {
				const savedNote = await endpoints.createNote({
					videoId: currentVideoId,
					content: response.answer,
				});

				saveGeneratedNote({
					userId: user?.id,
					videoId: savedNote.video_id,
					topic,
					content: savedNote.content,
					modelName: selectedModel,
					id: savedNote.id,
					createdAt: savedNote.created_at,
				});
			} catch (saveError) {
				console.error("Failed to save generated note", saveError);
				saveGeneratedNote({
					userId: user?.id,
					videoId: currentVideoId,
					topic,
					content: response.answer,
					modelName: selectedModel,
				});
				toast.error("Notes generated, but backend save failed.");
			}
			toast.success("Notes generated successfully!");
		} catch (error) {
			toast.error(`Failed to generate notes: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	const handleDownload = () => {
		if (!notes) return;
		const blob = new Blob([notes], { type: "text/markdown" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `notes-${currentVideoId}.md`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		toast.success("Notes downloaded!");
	};

	const handleCopy = () => {
		if (!notes) return;
		navigator.clipboard.writeText(notes);
		toast.success("Copied to clipboard!");
	};

	const handleDownloadPDF = () => {
		if (!contentRef.current) return;

		const opt = {
			margin: [10, 10],
			filename: `notes-${currentVideoId}.pdf`,
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
			jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
		};

		html2pdf()
			.set(opt)
			.from(contentRef.current)
			.save()
			.then(() => {
				toast.success("PDF Downloaded!");
			})
			.catch((err) => {
				console.error(err);
				toast.error("Failed to generate PDF");
			});
	};

	if (!currentVideoId) {
		return (
			<div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-line bg-panel p-8 text-center">
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-paper text-amber-note">
					<FileText size={24} />
				</div>
				<p className="text-lg font-black text-ink">No video selected</p>
				<p className="mt-2 max-w-sm text-sm leading-6 text-muted">
					Ingest a video first to generate summaries, study notes, and exports.
				</p>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col gap-4">
			<div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
				<div className="rounded-lg border border-line bg-panel p-4">
					<div className="mb-4 flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-note text-white">
							<Sparkles size={20} />
						</div>
						<div>
							<h3 className="text-sm font-black text-ink">Generate AI notes</h3>
							<p className="text-xs font-medium text-muted">
								Tune the topic before exporting.
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row">
						<input
							type="text"
							value={topic}
							onChange={(e) => setTopic(e.target.value)}
							className="min-w-0 flex-1 rounded-md border border-line bg-paper-soft px-3 py-3 text-sm font-medium text-ink placeholder:text-muted/70 focus:border-circuit focus:outline-none"
							placeholder="Topic, e.g. specific concept"
						/>
						<button
							type="button"
							onClick={handleGenerate}
							disabled={loading}
							className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-note px-5 py-3 text-sm font-black text-white transition-colors hover:bg-[#b97816] disabled:bg-line disabled:text-muted"
						>
							{loading ? (
								<Loader2 className="animate-spin" size={16} />
							) : (
								<Sparkles size={16} />
							)}
							Generate
						</button>
					</div>
				</div>

				<div className="rounded-lg border border-line bg-panel p-4">
					<div className="mb-3 flex items-center justify-between">
						<div>
							<p className="text-sm font-black text-ink">Saved notes</p>
							<p className="text-xs font-medium text-muted">
								Scoped to {user?.email || "this account"}
							</p>
						</div>
						<span className="rounded bg-paper-soft px-2 py-1 text-xs font-black text-muted">
							{savedNotes.length}
						</span>
					</div>

					{savedNotes.length > 0 ? (
						<div className="custom-scrollbar max-h-36 space-y-2 overflow-y-auto pr-1">
							{savedNotes.slice(0, 5).map((savedNote) => (
								<button
									key={savedNote.id}
									type="button"
									onClick={() => setNotes(savedNote.content)}
									className="w-full rounded-md border border-line bg-paper-soft p-3 text-left transition-colors hover:bg-panel"
								>
									<p className="truncate text-xs font-black text-ink">
										{savedNote.topic}
									</p>
									<p className="mt-1 text-xs font-medium text-muted">
										{savedNote.videoId} -{" "}
										{new Date(savedNote.createdAt).toLocaleDateString()}
									</p>
								</button>
							))}
						</div>
					) : (
						<p className="rounded-md border border-dashed border-line bg-paper-soft p-3 text-xs font-medium leading-5 text-muted">
							Generated notes will be saved here for the signed-in user.
						</p>
					)}
				</div>
			</div>

			{notes ? (
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-line bg-panel">
					<div className="flex items-center justify-between border-b border-line bg-paper-soft px-4 py-3">
						<div>
							<p className="text-sm font-black text-ink">Notes document</p>
							<p className="text-xs font-medium text-muted">
								Export as Markdown or PDF
							</p>
						</div>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={handleCopy}
								className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-panel text-muted transition-colors hover:text-ink"
								title="Copy to clipboard"
								aria-label="Copy notes"
							>
								<Copy size={17} />
							</button>
							<button
								type="button"
								onClick={handleDownloadPDF}
								className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-panel text-muted transition-colors hover:text-ink"
								title="Download PDF"
								aria-label="Download PDF"
							>
								<FileText size={17} />
							</button>
							<button
								type="button"
								onClick={handleDownload}
								className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-panel text-muted transition-colors hover:text-ink"
								title="Download Markdown"
								aria-label="Download Markdown"
							>
								<Download size={17} />
							</button>
						</div>
					</div>

					<div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
						<div
							ref={contentRef}
							className="prose prose-sm max-w-3xl rounded-md bg-panel p-5 prose-headings:text-ink prose-p:text-muted prose-a:text-circuit prose-strong:text-ink prose-li:text-muted"
						>
							<ReactMarkdown>{notes}</ReactMarkdown>
						</div>
					</div>
				</div>
			) : (
				<div className="flex min-h-0 flex-1 items-center justify-center rounded-lg border border-dashed border-line bg-paper-soft p-8 text-center">
					<div>
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-panel text-amber-note">
							<FileText size={24} />
						</div>
						<p className="text-base font-black text-ink">No notes yet</p>
						<p className="mt-2 max-w-sm text-sm leading-6 text-muted">
							Generate notes for the current video and they will appear here.
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default NotesDisplay;
