import React, { useEffect, useRef, useState } from "react";
import useStore from "../store/useStore";
import { endpoints } from "../api/client";
import ReactMarkdown from "react-markdown";
import { Bot, Info, Loader2, Send, User } from "lucide-react";
import toast from "react-hot-toast";

const ChatInterface = () => {
	const {
		currentVideoId,
		selectedModel: model_name,
		chatHistory,
		addChatMessage,
	} = useStore();
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [chatHistory]);

	const handleSend = async (e) => {
		e.preventDefault();
		if (!input.trim() || !currentVideoId) return;

		const userMessage = { role: "user", content: input, source: null };
		addChatMessage(userMessage);
		setInput("");
		setLoading(true);

		try {
			const response = await endpoints.queryVideo(
				currentVideoId,
				userMessage.content,
				model_name
			);

			const botMessage = {
				role: "assistant",
				content: response.answer,
				source: response.source,
			};

			addChatMessage(botMessage);
		} catch (error) {
			toast.error(`Failed to get answer: ${error}`);
			addChatMessage({
				role: "assistant",
				content: "Sorry, I encountered an error answering your question.",
				source: "Error",
			});
		} finally {
			setLoading(false);
		}
	};

	if (!currentVideoId) {
		return (
			<div className="flex h-full flex-col items-center justify-center rounded-lg border border-line bg-panel p-8 text-center">
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-paper text-circuit">
					<Info size={24} />
				</div>
				<p className="text-lg font-black text-ink">No video selected</p>
				<p className="mt-2 max-w-sm text-sm leading-6 text-muted">
					Ingest a video first, then this chat will answer using transcript
					context and citations.
				</p>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-panel shadow-[0_16px_45px_rgba(24,21,18,0.08)]">
			<div className="flex items-center justify-between border-b border-line bg-paper-soft px-4 py-3">
				<div>
					<p className="text-sm font-black text-ink">Grounded chat</p>
					<p className="text-xs font-medium text-muted">
						Video ID: {currentVideoId}
					</p>
				</div>
				<div className="rounded bg-panel px-2 py-1 text-xs font-bold text-circuit">
					{chatHistory.length} messages
				</div>
			</div>

			<div className="custom-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto p-4">
				{chatHistory.length === 0 && (
					<div className="flex flex-1 flex-col items-center justify-center text-center">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-ink text-circuit">
							<Bot size={24} />
						</div>
						<p className="text-base font-black text-ink">
							Ask a question about the video
						</p>
						<p className="mt-2 max-w-md text-sm leading-6 text-muted">
							Try asking for the main argument, important timestamps, or a
							comparison between two ideas in the transcript.
						</p>
					</div>
				)}

				{chatHistory.map((msg, idx) => (
					<div
						key={idx}
						className={`flex gap-3 ${
							msg.role === "user" ? "justify-end" : "justify-start"
						} shrink-0`}
					>
						{msg.role === "assistant" && (
							<div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-paper text-circuit">
								<Bot size={16} />
							</div>
						)}

						<div
							className={`max-w-[82%] rounded-lg p-4 text-sm leading-6 ${
								msg.role === "user"
									? "bg-ink text-paper"
									: "border border-line bg-paper-soft text-ink"
							}`}
						>
							<div
								className={`prose prose-sm max-w-none ${
									msg.role === "user" ? "prose-invert" : ""
								}`}
							>
								<ReactMarkdown>{msg.content}</ReactMarkdown>
							</div>

							{msg.source && (
								<div
									className={`mt-3 flex items-center gap-1 border-t pt-3 text-xs font-semibold ${
										msg.role === "user"
											? "border-paper/20 text-paper/70"
											: "border-line text-muted"
									}`}
								>
									<Info size={12} />
									<span>Source: {msg.source}</span>
								</div>
							)}
						</div>

						{msg.role === "user" && (
							<div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-tube text-white">
								<User size={16} />
							</div>
						)}
					</div>
				))}

				{loading && (
					<div className="flex gap-3 justify-start">
						<div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-paper text-circuit">
							<Bot size={16} />
						</div>
						<div className="flex items-center rounded-lg border border-line bg-paper-soft p-4 text-sm font-semibold text-muted">
							<Loader2 className="mr-2 animate-spin text-circuit" size={16} />
							Thinking...
						</div>
					</div>
				)}
				<div ref={messagesEndRef} className="shrink-0" />
			</div>

			<form onSubmit={handleSend} className="border-t border-line bg-paper-soft p-3">
				<div className="flex items-center gap-2 rounded-md border border-line bg-panel p-2 focus-within:border-circuit">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						disabled={loading}
						placeholder="Type your question..."
						className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm font-medium text-ink placeholder:text-muted/70 focus:outline-none"
					/>
					<button
						type="submit"
						disabled={loading || !input.trim()}
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-circuit text-white transition-colors hover:bg-circuit-dark disabled:bg-line disabled:text-muted"
						aria-label="Send question"
					>
						<Send size={16} />
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatInterface;
