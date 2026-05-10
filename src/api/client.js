import axios from "axios";
import useAuthStore from "../store/useAuthStore";

// Create axios instance
const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().accessToken;

	if (token) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export const endpoints = {
	ingestVideo: async (videoId) => {
		try {
			const response = await api.post("/rag/ingest", { video_id: videoId });
			return response.data;
		} catch (error) {
			throw error.response?.data?.detail || error.message;
		}
	},

	queryVideo: async (videoId, question, { modelName } = {}) => {
		try {
			const response = await api.post("/rag/query", {
				video_id: videoId,
				question,
				model_name: modelName,
			});
			return response.data;
		} catch (error) {
			throw error.response?.data?.detail || error.message;
		}
	},

	generateNotes: async (videoId, topic, { modelName } = {}) => {
		try {
			const response = await api.post("/rag/generate-notes", {
				video_id: videoId,
				topic,
				model_name: modelName,
			});
			return response.data;
		} catch (error) {
			throw error.response?.data?.detail || error.message;
		}
	},

	generateSummary: async (videoId, topic, { modelName } = {}) => {
		try {
			const response = await api.post("/rag/generate-summary", {
				video_id: videoId,
				topic,
				model_name: modelName,
			});
			return response.data;
		} catch (error) {
			throw error.response?.data?.detail || error.message;
		}
	},

	createNote: async ({ videoId, content }) => {
		try {
			const response = await api.post("/notes/", {
				video_id: videoId,
				content,
			});
			return response.data;
		} catch (error) {
			throw error.response?.data?.detail || error.message;
		}
	},

	getNotes: async (videoId) => {
		try {
			const response = await api.get("/notes/", {
				params: videoId ? { video_id: videoId } : undefined,
			});
			return response.data;
		} catch (error) {
			throw error.response?.data?.detail || error.message;
		}
	},

	createSummary: async ({ videoId, content }) => {
		try {
			const response = await api.post("/summaries/", {
				video_id: videoId,
				content,
			});
			return response.data;
		} catch (error) {
			throw error.response?.data?.detail || error.message;
		}
	},

	getSummaries: async (videoId) => {
		try {
			const response = await api.get("/summaries/", {
				params: videoId ? { video_id: videoId } : undefined,
			});
			return response.data;
		} catch (error) {
			throw error.response?.data?.detail || error.message;
		}
	},
};

export default api;
