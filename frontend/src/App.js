import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import MatcherForm from './components/MatcherForm';
import ResultsDisplay from './components/ResultsDisplay';
import History from './components/History';

function App() {
  const [matchResult, setMatchResult] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        {!showHistory ? (
          <>
            <MatcherForm 
              onResult={setMatchResult} 
              loading={loading}
              setLoading={setLoading}
              onHistoryClick={() => setShowHistory(true)}
            />
            {matchResult && <ResultsDisplay result={matchResult} />}
          </>
        ) : (
          <History onBack={() => setShowHistory(false)} />
        )}
      </main>
    </div>
  );
}

export default App;
