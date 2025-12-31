import React from "react";
import { Link } from "react-router-dom";
import { Youtube, Brain, Zap, ArrowRight, ShieldCheck } from "lucide-react";

const HomePage = () => {
	return (
		<div className="h-full overflow-y-auto px-4 py-8 md:py-12">
			<div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 pb-12">
				<div className="space-y-6 max-w-4xl mx-auto">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm mb-4">
						<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
						Powered by Advanced LLMs
					</div>

					<h1 className="text-5xl md:text-7xl font-bold tracking-tight">
						<span className="block mb-2">Chat with your</span>
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-purple-500 animate-gradient-x">
							YouTube Videos
						</span>
					</h1>

					<p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
						Transform any YouTube video into an interactive knowledge base. Get
						instant answers, generating comprehensive notes, and unlock insights
						using state-of-the-art AI models.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
						<Link
							to="/app"
							className="group relative px-8 py-4 bg-white text-dark font-bold rounded-xl text-lg overflow-hidden transition-transform hover:scale-105"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-10 transition-opacity"></div>
							<span className="flex items-center gap-2">
								Get Started Now <ArrowRight size={20} />
							</span>
						</Link>
						<a
							href="https://github.com/Macowen14/youtube_RAG"
							target="_blank"
							rel="noopener noreferrer"
							className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-lg font-medium hover:bg-white/10 transition-colors"
						>
							View on GitHub
						</a>
					</div>
				</div>

				<div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl pt-16 px-4">
					{[
						{
							icon: <Youtube size={32} className="text-red-500" />,
							title: "Instant Ingestion",
							desc: "Paste any YouTube URL and get started in seconds. We handle the transcripts automatically.",
						},
						{
							icon: <Brain size={32} className="text-secondary" />,
							title: "Smart Context",
							desc: "RAG technology ensures answers are grounded in the video's actual content.",
						},
						{
							icon: <Zap size={32} className="text-yellow-400" />,
							title: "Model Flexibility",
							desc: "Choose from various LLMs including Mistral, Gemma, and Gemini to suit your needs.",
						},
					].map((feature, idx) => (
						<div
							key={idx}
							className="p-8 rounded-3xl bg-dark-light/30 border border-white/5 hover:border-white/10 transition-colors hover:bg-dark-light/50 text-left"
						>
							<div className="mb-6 p-4 bg-dark rounded-2xl w-fit border border-white/5">
								{feature.icon}
							</div>
							<h3 className="text-xl font-bold mb-3">{feature.title}</h3>
							<p className="text-gray-400 leading-relaxed">{feature.desc}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
