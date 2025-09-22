
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [joke, setJoke] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchJoke = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode');
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      if (data.type === 'single') {
        setJoke(data.joke);
        setAuthor('');
      } else if (data.type === 'twopart') {
        setJoke(`${data.setup}\n${data.delivery}`);
        setAuthor('');
      } else {
        setJoke('No joke found.');
        setAuthor('');
      }
    } catch (err) {
      setError('Could not fetch joke. Please try again.');
      setJoke('');
      setAuthor('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div className="joke-app-container">
      <h1>Random Joke Generator</h1>
      <div className="joke-card">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <p className="joke-text">{joke}</p>
            <p className="joke-author">{author && `— ${author}`}</p>
          </>
        )}
        <button className="new-joke-btn" onClick={fetchJoke} disabled={loading}>
          New Joke
        </button>
      </div>
    </div>
  );
}

export default App;
