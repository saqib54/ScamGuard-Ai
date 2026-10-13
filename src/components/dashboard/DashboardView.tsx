import React, { useEffect, useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, BarChart3, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { DashboardStats } from '../../types/index.ts';
import { ClaySticker, ClayStamp, STICKER_IMAGES } from '../ui/ClaySticker.tsx';

interface DashboardViewProps {
  onStartScan: () => void;
  onSelectAnalysis: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onStartScan, onSelectAnalysis }) => {
  const { t } = useLanguage();
  const { getAuthHeaders } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/v1/dashboard/stats', {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch {
        // Handle error
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="clay-card p-12 text-center text-slate-500 space-y-2">
        <Sparkles className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-800" />
        <span className="text-xs font-semibold">Aggregating security telemetry...</span>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="clay-card p-8 sm:p-12 text-center space-y-5 relative overflow-hidden">
        <div className="flex justify-center mb-2">
          <ClaySticker
            imageSrc={STICKER_IMAGES.aiRobotDetective}
            alt="AI Cyber Guardian"
            size="md"
            rotation={-3}
            badgeText="READY TO SCAN"
            tapeTop
          />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-lg font-black text-slate-900">
            {t('dashboardTitle')}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {t('noScansYet')}
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-1">
          <button
            onClick={onStartScan}
            className="clay-button-primary inline-flex items-center gap-2 px-6 py-3 text-xs font-black"
          >
            <span>{t('btnStartFirstScan')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Tactical Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {t('dashboardTitle')}
            </h2>
            <ClayStamp text="LIVE TELEMETRY" variant="success" rotation={-2} />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {t('dashboardSubtitle')}
          </p>
        </div>

        <div className="hidden sm:block">
          <ClaySticker
            imageSrc={STICKER_IMAGES.securitySeal}
            alt="Verified Security Seal"
            size="sm"
            rotation={3}
            badgeText="VERIFIED"
          />
        </div>
      </div>

      {/* Metric Cards Grid in Claymorphism */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 clay-card space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            {t('statTotalScans')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 tabular-nums">
              {stats.total}
            </span>
            <span className="text-xs font-semibold text-slate-400">records</span>
          </div>
        </div>

        <div className="p-5 clay-card space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            {t('statAvgRisk')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 tabular-nums">
              {stats.averageRiskScore}
            </span>
            <span className="text-xs font-bold text-slate-400 font-mono">/ 100</span>
          </div>
        </div>

        <div className="p-5 clay-card space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 block">
            {t('statCriticalThreats')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-rose-700 tabular-nums">
              {stats.riskDistribution.critical + stats.riskDistribution.high}
            </span>
            <span className="text-xs text-rose-600 font-bold">flagged</span>
          </div>
        </div>

        <div className="p-5 clay-card space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
            {t('statSafeCount')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-700 tabular-nums">
              {stats.riskDistribution.low}
            </span>
            <span className="text-xs text-emerald-600 font-bold">safe</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Risk Distribution + Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Risk Distribution Breakdown */}
        <div className="p-6 clay-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              {t('riskDistributionTitle')}
            </h3>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3.5">
            {[
              { label: 'Critical Threat', count: stats.riskDistribution.critical, color: 'bg-rose-600' },
              { label: 'High Risk', count: stats.riskDistribution.high, color: 'bg-rose-500' },
              { label: 'Elevated Risk', count: stats.riskDistribution.elevated, color: 'bg-amber-500' },
              { label: 'Low Risk', count: stats.riskDistribution.low, color: 'bg-emerald-600' },
            ].map(item => {
              const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-bold">
                    <span>{item.label}</span>
                    <span className="font-mono tabular-nums">{item.count} ({pct}%)</span>
                  </div>
                  <div className="h-3 w-full clay-inset rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all shadow-xs`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Threat Categories */}
        <div className="p-6 clay-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              {t('topCategoriesTitle')}
            </h3>
            <ShieldAlert className="w-4 h-4 text-slate-400" />
          </div>

          {stats.topCategories.length === 0 ? (
            <p className="text-xs text-slate-400">No threat patterns identified yet.</p>
          ) : (
            <div className="space-y-2.5">
              {stats.topCategories.map(cat => (
                <div
                  key={cat.category}
                  className="flex items-center justify-between p-3 bg-slate-50/70 rounded-xl text-xs border border-slate-200/60 shadow-2xs"
                >
                  <span className="font-bold text-slate-800">{cat.category}</span>
                  <span className="font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    {cat.count} occurrences
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Analyses Activity */}
      <div className="p-6 clay-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-800" />
            <span>{t('recentActivityTitle')}</span>
          </h3>
          <button
            onClick={onStartScan}
            className="text-xs text-emerald-800 hover:text-emerald-950 font-extrabold underline"
          >
            + Quick Scan
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {stats.recentAnalyses.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectAnalysis(item.id)}
              className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl cursor-pointer transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                    {item.input_type}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-800 truncate font-mono font-medium">
                  {item.content_snippet}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg ${
                    item.risk_level === 'critical' || item.risk_level === 'high'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : item.risk_level === 'elevated'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {item.risk_score}/100
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
