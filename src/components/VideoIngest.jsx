import React, { useState } from "react";
import { endpoints } from "../api/client";
import useStore from "../store/useStore";
import { toast } from "react-hot-toast";
import { Link2, Loader2, Play, Youtube } from "lucide-react";

const VideoIngest = () => {
	const { currentVideoUrl, setCurrentVideoId, setCurrentVideoUrl, resetState } =
		useStore();
	const [url, setUrl] = useState(currentVideoUrl || "");
	const [loading, setLoading] = useState(false);

	const extractVideoId = (input) => {
		const regExp =
			/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
		const match = input.match(regExp);
		return match && match[2].length === 11 ? match[2] : input;
	};

	const handleIngest = async (e) => {
		e.preventDefault();
		if (!url.trim()) return;

		const videoId = extractVideoId(url);
		if (!videoId) {
			toast.error("Invalid YouTube URL");
			return;
		}

		setLoading(true);
		try {
			resetState();
			setCurrentVideoId(videoId);
			setCurrentVideoUrl(url);

			const promise = endpoints.ingestVideo(videoId);

			await toast.promise(promise, {
				loading: "Ingesting video transcript...",
				success: "Video ingested successfully!",
				error: (err) => `Ingestion failed: ${err}`,
			});

			setUrl("");
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="rounded-lg border border-line bg-panel p-4 shadow-[0_16px_45px_rgba(24,21,18,0.08)]">
			<div className="mb-4 flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-md bg-tube text-white">
					<Youtube size={20} />
				</div>
				<div>
					<p className="text-sm font-black text-ink">Video source</p>
					<p className="text-xs font-medium text-muted">
						YouTube URLs and raw video IDs are supported.
					</p>
				</div>
			</div>

			<form onSubmit={handleIngest} className="flex flex-col gap-3 sm:flex-row">
				<label className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-line bg-paper-soft px-3 py-3 focus-within:border-circuit">
					<Link2 size={18} className="shrink-0 text-muted" />
					<input
						type="text"
						value={url}
						onChange={(e) => {
							setUrl(e.target.value);
						}}
						placeholder="Paste YouTube link or video ID"
						className="min-w-0 flex-1 bg-transparent text-sm font-medium text-ink placeholder:text-muted/70 focus:outline-none"
						disabled={loading}
					/>
				</label>
				<button
					type="submit"
					disabled={loading || !url}
					className="inline-flex items-center justify-center gap-2 rounded-md bg-tube px-5 py-3 text-sm font-black text-white transition-colors hover:bg-tube-dark disabled:bg-line disabled:text-muted"
				>
					{loading ? (
						<Loader2 className="animate-spin" size={18} />
					) : (
						<Play size={18} fill="currentColor" />
					)}
					Process
				</button>
			</form>
		</div>
	);
};

export default VideoIngest;
