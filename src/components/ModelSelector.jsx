import React, { useEffect } from "react";
import useStore from "../store/useStore";
import { Box, ChevronDown } from "lucide-react";

const ModelSelector = () => {
	const {
		models,
		selectedModel,
		setSelectedModel,
	} = useStore();

	const activeModel = models.some(
		(model) => model.model_name === selectedModel
	)
		? selectedModel
		: models[0]?.model_name || "";

	useEffect(() => {
		if (activeModel && activeModel !== selectedModel) {
			setSelectedModel(activeModel);
		}
	}, [activeModel, selectedModel, setSelectedModel]);

	return (
		<div className="flex flex-col gap-2">
			<div className="relative flex items-center rounded-md border border-line bg-paper-soft">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center border-r border-line text-circuit">
					<Box size={17} />
				</div>
				<select
					value={activeModel}
					onChange={(e) => setSelectedModel(e.target.value)}
					className="min-w-0 flex-1 appearance-none bg-transparent py-2 pl-3 pr-8 text-sm font-bold text-ink focus:outline-none"
				>
					{models.map((model) => (
						<option
							key={model.model_name}
							value={model.model_name}
							className="bg-panel text-ink"
						>
							{model.model_name}
						</option>
					))}
				</select>
				<div className="pointer-events-none absolute right-3 text-muted">
					<ChevronDown size={14} />
				</div>
			</div>
		</div>
	);
};

export default ModelSelector;
