import React, { useState } from "react";
import { endpoints } from "../api/client";
import useStore from "../store/useStore";
import { toast } from "react-hot-toast";
import { Link2, Loader2, Play } from "lucide-react";

const VideoIngest = () => {
	const { currentVideoUrl, setCurrentVideoId, setCurrentVideoUrl, resetState } =
		useStore();
	const [url, setUrl] = useState(currentVideoUrl || "");
	const [loading, setLoading] = useState(false);

	const extractVideoId = (input) => {
		// Regex for youtube URL formats including short urls
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
			resetState(); // Clear previous chat/notes
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
		<div className="relative group w-full max-w-2xl mx-auto mb-10">
			<div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
			<form
				onSubmit={handleIngest}
				className="relative flex items-center gap-2 bg-dark p-2 rounded-xl border border-white/10 shadow-2xl"
			>
				<div className="pl-3 text-gray-400">
					<Link2 size={20} />
				</div>
				<input
					type="text"
					value={url}
					onChange={(e) => {
						setUrl(e.target.value);
					}}
					placeholder="Paste YouTube Link or Video ID"
					className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:outline-none focus:ring-0 py-3"
					disabled={loading}
				/>
				<button
					type="submit"
					disabled={loading || !url}
					className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300
            ${
							loading || !url
								? "bg-white/5 text-gray-500 cursor-not-allowed"
								: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transform hover:scale-[1.02]"
						}
          `}
				>
					{loading ? (
						<Loader2 className="animate-spin" size={18} />
					) : (
						<Play size={18} fill="currentColor" />
					)}
					<span>Process</span>
				</button>
			</form>
		</div>
	);
};

export default VideoIngest;
