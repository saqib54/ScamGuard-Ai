import React, { useState } from 'react';
import {
  Globe, ShieldAlert, ShieldCheck, AlertTriangle, RefreshCw, ExternalLink,
  CheckCircle2, XCircle, AlertOctagon, Activity, Radio
} from 'lucide-react';
import { UrlReputationCheckResult, BlacklistCheckItem } from '../../types/index.ts';
import { useToast } from '../ui/Toast.tsx';

interface UrlReputationCardProps {
  initialReputation?: UrlReputationCheckResult;
  targetUrl: string;
}

export const UrlReputationCard: React.FC<UrlReputationCardProps> = ({
  initialReputation,
  targetUrl
}) => {
  const { showToast } = useToast();
  const [reputation, setReputation] = useState<UrlReputationCheckResult | undefined>(initialReputation);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    if (!targetUrl) return;
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/reputation/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      if (res.ok) {
        const data = await res.json();
        setReputation(data.reputation);
        showToast('Real-time blacklist reputation refreshed.', 'success');
      } else {
        throw new Error();
      }
    } catch {
      showToast('Could not query public blacklists.', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!reputation && !targetUrl) {
    return null;
  }

  const isBlacklisted = reputation?.isBlacklisted ?? false;
  const isSuspicious = reputation?.overallVerdict === 'suspicious';
  const blacklists = reputation?.blacklists || [];

  return (
    <div className="clay-card p-4 sm:p-6 space-y-4 sm:space-y-5 border border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2.5 rounded-xl shadow-xs shrink-0 ${
            isBlacklisted
              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
              : isSuspicious
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
          }`}>
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs sm:text-sm font-black tracking-tight text-slate-900 dark:text-slate-100">
                Real-Time Public Blacklist & Threat Reputation
              </h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>LIVE LOOKUP</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Queried against international abuse feeds before analysis completion.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="clay-button-secondary inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 self-start sm:self-auto shrink-0 disabled:opacity-60"
          title="Re-query public blacklist feeds in real-time"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          <span>{isRefreshing ? 'Querying...' : 'Re-check Blacklists'}</span>
        </button>
      </div>

      {/* Target URL Info Bar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-850/70 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
            Target Host:
          </span>
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">
            {reputation?.hostname || targetUrl}
          </span>
        </div>
        {reputation?.checkedAt && (
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
            Checked: {new Date(reputation.checkedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Overall Verdict Banner */}
      {isBlacklisted ? (
        <div className="clay-banner-critical p-4 rounded-2xl flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-rose-700 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-rose-800 dark:text-rose-300 block">
              VERIFIED THREAT LISTING DETECTED
            </span>
            <p className="text-xs text-rose-900 dark:text-rose-200 font-semibold leading-relaxed">
              {reputation?.summary}
            </p>
            {reputation?.threatCategory && (
              <span className="inline-block px-2.5 py-0.5 mt-1 rounded-md text-[10px] font-mono font-black bg-rose-700 text-white shadow-2xs">
                Classification: {reputation.threatCategory}
              </span>
            )}
          </div>
        </div>
      ) : isSuspicious ? (
        <div className="clay-banner-elevated p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
              ELEVATED RISK REGISTRY SIGNALS
            </span>
            <p className="text-xs text-amber-900 dark:text-amber-200 font-semibold leading-relaxed">
              {reputation?.summary}
            </p>
          </div>
        </div>
      ) : (
        <div className="clay-banner-low p-4 rounded-2xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
              CLEAN REPUTATION ACROSS ALL MONITORED FEEDS
            </span>
            <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed">
              {reputation?.summary || 'No active malware distribution, phishing hosts, or snowshoe spam blocks reported.'}
            </p>
          </div>
        </div>
      )}

      {/* Queried Public Blacklists Table / Cards Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-bold">
          <span>PUBLIC THREAT FEEDS & DATABASES ({blacklists.length})</span>
          <span>QUERY STATUS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {blacklists.map((b: BlacklistCheckItem, idx: number) => {
            const isListed = b.status === 'listed';
            const isFlagged = b.status === 'flagged';
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs transition-colors flex flex-col justify-between gap-2 ${
                  isListed
                    ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                    : isFlagged
                    ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                    : 'bg-white/80 dark:bg-slate-850/60 border-slate-200/70 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 block">
                      {b.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                      {b.authority}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md uppercase ${
                      isListed
                        ? 'bg-rose-600 text-white animate-pulse'
                        : isFlagged
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}>
                      {b.status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {b.queryTimeMs}ms
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                  {b.details || 'Check completed.'}
                </p>

                {b.referenceUrl && (
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    <span>Verified feed</span>
                    <a
                      href={b.referenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
                    >
                      <span>Public Registry</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
