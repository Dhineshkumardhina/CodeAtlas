import React, { useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';

function RepoInput({ onAnalyze, isLoading }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (inputUrl) => {
    if (!inputUrl) return 'Please enter a GitHub repository URL';
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/i;
    if (!regex.test(inputUrl)) {
      return 'Invalid URL. Please use: https://github.com/owner/repo';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateUrl(url);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    onAnalyze(url);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm text-white placeholder-gray-400 backdrop-blur-md outline-none focus:border-violet-500/50 focus:bg-white/10 focus:ring-1 focus:ring-violet-500/30 transition-all duration-300"
            placeholder="Paste GitHub Repository URL (e.g., https://github.com/facebook/react)"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/30 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Repo'
          )}
        </button>
      </form>
      {error && (
        <div className="mt-3 flex items-center gap-1.5 text-sm text-rose-400 animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default RepoInput;
