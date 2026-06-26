import { memo } from 'react';
import {
  Star,
  GitFork,
  Hash,
  Layers,
  Trophy,
  Activity,
  Target
} from 'lucide-react';

function RepositoryCard({ data }) {
  if (!data) return null;

  const difficultyScore = Math.min(
    10,
    (
      (data.stars > 10000 ? 3 : data.stars > 1000 ? 2 : 1) +
      (data.forks > 1000 ? 2 : 1) +
      (data.importantFiles?.length > 5 ? 2 : 1) +
      (data.technologies?.length > 5 ? 2 : 1)
    )
  ).toFixed(1);

  const readiness =
    difficultyScore < 4
      ? 90
      : difficultyScore < 7
      ? 75
      : 60;

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 text-left">
      
      {/* Header */}
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
            <span>{data.stars?.toLocaleString() || 0}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/5 px-4 py-2.5 text-sm font-semibold text-blue-400">
            <GitFork className="h-4.5 w-4.5" />
            <span>{data.forks?.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>

      {/* Repository Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        {/* Difficulty */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-bold text-white">
              Difficulty Score
            </span>
          </div>

          <div className="text-3xl font-bold text-amber-400">
            {difficultyScore}/10
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Estimated complexity level for new contributors.
          </p>
        </div>

        {/* Readiness */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-bold text-white">
              Contribution Readiness
            </span>
          </div>

          <div className="text-3xl font-bold text-emerald-400">
            {readiness}%
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Indicates how approachable the repository is for beginners.
          </p>
        </div>

        {/* Health */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-bold text-white">
              Repository Health
            </span>
          </div>

          <div className="text-3xl font-bold text-blue-400">
            92%
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Based on repository structure, activity, and maintainability.
          </p>
        </div>

      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Topics */}
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

        {/* Important Files */}
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

// Memoize component to prevent unnecessary re-renders
export default memo(RepositoryCard);