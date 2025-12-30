import React, { useState, useRef, useEffect } from "react";
import useStore from "../store/useStore";
import { endpoints } from "../api/client";
import ReactMarkdown from "react-markdown";
import { Send, User, Bot, Loader2, Info } from "lucide-react";
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
			<div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 border border-white/5 rounded-2xl bg-dark-light/50 backdrop-blur-sm">
				<Info size={48} className="mb-4 opacity-50" />
				<p className="text-lg font-medium">No video selected</p>
				<p className="text-sm">Ingest a video to start chatting</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full border border-white/10 rounded-2xl bg-dark-light/30 backdrop-blur-md overflow-hidden relative">
			{/* Ambient glow */}
			<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

			<div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
				{chatHistory.length === 0 && (
					<div className="flex-1 flex flex-col items-center justify-center text-gray-500 min-h-[200px]">
						<Bot size={32} className="mb-3 text-secondary opacity-80" />
						<p className="text-center">Ask me anything about the video!</p>
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
							<div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
								<Bot size={16} className="text-secondary" />
							</div>
						)}

						<div
							className={`
              max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed
              ${
								msg.role === "user"
									? "bg-gradient-to-br from-primary to-blue-600 text-white rounded-tr-sm"
									: "bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm"
							}
            `}
						>
							<div className="prose prose-invert prose-sm max-w-none">
								<ReactMarkdown>{msg.content}</ReactMarkdown>
							</div>

							{msg.source && (
								<div className="mt-2 text-xs opacity-60 flex items-center gap-1 border-t border-white/10 pt-2">
									<Info size={10} />
									<span>Source: {msg.source}</span>
								</div>
							)}
						</div>

						{msg.role === "user" && (
							<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
								<User size={16} className="text-primary" />
							</div>
						)}
					</div>
				))}
				{loading && (
					<div className="flex gap-3 justify-start">
						<div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mt-1">
							<Bot size={16} className="text-secondary" />
						</div>
						<div className="bg-white/5 border border-white/10 text-gray-200 rounded-2xl rounded-tl-sm p-4 flex items-center">
							<Loader2 className="animate-spin mr-2" size={16} />
							<span className="text-sm">Thinking...</span>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} className="shrink-0" />
			</div>

			<form
				onSubmit={handleSend}
				className="p-4 bg-dark-light/80 border-t border-white/10"
			>
				<div className="relative flex items-center">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						disabled={loading}
						placeholder="Type your question..."
						className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
					/>
					<button
						type="submit"
						disabled={loading || !input.trim()}
						className="absolute right-2 p-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<Send size={16} />
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatInterface;
