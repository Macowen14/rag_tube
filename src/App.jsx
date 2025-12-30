import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AppPage from "./pages/AppPage";

function App() {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/app" element={<AppPage />} />
				</Routes>
			</Layout>
		</Router>
	);
}

export default App;
