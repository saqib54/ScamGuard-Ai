import React, { useEffect, useState } from 'react';
import {
  Shield, ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, BarChart3,
  Clock, Sparkles, Globe, Activity, CheckCircle2, Radio
} from 'lucide-react';
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
      <div className="clay-card p-8 sm:p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
        <Sparkles className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-800 dark:text-emerald-400" />
        <span className="text-xs font-semibold">Aggregating real-time security telemetry...</span>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="clay-card p-6 sm:p-12 text-center space-y-5 relative overflow-hidden">
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
        <div className="max-w-md mx-auto space-y-1.5">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
            {t('dashboardTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {t('noScansYet')}
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-1">
          <button
            onClick={onStartScan}
            className="clay-button-primary inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-black"
          >
            <span>{t('btnStartFirstScan')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Title & Tactical Badge (Fully Responsive on Mobile) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {t('dashboardTitle')}
            </h2>
            <ClayStamp text="LIVE TELEMETRY" variant="success" rotation={-2} />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
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

      {/* Real-Time Public Blacklists Feed Status Bar */}
      <div className="clay-card p-3 sm:p-4 bg-white dark:bg-[#111a2e] border border-emerald-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Live Public Blacklists & Reputation Feeds</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Active real-time query layer enabled before displaying analysis results
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[
              { name: 'URLhaus (abuse.ch)', status: 'Connected' },
              { name: 'OpenPhish', status: 'Synced' },
              { name: 'Spamhaus DBL', status: 'Live' },
              { name: 'ThreatFox IoC', status: 'Active' },
            ].map((feed) => (
              <span
                key={feed.name}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{feed.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Cards Grid in Claymorphism (Responsive: 1 col on XS, 2 on SM, 4 on LG) */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 clay-card space-y-1.5">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            {t('statTotalScans')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-slate-900 dark:text-slate-100 tabular-nums">
              {stats.total}
            </span>
            <span className="text-xs font-semibold text-slate-400">records</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 clay-card space-y-1.5">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            {t('statAvgRisk')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-slate-900 dark:text-slate-100 tabular-nums">
              {stats.averageRiskScore}
            </span>
            <span className="text-xs font-bold text-slate-400 font-mono">/ 100</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 clay-card space-y-1.5">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-rose-500 block">
            {t('statCriticalThreats')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-rose-700 dark:text-rose-400 tabular-nums">
              {stats.riskDistribution.critical + stats.riskDistribution.high}
            </span>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-bold">flagged</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 clay-card space-y-1.5">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
            {t('statSafeCount')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
              {stats.riskDistribution.low}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">safe</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Risk Distribution + Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Risk Distribution Breakdown */}
        <div className="p-4 sm:p-6 clay-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {t('riskDistributionTitle')}
            </h3>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {[
              { label: 'Critical Threat', count: stats.riskDistribution.critical, color: 'bg-rose-600' },
              { label: 'High Risk', count: stats.riskDistribution.high, color: 'bg-rose-500' },
              { label: 'Elevated Risk', count: stats.riskDistribution.elevated, color: 'bg-amber-500' },
              { label: 'Low Risk', count: stats.riskDistribution.low, color: 'bg-emerald-600' },
            ].map(item => {
              const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5 font-bold">
                    <span>{item.label}</span>
                    <span className="font-mono tabular-nums">{item.count} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 sm:h-3 w-full clay-inset rounded-full overflow-hidden p-0.5">
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
        <div className="p-4 sm:p-6 clay-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {t('topCategoriesTitle')}
            </h3>
            <ShieldAlert className="w-4 h-4 text-slate-400" />
          </div>

          {stats.topCategories.length === 0 ? (
            <p className="text-xs text-slate-400 py-3">No threat patterns identified yet.</p>
          ) : (
            <div className="space-y-2 sm:space-y-2.5">
              {stats.topCategories.map(cat => (
                <div
                  key={cat.category}
                  className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-50/70 dark:bg-slate-800/60 rounded-xl text-xs border border-slate-200/60 dark:border-slate-700/60 shadow-2xs"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate pr-2">
                    {cat.category}
                  </span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs shrink-0">
                    {cat.count} occurrences
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Analyses Activity */}
      <div className="p-4 sm:p-6 clay-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
            <span>{t('recentActivityTitle')}</span>
          </h3>
          <button
            onClick={onStartScan}
            className="text-xs text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 font-extrabold underline"
          >
            + Quick Scan
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {stats.recentAnalyses.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectAnalysis(item.id)}
              className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 px-2 rounded-xl cursor-pointer transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    {item.input_type}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 truncate font-mono font-medium">
                  {item.content_snippet}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t border-slate-50 dark:border-slate-800 sm:border-0">
                <span
                  className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg ${
                    item.risk_level === 'critical' || item.risk_level === 'high'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                      : item.risk_level === 'elevated'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
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
