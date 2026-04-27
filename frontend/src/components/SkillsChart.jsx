import React from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: i < payload.length - 1 ? 4 : 0 }}>
          <span style={{ opacity: 0.7 }}>{p.name}: </span>
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const SkillsChart = ({ data }) => {
  if (!data) return null;

  // Build radar data from sub_scores
  const radarData = [
    { axis: 'Technical Depth', you: data.sub_scores.technical_depth, ideal: 85 },
    { axis: 'Impact & Metrics', you: data.sub_scores.impact_metrics, ideal: 85 },
    { axis: 'Clarity', you: data.sub_scores.clarity_precision, ideal: 85 },
    { axis: 'Role Fit', you: data.sub_scores.role_alignment, ideal: 85 },
  ];

  // Sort skills by importance descending
  const skills = [...(data.skill_importance_data || [])].sort((a, b) => b.importance - a.importance);

  const getBarGradient = (value) => {
    if (value >= 80) return 'linear-gradient(90deg, #059669, #22c55e)';
    if (value >= 60) return 'linear-gradient(90deg, #2563eb, #60a5fa)';
    if (value >= 40) return 'linear-gradient(90deg, #d97706, #fbbf24)';
    return 'linear-gradient(90deg, #dc2626, #f87171)';
  };

  const getScoreLabel = (value) => {
    if (value >= 80) return { text: 'Strong', color: '#22c55e' };
    if (value >= 60) return { text: 'Good', color: '#60a5fa' };
    if (value >= 40) return { text: 'Fair', color: '#fbbf24' };
    return { text: 'Weak', color: '#f87171' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* ── RADAR CHART ── */}
      <div className="surface p-6 analytics-card stagger-5">
        <div className="mb-5">
          <p className="label mb-1">Competency Radar</p>
          <p className="text-xs text-zinc-600">Your profile vs. ideal senior candidate</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
              <PolarGrid
                stroke="rgba(255,255,255,0.06)"
                gridType="polygon"
              />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Ideal Profile"
                dataKey="ideal"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.04}
                strokeWidth={1.5}
                strokeDasharray="5 3"
              />
              <Radar
                name="You"
                dataKey="you"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.12}
                strokeWidth={2.5}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-8 mt-1">
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <div className="w-5 h-[2px] rounded bg-blue-500" />
            Your Score
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <div className="w-5 h-[2px] rounded bg-emerald-500 opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #22c55e 0, #22c55e 3px, transparent 3px, transparent 6px)' }} />
            Ideal (85+)
          </div>
        </div>
      </div>

      {/* ── SKILL IMPORTANCE HEATMAP ── */}
      <div className="surface p-6 analytics-card stagger-6">
        <div className="mb-5">
          <p className="label mb-1">Skill Importance Map</p>
          <p className="text-xs text-zinc-600">{skills.length} skills ranked by relevance to target role</p>
        </div>
        <div className="space-y-4">
          {skills.map((skill, i) => {
            const label = getScoreLabel(skill.importance);
            return (
              <div key={i} className="group">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: label.color }} />
                    <span className="text-[13px] text-zinc-300 font-medium">{skill.skill}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: label.color }}>{label.text}</span>
                    <span className="text-xs font-mono text-zinc-500 tabular-nums w-8 text-right">{skill.importance}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full skill-bar-fill"
                    style={{
                      width: `${skill.importance}%`,
                      background: getBarGradient(skill.importance),
                      animationDelay: `${i * 80 + 300}ms`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary footer */}
        {skills.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/[0.04] flex justify-between items-center">
            <span className="text-[11px] text-zinc-600">
              Avg. importance: <span className="text-zinc-400 font-mono">{Math.round(skills.reduce((a, s) => a + s.importance, 0) / skills.length)}</span>
            </span>
            <span className="text-[11px] text-zinc-600">
              Top skill: <span className="text-zinc-400">{skills[0]?.skill}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsChart;