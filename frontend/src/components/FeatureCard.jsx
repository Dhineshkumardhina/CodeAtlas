import React from 'react';

function FeatureCard({ Icon, title, description, badge }) {
  return (
    <div className="glass-panel glass-panel-hover group relative overflow-hidden rounded-2xl p-8 text-left">
      {/* Decorative top corner gradient splash */}
      <div className="absolute -top-10 -right-10 -z-10 h-28 w-28 rounded-full bg-violet-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Feature Icon */}
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
        <Icon className="h-6 w-6" />
      </div>

      {/* Feature Title */}
      <h3 className="mt-6 font-display text-lg font-bold text-white flex items-center gap-2">
        {title}
        {badge && (
          <span className="inline-flex items-center rounded-full bg-violet-500/10 px-2 py-0.5 text-2xs font-medium text-violet-300 border border-violet-500/20">
            {badge}
          </span>
        )}
      </h3>

      {/* Feature Description */}
      <p className="mt-2 text-sm leading-relaxed text-gray-400">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;
