import React, { useEffect, useState } from 'react';
import { Search, Filter, Trash2, Download, ChevronLeft, ChevronRight, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../ui/Toast.tsx';
import { ClayStamp } from '../ui/ClaySticker.tsx';

interface HistoryItem {
  id: string;
  inputType: string;
  detectedLanguage: string;
  contentSnippet: string;
  riskScore: number;
  riskLevel: 'low' | 'elevated' | 'high' | 'critical';
  indicatorsCount: number;
  tactics: string[];
  engineType: string;
  createdAt: string;
}

interface HistoryViewProps {
  onSelectAnalysis: (id: string) => void;
  onStartScan: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectAnalysis, onStartScan }) => {
  const { t } = useLanguage();
  const { getAuthHeaders } = useAuth();
  const { showToast } = useToast();

  const [records, setRecords] = useState<HistoryItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const fetchRecords = async (pageNum = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
        ...(riskFilter !== 'all' ? { risk_level: riskFilter } : {}),
        ...(typeFilter !== 'all' ? { input_type: typeFilter } : {}),
        ...(search.trim() ? { search: search.trim() } : {}),
      });

      const res = await fetch(`/api/v1/analyses?${params.toString()}`, {
        headers: getAuthHeaders()
      });

      if (res.ok) {
        const data = await res.json();
        setRecords(data.records);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages || 1);
        setPage(data.pagination.page);
      }
    } catch {
      showToast('Failed to load history records.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(1);
  }, [riskFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords(1);
  };

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/v1/analyses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Analysis record deleted.', 'success');
        fetchRecords(page);
      } else {
        throw new Error();
      }
    } catch {
      showToast('Could not delete record.', 'error');
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await fetch('/api/v1/analyses', {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('All analysis records permanently deleted.', 'success');
        setShowClearConfirm(false);
        fetchRecords(1);
      }
    } catch {
      showToast('Failed to purge records.', 'error');
    }
  };

  const handleExportCsv = () => {
    if (records.length === 0) return;
    const headers = ['ID', 'Date', 'Type', 'Language', 'Risk Score', 'Risk Level', 'Snippet'];
    const rows = records.map(r => [
      r.id,
      new Date(r.createdAt).toISOString(),
      r.inputType,
      r.detectedLanguage,
      r.riskScore,
      r.riskLevel,
      `"${r.contentSnippet.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scamshield-history-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported history as CSV.', 'info');
  };

  return (
    <div className="clay-card p-6 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            {t('historyTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {t('historySubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={records.length === 0}
            className="clay-button-secondary flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('exportHistoryCsv')}</span>
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={total === 0}
            className="clay-button-rose flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('btnClearAllHistory')}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar with Clay Inset */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <form onSubmit={handleSearchSubmit} className="sm:col-span-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-9 pr-3 py-2 text-xs clay-inset text-slate-900 font-medium focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none shadow-2xs"
          >
            <option value="all">{t('filterAllRisks')}</option>
            <option value="critical">Critical Threats</option>
            <option value="high">High Risk</option>
            <option value="elevated">Elevated Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none shadow-2xs"
          >
            <option value="all">{t('filterAllTypes')}</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="url">URL</option>
            <option value="screenshot">📷 Screenshot (OCR)</option>
          </select>
        </div>
      </div>

      {/* Table / List */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-800" />
          <span>Retrieving verified records...</span>
        </div>
      ) : records.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <p className="text-xs text-slate-500">No matching analysis records found.</p>
          <button
            onClick={onStartScan}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
          >
            Scan a message
          </button>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
          {records.map(record => (
            <div
              key={record.id}
              onClick={() => onSelectAnalysis(record.id)}
              className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 cursor-pointer transition-colors"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                    {record.inputType}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500 capitalize">
                    {record.detectedLanguage}
                  </span>
                  {record.indicatorsCount > 0 && (
                    <span className="text-[11px] text-amber-700 font-medium">
                      · {record.indicatorsCount} warnings
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-800 truncate font-mono max-w-xl">
                  {record.contentSnippet}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <ClayStamp
                  text={
                    record.riskLevel === 'critical' || record.riskLevel === 'high'
                      ? 'MALICIOUS'
                      : record.riskLevel === 'elevated'
                      ? 'SUSPICIOUS'
                      : 'SAFE'
                  }
                  variant={
                    record.riskLevel === 'critical' || record.riskLevel === 'high'
                      ? 'danger'
                      : record.riskLevel === 'elevated'
                      ? 'warning'
                      : 'success'
                  }
                  rotation={-2}
                  className="hidden sm:inline-flex text-[9px] py-0.5 px-2"
                />

                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    record.riskLevel === 'critical' || record.riskLevel === 'high'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : record.riskLevel === 'elevated'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {record.riskScore}/100
                </span>

                <button
                  onClick={(e) => handleDeleteItem(record.id, e)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                  title="Delete record"
                  aria-label="Delete this analysis record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
          <span>
            Showing page {page} of {totalPages} ({total} total analyses)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => fetchRecords(page - 1)}
              disabled={page <= 1}
              className="p-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => fetchRecords(page + 1)}
              disabled={page >= totalPages}
              className="p-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Permanent Clear All Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-neutral-200">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-slate-900">
                {t('confirmClearAllTitle')}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('confirmClearAllText')}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-medium"
              >
                {t('btnCancel')}
              </button>
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-md shadow-xs"
              >
                {t('btnConfirmDelete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
