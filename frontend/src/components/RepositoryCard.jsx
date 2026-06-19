import React from 'react';
import { Star, GitFork, BookOpen, Hash, Layers } from 'lucide-react';

function RepositoryCard({ data }) {
  if (!data) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
              {data.projectName}
            </h2>
            {data.language && (
              <span className="inline-flex items-center rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300">
                {data.language}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed max-w-3xl">
            {data.description || 'No description provided for this repository.'}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/5 px-4 py-2.5 text-sm font-semibold text-amber-400">
            <Star className="h-4.5 w-4.5 fill-current" />
            <span>{data.stars.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/5 px-4 py-2.5 text-sm font-semibold text-blue-400">
            <GitFork className="h-4.5 w-4.5" />
            <span>{data.forks.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Metadata items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Technologies/Topics */}
        {data.technologies && data.technologies.length > 0 && (
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" />
              Repository Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-lg bg-[#0d1220] border border-white/5 px-3 py-1.5 text-xs font-medium text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Important Files list */}
        {data.importantFiles && data.importantFiles.length > 0 && (
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Key Setup & Config Files
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.importantFiles.map((file, index) => (
                <code
                  key={index}
                  className="rounded-lg bg-violet-500/5 border border-violet-500/10 px-3 py-1.5 text-xs font-mono text-violet-300"
                >
                  {file}
                </code>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RepositoryCard;
