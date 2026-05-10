import { create } from "zustand";
import { persist } from "zustand/middleware";

const models = [
	{ model_name: "gpt-5.4-mini" },
	{ model_name: "gpt-5-mini" },
];

const useStore = create(
	persist(
		(set) => ({
			// State
			currentVideoId: null,
			currentVideoUrl: "",
			activeUserId: null,
			selectedModel: "gpt-5.4-mini",
			chatHistory: [], // Array of { role: 'user' | 'assistant', content: string, source: string }
			notes: null, // Markdown string
			savedNotesByUser: {},
			models,

			// Actions
			setCurrentVideoId: (id) => set({ currentVideoId: id }),
			setCurrentVideoUrl: (url) => set({ currentVideoUrl: url }),
			setSelectedModel: (model) => set({ selectedModel: model }),
			setActiveUser: (userId) =>
				set((state) => {
					if (state.activeUserId === userId) {
						return {};
					}

					return {
						activeUserId: userId,
						currentVideoId: null,
						currentVideoUrl: "",
						chatHistory: [],
						notes: null,
					};
				}),

			addChatMessage: (message) =>
				set((state) => ({
					chatHistory: [...state.chatHistory, message],
				})),

			clearChatHistory: () => set({ chatHistory: [] }),

			setNotes: (notes) => set({ notes }),
			setSavedNotesForUser: (userId, notes) =>
				set((state) => {
					if (!userId) {
						return {};
					}

					return {
						savedNotesByUser: {
							...state.savedNotesByUser,
							[userId]: notes,
						},
					};
				}),
			saveGeneratedNote: ({
				userId,
				videoId,
				topic,
				content,
				modelName,
				id,
				createdAt,
			}) =>
				set((state) => {
					if (!userId || !content) {
						return {};
					}

					const note = {
						id: id || `${videoId || "video"}-${Date.now()}`,
						videoId,
						topic,
						content,
						modelName,
						createdAt: createdAt || new Date().toISOString(),
					};

					return {
						savedNotesByUser: {
							...state.savedNotesByUser,
							[userId]: [note, ...(state.savedNotesByUser[userId] || [])],
						},
					};
				}),

			resetState: () =>
				set({
					currentVideoId: null,
					currentVideoUrl: "",
					chatHistory: [],
					notes: null,
				}),
		}),
		{
			name: "youtube-rag-storage",
			partialize: (state) => ({
				activeUserId: state.activeUserId,
				currentVideoId: state.currentVideoId,
				currentVideoUrl: state.currentVideoUrl,
				selectedModel: state.selectedModel,
				chatHistory: state.chatHistory,
				notes: state.notes,
				savedNotesByUser: state.savedNotesByUser,
			}),
		}
	)
);

export default useStore;
