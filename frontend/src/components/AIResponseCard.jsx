import React from 'react';
import { Brain, MapPin, Compass, PlayCircle, Milestone } from 'lucide-react';

function AIResponseCard({ aiExplanation }) {
  if (!aiExplanation) return null;

  const { overview, architectureExplanation, importantFiles, beginnerStartingPoint, learningRoadmap } = aiExplanation;

  return (
    <div className="space-y-8 text-left">
      
      {/* Overview & Architecture Card */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Brain className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white">AI Codebase Analysis</h2>
            <p className="text-xs text-gray-500">Gemini-generated architectural explanation</p>
          </div>
        </div>

        {/* Project Overview */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
            Project Summary
          </h3>
          <p className="text-sm leading-relaxed text-gray-400">
            {overview}
          </p>
        </div>

        {/* Architecture Breakdown */}
        <div className="border-t border-white/5 pt-4">
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            Architecture & Design Patterns
          </h3>
          <p className="text-sm leading-relaxed text-gray-400 whitespace-pre-line">
            {architectureExplanation}
          </p>
        </div>
      </div>

      {/* Starting point panel */}
      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <MapPin className="h-5.5 w-5.5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-white">Suggested Starting Point</h3>
            <p className="text-xs text-gray-500 mt-0.5">Ideal starting location to read the code</p>
            <p className="text-sm leading-relaxed text-gray-400 mt-3">
              {beginnerStartingPoint}
            </p>
            {importantFiles && importantFiles.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-2xs font-bold uppercase tracking-wider text-gray-500 mr-2">Key Files:</span>
                {importantFiles.map((file, idx) => (
                  <code key={idx} className="rounded bg-white/5 border border-white/5 px-2 py-0.5 text-2xs font-mono text-gray-300">
                    {file}
                  </code>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Learning Roadmap timeline */}
      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Milestone className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white">Learning Roadmap</h2>
            <p className="text-xs text-gray-500">Step-by-step repository walkthrough path</p>
          </div>
        </div>

        {/* Timeline representation */}
        <div className="relative border-l border-white/10 pl-6 ml-3 space-y-8">
          {learningRoadmap && learningRoadmap.map((step, index) => (
            <div key={index} className="relative">
              {/* Dot marker */}
              <span className="absolute -left-[31px] top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#0b0f19] border-2 border-indigo-500 text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
              </span>
              <div>
                <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-3xs font-medium text-indigo-300 border border-indigo-500/20">
                  Step {index + 1}
                </span>
                <p className="text-sm font-medium text-gray-200 mt-2">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default AIResponseCard;
