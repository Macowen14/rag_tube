import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
	persist(
		(set) => ({
			// State
			currentVideoId: null,
			currentVideoUrl: "",
			selectedModel: "mistral-large-3:675b-cloud", // Default model
			chatHistory: [], // Array of { role: 'user' | 'assistant', content: string, source: string }
			notes: null, // Markdown string
			models: [
				{ model_name: "gemma3:27b-cloud" },
				{ model_name: "mistral-large-3:675b-cloud" },
				{ model_name: "gemini-3-pro-preview:latest" },
				{ model_name: "qwen3-coder:480b-cloud" },
				{ model_name: "ministral-3:3b-cloud" },
				{ model_name: "gemma3:4b" },
				{ model_name: "mistral:latest" },
			],

			// Actions
			setCurrentVideoId: (id) => set({ currentVideoId: id }),
			setCurrentVideoUrl: (url) => set({ currentVideoUrl: url }),
			setSelectedModel: (model) => set({ selectedModel: model }),

			addChatMessage: (message) =>
				set((state) => ({
					chatHistory: [...state.chatHistory, message],
				})),

			clearChatHistory: () => set({ chatHistory: [] }),

			setNotes: (notes) => set({ notes }),

			resetState: () =>
				set({
					currentVideoId: null,
					currentVideoUrl: "",
					chatHistory: [],
					notes: null,
				}),
		}),
		{
			model_name: "youtube-rag-storage", // unique model_name
			partialize: (state) => ({
				currentVideoId: state.currentVideoId,
				currentVideoUrl: state.currentVideoUrl,
				selectedModel: state.selectedModel,
				chatHistory: state.chatHistory,
				notes: state.notes,
			}),
		}
	)
);

export default useStore;
