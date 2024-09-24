import React, { useState } from 'react';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';

function App() {
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleAnalysis = (result) => {
        setAnalysisResult(result);
    };

    return (
        <div className="App">
            <h1>Social Media Monitoring Tool</h1>
            <InputForm onAnalysis={handleAnalysis} />
            {analysisResult && <Dashboard result={analysisResult} />}
        </div>
    );
}

export default App;