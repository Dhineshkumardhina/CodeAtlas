import React, { useState } from 'react';
import { Monitor, ArrowRight, Server, Database, Brain, GitBranch, ArrowDown, HelpCircle } from 'lucide-react';

function ArchitectureMap({ language, folders }) {
  const [selectedNode, setSelectedNode] = useState('frontend');

  const nodes = {
    frontend: {
      title: 'Client Layer (Frontend)',
      tech: `React.js (Vite) + Tailwind CSS + Axios`,
      description: 'The entry point for the user. Built as a high-performance Single Page Application (SPA). Captures the repository URL, handles JWT token persistence, and displays interactive repository maps and contribution checklists.',
      icon: Monitor,
      color: 'from-violet-500 to-fuchsia-500',
      glow: 'shadow-violet-500/20 border-violet-500/30'
    },
    backend: {
      title: 'Application Server (Backend)',
      tech: 'Node.js + Express.js API',
      description: 'Coordinates request routing, user validation, and caching logic. When a request for analysis arrives, it inspects the MongoDB cache. If not found, it orchestrates the GitHub scraper and AI services.',
      icon: Server,
      color: 'from-blue-500 to-indigo-500',
      glow: 'shadow-blue-500/20 border-blue-500/30'
    },
    database: {
      title: 'Database Cache Layer',
      tech: 'MongoDB + Mongoose ODM',
      description: 'Stores user accounts and caches repository analysis reports. Caching avoids hitting GitHub and Gemini API rate limits on repeated searches, serving analytics instantly.',
      icon: Database,
      color: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/20 border-emerald-500/30'
    },
    github: {
      title: 'Scraper / GitHub API Layer',
      tech: 'GitHub REST API Integration',
      description: 'Fetches code repository metadata (description, language, stars, forks), top-level file trees, README content, and filters active open issues labeled "good first issue" or "beginner".',
      icon: GitBranch,
      color: 'from-amber-500 to-orange-500',
      glow: 'shadow-amber-500/20 border-amber-500/30'
    },
    ai: {
      title: 'AI Explanation Service',
      tech: 'Google Gemini 1.5 API Layer',
      description: 'Leverages Gemini Large Language Models (LLM) to examine the README, technologies, and folder layouts. Automatically generates code overviews, architecture notes, and beginner roadmaps.',
      icon: Brain,
      color: 'from-rose-500 to-pink-500',
      glow: 'shadow-rose-500/20 border-rose-500/30'
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h2 className="font-display text-xl font-bold text-white">System Architecture Map</h2>
          <p className="text-sm text-gray-400 mt-1">
            Click on any module to inspect its role and integration details.
          </p>
        </div>
        
        {language && (
          <div className="flex items-center gap-3 rounded-xl bg-violet-500/5 border border-violet-500/10 px-4 py-2 text-sm text-violet-300 font-medium shrink-0">
            <span className="h-2 w-2 rounded-full bg-violet-400 glow-active"></span>
            Primary Language: {language}
          </div>
        )}
      </div>

      {/* Main Flow Chart Visualizer */}
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between lg:gap-4 py-6">
        
        {/* Node 1: Frontend */}
        <button
          onClick={() => setSelectedNode('frontend')}
          className={`glass-panel w-full lg:w-48 rounded-2xl p-5 text-center flex flex-col items-center gap-3 transition-all duration-300 border cursor-pointer hover:-translate-y-1 ${
            selectedNode === 'frontend' 
              ? 'bg-violet-500/10 border-violet-500/50 shadow-lg shadow-violet-500/10 scale-105' 
              : 'border-white/5 hover:border-white/10'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md">
            <Monitor className="h-6 w-6" />
          </div>
          <div>
            <div className="font-display text-sm font-bold text-white">Frontend Client</div>
            <div className="text-2xs text-gray-500 mt-0.5">React (Vite) App</div>
          </div>
        </button>

        {/* Connector 1 */}
        <div className="hidden lg:flex items-center text-violet-500/30">
          <ArrowRight className="h-6 w-6 animate-pulse" />
        </div>
        <div className="lg:hidden text-violet-500/30">
          <ArrowDown className="h-6 w-6 animate-pulse" />
        </div>

        {/* Node 2: Backend */}
        <button
          onClick={() => setSelectedNode('backend')}
          className={`glass-panel w-full lg:w-48 rounded-2xl p-5 text-center flex flex-col items-center gap-3 transition-all duration-300 border cursor-pointer hover:-translate-y-1 ${
            selectedNode === 'backend' 
              ? 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/10 scale-105' 
              : 'border-white/5 hover:border-white/10'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
            <Server className="h-6 w-6" />
          </div>
          <div>
            <div className="font-display text-sm font-bold text-white">Backend API</div>
            <div className="text-2xs text-gray-500 mt-0.5">Node/Express Server</div>
          </div>
        </button>

        {/* Connector 2 */}
        <div className="hidden lg:flex items-center text-blue-500/30">
          <ArrowRight className="h-6 w-6 animate-pulse" />
        </div>
        <div className="lg:hidden text-blue-500/30">
          <ArrowDown className="h-6 w-6 animate-pulse" />
        </div>

        {/* Branch: DB / API / AI (Node 3, 4, 5 stacked or side-by-side) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Node 3: DB */}
          <button
            onClick={() => setSelectedNode('database')}
            className={`glass-panel w-full sm:w-40 rounded-2xl p-4 text-center flex flex-col items-center gap-3 transition-all duration-300 border cursor-pointer hover:-translate-y-1 ${
              selectedNode === 'database' 
                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10 scale-105' 
                : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-xs font-bold text-white">MongoDB Cache</div>
              <div className="text-3xs text-gray-500 mt-0.5">Mongoose ODM</div>
            </div>
          </button>

          {/* Node 4: GitHub Scraper */}
          <button
            onClick={() => setSelectedNode('github')}
            className={`glass-panel w-full sm:w-40 rounded-2xl p-4 text-center flex flex-col items-center gap-3 transition-all duration-300 border cursor-pointer hover:-translate-y-1 ${
              selectedNode === 'github' 
                ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10 scale-105' 
                : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-xs font-bold text-white">GitHub API</div>
              <div className="text-3xs text-gray-500 mt-0.5">Scraper Service</div>
            </div>
          </button>

          {/* Node 5: Gemini AI */}
          <button
            onClick={() => setSelectedNode('ai')}
            className={`glass-panel w-full sm:w-40 rounded-2xl p-4 text-center flex flex-col items-center gap-3 transition-all duration-300 border cursor-pointer hover:-translate-y-1 ${
              selectedNode === 'ai' 
                ? 'bg-rose-500/10 border-rose-500/50 shadow-lg shadow-rose-500/10 scale-105' 
                : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-sm">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-xs font-bold text-white">Gemini service</div>
              <div className="text-3xs text-gray-500 mt-0.5">AI Engine Layer</div>
            </div>
          </button>
        </div>

      </div>

      {/* Selected Node Details Panel */}
      <div className="mt-8 rounded-2xl bg-white/3 border border-white/5 p-5 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${nodes[selectedNode].color} text-white`}>
            {React.createElement(nodes[selectedNode].icon, { className: 'h-5 w-5' })}
          </div>
          <div>
            <h4 className="font-display text-base font-bold text-white">{nodes[selectedNode].title}</h4>
            <div className="text-xs font-semibold text-violet-400 mt-0.5">{nodes[selectedNode].tech}</div>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              {nodes[selectedNode].description}
            </p>
          </div>
        </div>
      </div>

      {/* Target Repository Folder Structure Snippet if available */}
      {folders && folders.length > 0 && (
        <div className="mt-8 border-t border-white/5 pt-6 text-left">
          <h4 className="font-display text-sm font-bold text-gray-300 mb-4">Target Repository Folder Structure</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {folders.map((folder, index) => (
              <div key={index} className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-xs font-medium text-gray-300">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                {folder}/
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArchitectureMap;
