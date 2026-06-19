import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { getAnalysisHistory, deleteAnalysisFromHistory, analyzeRepository } from '../services/api';
import RepositoryCard from '../components/RepositoryCard';
import ArchitectureMap from '../components/ArchitectureMap';
import AIResponseCard from '../components/AIResponseCard';
import { LayoutDashboard, Compass, Trash2, Calendar, Code, ChevronRight, Landmark, ExternalLink, Loader2, Sparkles, MessageCircleCode } from 'lucide-react';
import RepoInput from '../components/RepoInput';

function Dashboard() {
  const { user, currentAnalysis, setCurrentAnalysis } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Load history if logged in
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, currentAnalysis]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getAnalysisHistory();
      if (data.success) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSelectHistory = async (repoUrl) => {
    setLoadingAnalysis(true);
    setErrorMessage('');
    try {
      const data = await analyzeRepository(repoUrl);
      if (data.success) {
        setCurrentAnalysis({
          repositoryData: data.repositoryData,
          aiExplanation: data.aiExplanation,
          roadmap: data.roadmap,
          repoUrl: repoUrl
        });
        setActiveTab('overview');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to load analysis. Make sure server is running.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleDeleteHistory = async (e, id) => {
    e.stopPropagation(); // Stop trigger select
    if (window.confirm('Are you sure you want to remove this repository from your history?')) {
      try {
        const data = await deleteAnalysisFromHistory(id);
        if (data.success) {
          setHistory(history.filter(item => item._id !== id));
          // If deleted repo is currently active, clear it
          if (currentAnalysis && history.find(i => i._id === id)?.repoUrl === currentAnalysis.repoUrl) {
            setCurrentAnalysis(null);
          }
        }
      } catch (error) {
        console.error('Failed to delete history item:', error.message);
      }
    }
  };

  const handleNewAnalysis = async (url) => {
    setLoadingAnalysis(true);
    setErrorMessage('');
    try {
      const data = await analyzeRepository(url);
      if (data.success) {
        setCurrentAnalysis({
          repositoryData: data.repositoryData,
          aiExplanation: data.aiExplanation,
          roadmap: data.roadmap,
          repoUrl: url
        });
        setActiveTab('overview');
      } else {
        setErrorMessage(data.error || 'Failed to analyze repository');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.error || 'Error connecting to the analysis server.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Tabs layout configuration
  const tabs = [
    { id: 'overview', name: 'Repository Overview', icon: LayoutDashboard },
    { id: 'architecture', name: 'Architecture Map', icon: Landmark },
    { id: 'ai-explanation', name: 'AI Explanation', icon: Sparkles },
    { id: 'roadmap', name: 'Contribution Roadmap', icon: MessageCircleCode }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {loadingAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0f19]/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-violet-500" />
            <p className="text-sm font-semibold text-gray-300">Retrieving repository analysis...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left Column: Analysis history list (if logged in) or simple options panel */}
        <div className="lg:col-span-1 space-y-6">
          {user ? (
            <div className="glass-panel rounded-2xl p-5 text-left">
              <h3 className="font-display text-sm font-bold tracking-tight text-white mb-4 flex items-center gap-2">
                <Compass className="h-4 w-4 text-violet-400" />
                Analysis History
              </h3>
              
              {loadingHistory ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                </div>
              ) : history.length > 0 ? (
                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                  {history.map((item) => {
                    const isActive = currentAnalysis && currentAnalysis.repoUrl === item.repoUrl;
                    return (
                      <div
                        key={item._id}
                        onClick={() => handleSelectHistory(item.repoUrl)}
                        className={`group relative rounded-xl p-3 text-left border transition-all duration-200 cursor-pointer ${
                          isActive 
                            ? 'bg-violet-500/10 border-violet-500/30' 
                            : 'border-white/5 bg-white/3 hover:bg-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="pr-6">
                          <div className="font-display text-xs font-bold text-white truncate group-hover:text-violet-400 transition-colors duration-150">
                            {item.projectName}
                          </div>
                          <div className="text-3xs text-gray-500 truncate mt-0.5">{item.repoUrl}</div>
                          {item.language && (
                            <span className="inline-block rounded bg-white/5 border border-white/5 px-1.5 py-0.5 text-4xs font-semibold text-gray-400 mt-2">
                              {item.language}
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={(e) => handleDeleteHistory(e, item._id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-500 hover:bg-rose-500/10 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                          title="Delete from history"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-gray-500">
                  No analyzed repositories yet. Run an analysis to build your history!
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-5 text-left border border-violet-500/10 bg-gradient-to-b from-[#111625] to-[#0b0f19]">
              <h3 className="font-display text-sm font-bold text-white mb-2">Guest Account</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                You are running in guest mode. Log in or create an account to save analyses in your navigation history.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="mt-4 w-full rounded-xl bg-violet-600/10 border border-violet-500/20 py-2.5 text-xs font-semibold text-violet-300 hover:bg-violet-600/20 hover:text-white transition-all duration-200 cursor-pointer"
              >
                Log In / Register
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic tab content panels */}
        <div className="lg:col-span-3 space-y-6">
          {currentAnalysis ? (
            <>
              {/* Tabs Selection Row */}
              <div className="flex flex-wrap gap-2 border-b border-white/5 pb-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                          : 'border-transparent text-gray-400 hover:text-white hover:bg-white/3'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>

              {/* Error messages block */}
              {errorMessage && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm font-medium text-rose-400 text-left">
                  {errorMessage}
                </div>
              )}

              {/* Selected tab dynamic panels */}
              <div className="transition-all duration-300">
                {activeTab === 'overview' && (
                  <RepositoryCard data={currentAnalysis.repositoryData} />
                )}

                {activeTab === 'architecture' && (
                  <ArchitectureMap 
                    language={currentAnalysis.repositoryData.language}
                    folders={currentAnalysis.repositoryData.folders}
                  />
                )}

                {activeTab === 'ai-explanation' && (
                  <AIResponseCard aiExplanation={currentAnalysis.aiExplanation} />
                )}

                {activeTab === 'roadmap' && (
                  <div className="space-y-6 text-left">
                    <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          <Code className="h-5.5 w-5.5" />
                        </div>
                        <div>
                          <h2 className="font-display text-xl font-bold text-white">Open Contribution Roadmap</h2>
                          <p className="text-xs text-gray-500">Beginner-friendly GitHub issues matched to skills</p>
                        </div>
                      </div>

                      {currentAnalysis.roadmap && currentAnalysis.roadmap.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {currentAnalysis.roadmap.map((issue, idx) => (
                            <div key={idx} className="rounded-xl bg-[#0d1220] border border-white/5 p-5 hover:border-white/10 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-3">
                                {/* Badges */}
                                <div className="flex flex-wrap gap-2">
                                  <span className={`inline-flex items-center rounded px-2 py-0.5 text-3xs font-semibold uppercase tracking-wider ${
                                    issue.difficulty === 'beginner' 
                                      ? 'bg-emerald-500/15 text-emerald-400' 
                                      : issue.difficulty === 'intermediate'
                                      ? 'bg-amber-500/15 text-amber-400'
                                      : 'bg-rose-500/15 text-rose-400'
                                  }`}>
                                    {issue.difficulty}
                                  </span>

                                  {issue.labels && issue.labels.slice(0, 3).map((l, id) => (
                                    <span key={id} className="inline-flex items-center rounded bg-white/5 border border-white/5 px-2 py-0.5 text-3xs font-medium text-gray-400">
                                      {l}
                                    </span>
                                  ))}
                                </div>

                                {/* Issue Title */}
                                <h3 className="font-display text-sm font-bold text-white group-hover:text-violet-400 transition-colors duration-150">
                                  {issue.title}
                                </h3>

                                {/* Suggested specifications */}
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-2xs text-gray-500">
                                  {issue.skills && issue.skills.length > 0 && (
                                    <div>
                                      <span className="font-semibold text-gray-400">Required Skills: </span>
                                      {issue.skills.join(', ')}
                                    </div>
                                  )}
                                  {issue.files && issue.files.length > 0 && (
                                    <div>
                                      <span className="font-semibold text-gray-400">Suggested Files: </span>
                                      <code className="text-3xs bg-white/5 px-1 py-0.5 rounded text-violet-300 font-mono">{issue.files.join(', ')}</code>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* External Link */}
                              {issue.url && (
                                <a
                                  href={issue.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600/10 border border-violet-500/20 px-4 py-2.5 text-xs font-semibold text-violet-300 hover:bg-violet-600/20 hover:text-white transition-all duration-200 shrink-0 cursor-pointer text-center"
                                >
                                  View Issue
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-sm text-gray-500 border border-dashed border-white/5 rounded-xl">
                          No explicitly labeled beginner issues found in this repository. 
                          Try visiting the issues tab directly to search for document updates or check other repositories.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Empty State search dashboard */
            <div className="glass-panel rounded-3xl p-10 md:p-16 text-center space-y-6 border border-white/5 bg-gradient-to-b from-[#111625]/50 to-[#0b0f19]">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                  <LayoutDashboard className="h-8 w-8 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2 max-w-xl mx-auto">
                <h2 className="font-display text-2xl font-bold text-white">Repository Navigation Center</h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Start by pasting a GitHub repository URL below to retrieve visual code layouts, architecture models, and contribution roadmaps.
                </p>
              </div>

              {errorMessage && (
                <div className="max-w-2xl mx-auto rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm font-medium text-rose-400">
                  {errorMessage}
                </div>
              )}

              <div className="max-w-2xl mx-auto pt-4">
                <RepoInput onAnalyze={handleNewAnalysis} isLoading={loadingAnalysis} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
