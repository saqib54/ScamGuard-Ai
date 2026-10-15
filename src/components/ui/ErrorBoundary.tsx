import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ScamShield ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#EAF0F8] text-slate-900 flex items-center justify-center p-4 font-sans">
          <div className="clay-card p-6 sm:p-10 max-w-md w-full text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Application Recovered</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              A temporary interface issue was prevented from interrupting your security session.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="clay-button-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload App</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
