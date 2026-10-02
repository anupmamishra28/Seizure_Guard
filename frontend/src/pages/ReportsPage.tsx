import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, AlertCircle, Calendar, User, Activity, Brain } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { BackendMissingNotice, EmptyState } from '../components/common/StateViews';
import { Link, useParams } from 'react-router-dom';

export function ReportsPage() {
  const { patientId: urlPatientId } = useParams<{ patientId: string }>();
  const [patientId, setPatientId] = useState(urlPatientId || '');
  const [generated, setGenerated] = useState(!!urlPatientId);

  useEffect(() => {
    if (urlPatientId) {
      setPatientId(urlPatientId);
      setGenerated(true);
    }
  }, [urlPatientId]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId.trim()) {
      setGenerated(true);
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'Reports' }]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Medical Reports</h1>
          <p className="page-subtitle">Generate and export comprehensive clinical reports for EEG predictions</p>
        </div>
      </div>

      <BackendMissingNotice 
        title="Backend Integration Note: Reports Endpoint Missing"
        description="The API does not currently have a dedicated /reports endpoint. This page demonstrates the proposed report generation UI. Data displayed is mock data for illustrative purposes only."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <h2 className="font-semibold text-[color:var(--text-main)] mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee' }}>
                <FileText className="w-4 h-4" />
              </div>
              Generate Report
            </h2>
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-muted)] mb-1.5">
                  Patient ID
                </label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="e.g. PAT-101"
                  className="form-input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-muted)] mb-1.5">
                  Report Type
                </label>
                <select
                  className="form-input w-full"
                  style={{ background: 'var(--glass-bg-base)', color: 'white' }}
                >
                  <option value="comprehensive" className="bg-[color:var(--bg-secondary)] text-[color:var(--text-main)]">Comprehensive Clinical Report</option>
                  <option value="summary" className="bg-[color:var(--bg-secondary)] text-[color:var(--text-main)]">Patient Summary</option>
                  <option value="eeg_only" className="bg-[color:var(--bg-secondary)] text-[color:var(--text-main)]">EEG Analysis Only</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn-primary w-full py-3 mt-2"
              >
                Generate Preview
              </button>
            </form>
          </div>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-2">
          {!generated ? (
            <div className="card h-full min-h-[400px] flex items-center justify-center">
              <EmptyState
                icon={<FileText className="w-8 h-8" />}
                title="No Report Generated"
                description="Enter a Patient ID and click Generate Preview to view the report mock."
              />
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden flex flex-col h-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              style={{ border: '1px solid var(--glass-border-strong)' }}
            >
              {/* Report Toolbar */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ background: 'var(--glass-bg-base)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--glass-border)' }}
              >
                <div className="font-medium text-sm text-[color:var(--text-muted)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Preview Mode (Mock Data)
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-[color:var(--text-muted)] hover:text-[color:var(--text-main)] hover:bg-white/5 rounded-lg transition-colors" title="Print Report">
                    <Printer className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-[color:var(--text-muted)] hover:text-[color:var(--text-main)] hover:bg-white/5 rounded-lg transition-colors" title="Download PDF">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Report Content - Light theme for document feel, but styled elegantly */}
              <div className="p-8 md:p-12 max-h-[800px] overflow-y-auto bg-slate-50 text-slate-900 flex-1">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-200 pb-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-600 text-[color:var(--text-main)] rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-black tracking-tight text-slate-900">SEIZUREGUARD</h1>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--text-muted)] mt-1">Clinical Analysis Report</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-[color:var(--text-muted)]">
                    <p className="font-medium">Date: {new Date().toLocaleDateString()}</p>
                    <p className="font-mono text-xs mt-1">REF: REP-{Math.floor(Math.random() * 10000)}</p>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-bold text-[color:var(--text-muted)] mb-3 border-b border-slate-200 pb-2">Patient Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold text-slate-700 w-24 inline-block">Patient ID:</span> <span className="font-mono">{patientId.toUpperCase()}</span></p>
                      <p><span className="font-semibold text-slate-700 w-24 inline-block">Name:</span> John Doe (Mock)</p>
                      <p><span className="font-semibold text-slate-700 w-24 inline-block">DOB:</span> 01/15/1980 (46y)</p>
                      <p><span className="font-semibold text-slate-700 w-24 inline-block">Gender:</span> Male</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-bold text-[color:var(--text-muted)] mb-3 border-b border-slate-200 pb-2">Analysis Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold text-slate-700 w-24 inline-block">Date:</span> {new Date().toLocaleDateString()}</p>
                      <p><span className="font-semibold text-slate-700 w-24 inline-block">Physician:</span> Dr. Smith</p>
                      <p><span className="font-semibold text-slate-700 w-24 inline-block">Model:</span> Random Forest Classifier</p>
                    </div>
                  </div>
                </div>

                {/* Main Result */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-10 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
                  <h2 className="text-2xl font-bold text-red-900 mb-3">High Risk (Seizure Detected)</h2>
                  <p className="text-red-700 text-sm mb-6 max-w-lg mx-auto leading-relaxed">
                    The machine learning model analyzed 24 extracted EEG features and indicates patterns consistent with seizure activity.
                  </p>
                  <div className="inline-flex items-center bg-white px-5 py-2.5 rounded-lg border border-red-200 shadow-sm">
                    <span className="text-xs font-bold text-[color:var(--text-muted)] uppercase tracking-wider mr-3">Confidence Score:</span>
                    <span className="text-xl font-bold text-red-600 font-mono">92.4%</span>
                  </div>
                </div>

                {/* Feature Summary */}
                <h3 className="text-xs uppercase tracking-widest font-bold text-[color:var(--text-muted)] mb-4 border-b border-slate-200 pb-2">Key EEG Feature Deviations</h3>
                <div className="grid grid-cols-2 gap-5 mb-10">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-800">Mean Amplitude (Fp1-F7)</span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded text-red-600">Elevated</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                      <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-800">Spectral Entropy (O1-O2)</span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-amber-600">Abnormal</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-12 pt-6 border-t border-slate-200 text-xs text-[color:var(--text-muted)] text-center leading-relaxed">
                  <p className="font-bold text-[color:var(--text-muted)] mb-1">CONFIDENTIAL MEDICAL REPORT</p>
                  <p className="max-w-xl mx-auto">
                    This report is generated by SeizureGuard AI. Results are derived from machine learning analysis of EEG data and are intended to assist clinical decision making, not replace professional medical diagnosis.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
