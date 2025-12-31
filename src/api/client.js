import axios from "axios";

// Create axios instance
const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000", 
	headers: {
		"Content-Type": "application/json",
	},
});

export const endpoints = {
	ingestVideo: async (videoId) => {
		try {
			const response = await api.post("/ingest", { video_id: videoId });
			return response.data;
		} catch (error) {
			throw error.response?.data?.detail || error.message;
		}
	},

	queryVideo: async (videoId, question, modelName) => {
		try {
			const response = await api.post("/query", {
				video_id: videoId,
				question,
				model_name: modelName,
			});
			return response.data;
		} catch (error) {
			throw error.response?.data?.detail || error.message;
		}
	},

	generateNotes: async (videoId, topic, modelName) => {
		try {
			const response = await api.post("/notes", {
				video_id: videoId,
				topic,
				model_name: modelName,
			});
			return response.data;
		} catch (error) {
			throw error.response?.data?.detail || error.message;
		}
	},
};

export default api;
