'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './style.css';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setError('Failed to get response from Gemini');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Gemini AI Assistant
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Enter your prompt
            </label>
            <textarea
              id="prompt"
              rows={6}
              className="w-full rounded-lg border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-black text-white p-4"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${
                loading || !input.trim()
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-900 rounded-md">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-medium text-white mb-2">Response:</h2>
            <ReactMarkdown className="text-gray-300 whitespace-pre-wrap markdown">
              {result}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </main>
  );
}
