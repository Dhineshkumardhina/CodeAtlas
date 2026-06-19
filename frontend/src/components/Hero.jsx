import React from 'react';
import RepoInput from './RepoInput';
import { Sparkles, Terminal, ShieldCheck, Cpu } from 'lucide-react';

function Hero({ onAnalyze, isLoading }) {
  return (
    <div className="relative overflow-hidden py-24 sm:py-32">
      {/* Visual background glows */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]"></div>
      <div className="absolute top-1/3 left-1/3 -z-10 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[100px]"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-violet-300 backdrop-blur-md mb-8 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Open Source Navigation
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-none">
            Understand Any Open Source <br />
            Project with <span className="text-gradient">AI</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-8 text-gray-400">
            Analyze repositories, understand codebase architecture, locate key files, and get a beginner-friendly contribution roadmap in seconds.
          </p>

          {/* Input block */}
          <div className="mx-auto mt-10 max-w-2xl">
            <RepoInput onAnalyze={onAnalyze} isLoading={isLoading} />
          </div>

          {/* Core Specs / Mini Stats */}
          <div className="mx-auto mt-16 max-w-3xl grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="glass-panel rounded-2xl p-5 text-center flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/10 text-violet-400">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-display">Instant</div>
                <div className="text-xs text-gray-500 mt-0.5">Codebase Parsing</div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 text-center flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-500/10 text-blue-400">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-display">Gemini 1.5</div>
                <div className="text-xs text-gray-500 mt-0.5">Architecture Mapping</div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 text-center col-span-2 sm:col-span-1 flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-display">Beginner</div>
                <div className="text-xs text-gray-500 mt-0.5">Friendly Roadmaps</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
