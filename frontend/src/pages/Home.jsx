import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import { Compass, BookOpen, Layers, Milestone, ArrowRight, Github, Code, Sparkles, Terminal, Activity } from 'lucide-react';
import { analyzeRepository } from '../services/api';
import { useAuth } from '../App';

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [analysisError, setAnalysisError] = useState('');
  const { setCurrentAnalysis } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to section on landing
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Clear state to avoid scrolling on refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  // Loading animation sequence stages
  const loadingStages = [
    'Connecting to GitHub API...',
    'Parsing file tree structures and topics...',
    'Downloading README content...',
    'Interpreting codebase structure...',
    'Querying Gemini AI service layer...',
    'Generating interactive architecture maps...',
    'Mapping open beginner issues to codebase roadmaps...',
    'Finalizing analysis results...'
  ];

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev < loadingStages.length - 1 ? prev + 1 : prev));
      }, 2200);
    } else {
      setLoadingStage(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async (repoUrl) => {
    setIsLoading(true);
    setAnalysisError('');
    try {
      const data = await analyzeRepository(repoUrl);
      if (data.success) {
        setCurrentAnalysis({
          repositoryData: data.repositoryData,
          aiExplanation: data.aiExplanation,
          roadmap: data.roadmap,
          repoUrl: repoUrl
        });
        navigate('/dashboard');
      } else {
        setAnalysisError(data.error || 'Failed to analyze repository. Check URL and try again.');
      }
    } catch (err) {
      console.error(err);
      setAnalysisError(err.response?.data?.error || 'Error connecting to the analysis server. Make sure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Search Analysis Loader overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0f19]/90 backdrop-blur-md">
          <div className="glass-panel max-w-md rounded-2xl p-8 text-center space-y-6 border border-violet-500/20 shadow-2xl shadow-violet-500/10">
            <div className="flex justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/25">
                <Compass className="h-10 w-10 text-violet-400 animate-spin" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-lg font-bold text-white">Analyzing Repository</h3>
              <p className="text-sm text-gray-400">This may take 10-15 seconds for large projects...</p>
            </div>
            
            {/* Status ticker */}
            <div className="rounded-xl bg-white/5 border border-white/5 p-4 flex items-center gap-3">
              <Activity className="h-4 w-4 text-violet-400 animate-pulse shrink-0" />
              <span className="text-xs font-mono text-violet-300 text-left line-clamp-1">{loadingStages[loadingStage]}</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero section */}
      <Hero onAnalyze={handleAnalyze} isLoading={isLoading} />

      {analysisError && (
        <div className="mx-auto max-w-2xl px-6 pb-6">
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-center text-sm font-medium text-rose-400">
            {analysisError}
          </div>
        </div>
      )}

      {/* Features Grid Section */}
      <section id="features" className="py-24 border-t border-white/5 relative">
        <div className="absolute top-1/2 left-0 -z-10 h-72 w-72 rounded-full bg-blue-600/5 blur-[120px]"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Equipped to Guide Your Contributions
            </h2>
            <p className="mt-4 text-base text-gray-400">
              CodeAtlas simplifies the open-source onboarding process with dedicated tools.
            </p>
          </div>

          <div className="mx-auto max-w-5xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            <FeatureCard
              Icon={Code}
              title="Repo Architecture Scraper"
              description="Parses languages, dependencies, config structures, and README files to build a baseline layout of the software."
            />
            <FeatureCard
              Icon={Brain}
              title="AI Codebase Explanations"
              description="Simplifies files and design patterns. Describes how folders route and interact using Google Gemini."
            />
            <FeatureCard
              Icon={Layers}
              title="Interactive Flow Maps"
              description="Provides interactive visual components showing how the user requests, databases, and APIs fit together."
            />
            <FeatureCard
              Icon={Milestone}
              title="Beginner Checklists"
              description="Extracts public issues labeled 'good first issue' and parses them to recommend required files and starting skills."
              badge="Roadmap"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 border-t border-white/5 bg-[#080b13]/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-base text-gray-400">
              Go from codebase confusion to your first commit in three simple steps.
            </p>
          </div>

          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/10 border border-violet-500/20 font-display text-lg font-bold text-violet-400">
                1
              </div>
              <h3 className="font-display text-lg font-bold text-white">Paste URL</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Paste any public GitHub repository link in the input bar and click Analyze.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 font-display text-lg font-bold text-blue-400">
                2
              </div>
              <h3 className="font-display text-lg font-bold text-white">AI Explains</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Gemini reviews the files and README, producing explanations and flow maps.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 border border-emerald-500/20 font-display text-lg font-bold text-emerald-400">
                3
              </div>
              <h3 className="font-display text-lg font-bold text-white">Start Contributing</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Review beginner friendly open issues with matched files and coding requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Block */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-violet-600/5 blur-[120px]"></div>
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="glass-panel rounded-3xl p-10 md:p-16 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-violet-600/10 to-blue-500/10 rounded-full blur-2xl"></div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white">
              Ready to Navigate Codebases?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
              Create an account to save your analyzed repositories, build search history, and track contribution roadmaps.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => navigate('/login?tab=register')}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/35 transition-all duration-200 cursor-pointer"
              >
                Sign Up Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
