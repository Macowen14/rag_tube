import React from "react";
import useStore from "../store/useStore";
import { ChevronDown, Box } from "lucide-react";

const ModelSelector = () => {
	const { models, selectedModel, setSelectedModel } = useStore();
	const currentModel = models.find((m) => m.model_name === selectedModel) || models[0];

	return (
		<div className="relative group min-w-[200px]">
			<div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
			<div className="relative flex items-center bg-dark-light border border-white/10 rounded-lg p-1">
				<div className="p-2 bg-dark rounded-md mr-2">
					<Box size={18} className="text-secondary" />
				</div>
				<select
					value={selectedModel}
					onChange={(e) => setSelectedModel(e.target.value)}
					className="w-full bg-transparent text-sm text-white focus:outline-none cursor-pointer appearance-none pr-8 py-1"
				>
					{models.map((model) => (
						<option
							key={model.model_name}
							value={model.model_name}
							className="bg-dark text-white"
						>
							{model.model_name}
						</option>
					))}
				</select>
				<div className="absolute right-3 pointer-events-none text-gray-400">
					<ChevronDown size={14} />
				</div>
			</div>
		</div>
	);
};

export default ModelSelector;
