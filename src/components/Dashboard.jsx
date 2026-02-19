import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, Key, Search, Download, BarChart2, FileText, ScrollText,
  Settings, CheckCircle2, Circle, AlertTriangle, ExternalLink,
  X, ChevronRight, Maximize2, CheckCheck, Loader2, Radio,
  Activity, TrendingUp, Clock, Film
} from 'lucide-react';
import PhaseDetail from './PhaseDetail';
import { extractPhaseData } from '../utils/apiService';

const NGROK_BASE = 'https://defectless-wieldable-rhona.ngrok-free.dev';

const ngrokHeaders = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': '1',
};

const ngrokFetch = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: { ...ngrokHeaders, ...(options.headers || {}) },
  });
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(
      `Expected JSON but got HTML — ngrok may be blocking. Status: ${res.status}. Preview: ${text.slice(0, 100)}`
    );
  }
  return res;
};

const STAGE_TO_PHASE = {
  fetch_product: 0,
  keywords: 1,
  video_scrape: 2,
  download: 3,
  analysis: 4,
  report: 5,
  scripts: 6,
};

// ─── Content Modal ────────────────────────────────────────────────────────────
const ContentModal = ({ src, title, markdownContent, onClose }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Export content as PDF via browser print dialog
  const handleDownload = () => {
    if (!markdownContent) return;

    const convertToHtml = (md) => {
      return md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .split('\n')
        .map(line => {
          if (/^### (.+)/.test(line)) return '<h3>' + line.replace(/^### /, '') + '</h3>';
          if (/^## (.+)/.test(line))  return '<h2>' + line.replace(/^## /, '') + '</h2>';
          if (/^# (.+)/.test(line))   return '<h1>' + line.replace(/^# /, '') + '</h1>';
          if (/^---+$/.test(line))    return '<hr/>';
          if (line.trim() === '')     return '<br/>';
          return '<p>' + line + '</p>';
        })
        .join('\n');
    };

    const htmlBody = convertToHtml(markdownContent);
    const docTitle = title || 'Document';

    const css = [
      '* { box-sizing: border-box; margin: 0; padding: 0; }',
      'body { font-family: Georgia, serif; font-size: 13px; line-height: 1.8; color: #111; background: #fff; padding: 56px 64px; max-width: 820px; margin: 0 auto; }',
      'h1 { font-size: 22px; font-weight: 800; margin: 32px 0 10px; border-bottom: 2px solid #000; padding-bottom: 8px; }',
      'h2 { font-size: 17px; font-weight: 700; margin: 24px 0 8px; }',
      'h3 { font-size: 14px; font-weight: 700; margin: 18px 0 6px; }',
      'p  { margin: 6px 0; }',
      'hr { border: none; border-top: 1px solid #ccc; margin: 20px 0; }',
      '@media print { body { padding: 0; } @page { margin: 2cm; size: A4; } }',
    ].join('\n');

    const html = '<!DOCTYPE html><html><head><title>' + docTitle + '</title><style>' + css + '</style></head><body>' + htmlBody + '</body></html>';

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  const btnBase = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 14px',
    fontSize: 12, fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Mono', monospace",
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 3,
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.6)',
    transition: 'all 0.2s',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col"
        style={{ background: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.12)', background: '#0a0a0a' }}>
          <h2 className="text-white font-bold text-lg tracking-tight truncate">{title || 'Preview'}</h2>
          <div className="flex items-center gap-3">
            {/* Download button — for markdown content */}
            {markdownContent && (
              <button
                onClick={handleDownload}
                style={btnBase}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = btnBase.background; e.currentTarget.style.borderColor = btnBase.border.replace('1px solid ',''); e.currentTarget.style.color = btnBase.color; }}
              >
                <Download size={13} /> Download PDF
              </button>
            )}
            {/* Open in new tab — for iframe src */}
            {src && (
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                style={btnBase}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = btnBase.background; e.currentTarget.style.color = btnBase.color; }}
              >
                Open in tab <ExternalLink size={13} />
              </a>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#999', border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#999'; }}
            >
              <X size={15} />
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-auto" style={{ background: '#050505' }}>
          {src ? (
            <iframe src={src} title={title} className="w-full h-full border-0" />
          ) : markdownContent ? (
            <div className="max-w-4xl mx-auto p-10">
              <pre className="whitespace-pre-wrap text-sm leading-7 font-mono"
                style={{ color: 'rgba(255,255,255,0.75)' }}>
                {markdownContent}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-sm" style={{ color: '#555' }}>
              No content available.
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [productUrl, setProductUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [error, setError] = useState('');
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [nextPollIn, setNextPollIn] = useState(null);
  const [modal, setModal] = useState(null);

  const pollingRef = useRef(null);
  const timerRef = useRef(null);

  const phases = [
    { id: 1, name: 'Fetch Product', description: 'Validate',  Icon: Link2      },
    { id: 2, name: 'Keywords',      description: 'Generate',  Icon: Key        },
    { id: 3, name: 'Scraping',      description: 'Collect',   Icon: Search     },
    { id: 4, name: 'Download',      description: 'Download',  Icon: Download   },
    { id: 5, name: 'Analysis',      description: 'Analyze',   Icon: BarChart2  },
    { id: 6, name: 'Report',        description: 'Generate',  Icon: FileText   },
    { id: 7, name: 'Scripts',       description: 'Create',    Icon: ScrollText },
  ];

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearTimeout(pollingRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const validateUrl = (url) => {
    try { new URL(url); return true; } catch { return false; }
  };

  const startElapsedTimer = () => {
    setElapsedSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
  };

  const stopElapsedTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const pollPipelineStatus = (pipelineId) => {
    return new Promise((resolve, reject) => {
      const BASE = 5000;
      const STEP = 5000;
      const CAP = 60000;
      const MAX_WAIT = 30 * 60 * 1000;
      const startTime = Date.now();
      let pollCount = 0;

      const poll = async () => {
        try {
          if (Date.now() - startTime > MAX_WAIT) {
            reject(new Error('Pipeline timed out after 30 minutes'));
            return;
          }

          const res = await ngrokFetch(
            `${NGROK_BASE}/api/pipeline/status/${pipelineId}/`,
            { method: 'GET' }
          );

          if (!res.ok) {
            reject(new Error(`Status check failed: ${res.status} ${res.statusText}`));
            return;
          }

          const data = await res.json();
          const nextDelay = Math.min(BASE + pollCount * STEP, CAP);
          pollCount = 0; // reset after each response so next wait starts at 5s

          console.log(`Poll — status: ${data.status} | stage: ${data.current_stage} | next in: ${nextDelay / 1000}s`);

          if (data.metadata?.completed_stages) {
            setCurrentPhase(Math.min(data.metadata.completed_stages.length, phases.length - 1));
          } else if (data.current_stage && STAGE_TO_PHASE[data.current_stage] !== undefined) {
            setCurrentPhase(STAGE_TO_PHASE[data.current_stage]);
          }

          if (data.status === 'completed') {
            setNextPollIn(null);
            resolve(data);
          } else if (data.status === 'failed') {
            setNextPollIn(null);
            reject(new Error(data.error_message || 'Pipeline failed'));
          } else {
            setNextPollIn(nextDelay / 1000);
            pollingRef.current = setTimeout(poll, nextDelay);
          }
        } catch (err) {
          setNextPollIn(null);
          reject(err);
        }
      };

      poll();
    });
  };

  const handleStartProcess = async (url) => {
    setError('');
    if (!url.trim()) { setError('Please enter a URL'); return; }
    if (!validateUrl(url)) { setError('Invalid URL format'); return; }

    if (pollingRef.current) clearTimeout(pollingRef.current);
    setProductUrl(url);
    setIsProcessing(true);
    setCurrentPhase(0);
    setSelectedPhase(null);
    setApiData(null);
    setNextPollIn(null);
    setModal(null);
    startElapsedTimer();

    try {
      const startRes = await ngrokFetch(`${NGROK_BASE}/api/pipeline/start/`, {
        method: 'POST',
        body: JSON.stringify({ product_url: url, skip_apify: false }),
      });

      if (!startRes.ok) throw new Error(`Start failed: ${startRes.status} ${startRes.statusText}`);

      const startData = await startRes.json();
      const pipelineId = startData.id;
      if (!pipelineId) throw new Error('No pipeline ID returned from server');

      const finalData = await pollPipelineStatus(pipelineId);
      setApiData(finalData);
      setCurrentPhase(phases.length);
    } catch (err) {
      setError('Pipeline error: ' + err.message);
    } finally {
      setIsProcessing(false);
      stopElapsedTimer();
      setNextPollIn(null);
    }
  };

  const handleReset = () => {
    if (pollingRef.current) clearTimeout(pollingRef.current);
    stopElapsedTimer();
    setProductUrl('');
    setIsProcessing(false);
    setCurrentPhase(0);
    setError('');
    setSelectedPhase(null);
    setApiData(null);
    setElapsedSeconds(0);
    setNextPollIn(null);
    setModal(null);
  };

  const getPhaseStatus = (idx) => {
    if (!isProcessing && currentPhase === phases.length) return 'completed';
    if (idx < currentPhase) return 'completed';
    if (idx === currentPhase && isProcessing) return 'active';
    return 'pending';
  };

  const completionPercentage = !productUrl
    ? 0
    : Math.round((currentPhase / phases.length) * 100);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
  };

  const safePhaseIdx = Math.min(
    selectedPhase !== null ? selectedPhase : currentPhase,
    phases.length - 1
  );

  // Inline style tokens — strict black/white palette
  const tok = {
    bg:          '#080808',
    surface:     '#0f0f0f',
    surfaceHigh: '#161616',
    border:      'rgba(255,255,255,0.08)',
    borderHover: 'rgba(255,255,255,0.2)',
    white:       '#ffffff',
    dim1:        'rgba(255,255,255,0.7)',
    dim2:        'rgba(255,255,255,0.4)',
    dim3:        'rgba(255,255,255,0.18)',
    active:      'rgba(255,255,255,0.12)',
    glow:        '0 0 24px rgba(255,255,255,0.12)',
    glowStrong:  '0 0 32px rgba(255,255,255,0.22)',
  };

  return (
    <>
      {modal && <ContentModal {...modal} onClose={() => setModal(null)} />}

      <div style={{ minHeight: '100vh', background: tok.bg, color: tok.white, fontFamily: "'DM Mono', 'Fira Mono', monospace" }}>

        {/* Subtle grid texture overlay */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `linear-gradient(${tok.border} 1px, transparent 1px), linear-gradient(90deg, ${tok.border} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />

        {/* Radial vignette */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

          {/* ── Header ── */}
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              padding: '28px 40px',
              borderBottom: `1px solid ${tok.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <Activity size={18} style={{ color: tok.dim2 }} />
                <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: tok.dim2, fontWeight: 600 }}>
                  Intelligence Pipeline
                </span>
              </div>
              <h1 style={{
                fontSize: 'clamp(22px, 3vw, 36px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: tok.white,
                fontFamily: "'DM Mono', monospace",
                margin: 0,
              }}>
                Product Intelligence
              </h1>
            </div>
            {/* Live indicator */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px',
                  border: `1px solid ${tok.border}`,
                  borderRadius: 4,
                  background: tok.surfaceHigh,
                }}
              >
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                  animation: 'pulse 1.2s ease-in-out infinite',
                  display: 'inline-block',
                }} />
                <span style={{ fontSize: 11, letterSpacing: '0.12em', color: tok.dim1, textTransform: 'uppercase' }}>Live</span>
              </motion.div>
            )}
          </motion.header>

          <main style={{ flex: 1, padding: '40px', maxWidth: 1400, width: '100%', margin: '0 auto' }}>

            {/* ── URL Input ── */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ marginBottom: 56 }}
            >
              <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: tok.dim2, marginBottom: 12, fontWeight: 600 }}>
                Product URL
              </label>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <input
                  id="url-input"
                  type="text"
                  value={productUrl}
                  onChange={(e) => { setProductUrl(e.target.value); setError(''); }}
                  disabled={isProcessing}
                  placeholder="https://amazon.com/dp/..."
                  onKeyPress={(e) => { if (e.key === 'Enter' && !isProcessing) handleStartProcess(e.target.value); }}
                  style={{
                    flex: 1, minWidth: 280,
                    padding: '14px 18px',
                    background: tok.surface,
                    border: `1px solid ${tok.border}`,
                    borderRadius: 4,
                    color: tok.white,
                    fontSize: 14,
                    fontFamily: "'DM Mono', monospace",
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.35)'}
                  onBlur={e => e.target.style.borderColor = tok.border}
                />
                <motion.button
                  onClick={() => handleStartProcess(document.getElementById('url-input').value)}
                  disabled={isProcessing}
                  whileHover={!isProcessing ? { scale: 1.02 } : {}}
                  whileTap={!isProcessing ? { scale: 0.98 } : {}}
                  style={{
                    padding: '14px 28px',
                    background: isProcessing ? tok.surfaceHigh : tok.white,
                    color: isProcessing ? tok.dim2 : '#000',
                    border: `1px solid ${isProcessing ? tok.border : tok.white}`,
                    borderRadius: 4,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: '0.08em',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: "'DM Mono', monospace",
                    transition: 'all 0.2s',
                    boxShadow: isProcessing ? 'none' : tok.glow,
                  }}
                >
                  {isProcessing
                    ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Processing</>
                    : <><ChevronRight size={15} /> Analyze</>
                  }
                </motion.button>
                {productUrl && (
                  <motion.button
                    onClick={handleReset}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '14px 20px',
                      background: 'transparent',
                      color: tok.dim2,
                      border: `1px solid ${tok.border}`,
                      borderRadius: 4,
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8,
                      fontFamily: "'DM Mono', monospace",
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = tok.borderHover; e.currentTarget.style.color = tok.white; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = tok.border; e.currentTarget.style.color = tok.dim2; }}
                  >
                    <X size={14} /> Reset
                  </motion.button>
                )}
              </div>

              {/* Status messages */}
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#999' }}>
                    <AlertTriangle size={14} style={{ color: '#666' }} /> {error}
                  </motion.div>
                )}
                {isProcessing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: tok.dim2 }}>
                    <Radio size={13} style={{ color: tok.dim3 }} />
                    <span>Polling pipeline</span>
                    {nextPollIn !== null && (
                      <span style={{ color: tok.dim1 }}>— next in <strong style={{ color: tok.white }}>{nextPollIn}s</strong></span>
                    )}
                  </motion.div>
                )}
                {!isProcessing && apiData?.status === 'completed' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontSize: 13 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: tok.dim1 }}>
                      <CheckCheck size={15} style={{ color: tok.white }} /> Completed
                    </span>
                    {apiData?.report && (
                      <button
                        onClick={() => setModal({ title: 'Research Report', markdownContent: apiData.report })}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '6px 14px',
                          background: tok.surfaceHigh,
                          color: tok.dim1,
                          border: `1px solid ${tok.border}`,
                          borderRadius: 3,
                          fontSize: 12, fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: "'DM Mono', monospace",
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = tok.active; e.currentTarget.style.borderColor = tok.borderHover; e.currentTarget.style.color = tok.white; }}
                        onMouseLeave={e => { e.currentTarget.style.background = tok.surfaceHigh; e.currentTarget.style.borderColor = tok.border; e.currentTarget.style.color = tok.dim1; }}
                      >
                        <FileText size={13} /> View Report
                      </button>
                    )}
                    {apiData?.scripts && (
                      <button
                        onClick={() => setModal({ title: 'Generated Scripts', markdownContent: apiData.scripts })}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '6px 14px',
                          background: tok.surfaceHigh,
                          color: tok.dim1,
                          border: `1px solid ${tok.border}`,
                          borderRadius: 3,
                          fontSize: 12, fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: "'DM Mono', monospace",
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = tok.active; e.currentTarget.style.borderColor = tok.borderHover; e.currentTarget.style.color = tok.white; }}
                        onMouseLeave={e => { e.currentTarget.style.background = tok.surfaceHigh; e.currentTarget.style.borderColor = tok.border; e.currentTarget.style.color = tok.dim1; }}
                      >
                        <ScrollText size={13} /> View Scripts
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.section>

            {/* ── Progress Bar ── */}
            {productUrl && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                style={{ marginBottom: 48 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: tok.dim2, fontWeight: 600 }}>
                    Pipeline Progress
                  </span>
                  <motion.span
                    style={{ fontSize: 28, fontWeight: 900, color: tok.white, letterSpacing: '-0.04em' }}
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: isProcessing ? Infinity : 0 }}
                  >
                    {completionPercentage}%
                  </motion.span>
                </div>
                {/* Track */}
                <div style={{ position: 'relative', height: 2, background: tok.border, borderRadius: 1 }}>
                  <motion.div
                    style={{
                      position: 'absolute', top: 0, left: 0, height: '100%',
                      background: tok.white,
                      borderRadius: 1,
                      boxShadow: '0 0 12px rgba(255,255,255,0.5)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  />
                </div>
                {/* Stage tick marks */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  {phases.map((_, idx) => (
                    <div key={idx} style={{
                      width: 1, height: 6,
                      background: idx < currentPhase ? tok.white : tok.border,
                      transition: 'background 0.4s',
                    }} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* ── Phase Cards ── */}
            {productUrl && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ marginBottom: 48 }}
              >
                <span style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: tok.dim2, fontWeight: 600, marginBottom: 20 }}>
                  Processing Phases
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
                  {phases.map((phase, idx) => {
                    const status = getPhaseStatus(idx);
                    const isActive = status === 'active';
                    const isCompleted = status === 'completed';
                    const isPending = status === 'pending';
                    const isSelected = selectedPhase === idx;
                    const isClickable = isCompleted || isActive;
                    const { Icon } = phase;

                    const cardBg = isSelected
                      ? 'rgba(255,255,255,0.1)'
                      : isCompleted
                      ? 'rgba(255,255,255,0.05)'
                      : isActive
                      ? 'rgba(255,255,255,0.07)'
                      : tok.surface;

                    const cardBorder = isSelected
                      ? 'rgba(255,255,255,0.5)'
                      : isCompleted
                      ? 'rgba(255,255,255,0.25)'
                      : isActive
                      ? 'rgba(255,255,255,0.35)'
                      : tok.border;

                    const cardColor = isPending ? tok.dim3 : tok.dim1;

                    return (
                      <motion.div
                        key={phase.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: isPending ? 0.4 : 1, y: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        onClick={() => isClickable && setSelectedPhase(isSelected ? null : idx)}
                        style={{
                          padding: '20px 14px',
                          background: cardBg,
                          border: `1px solid ${cardBorder}`,
                          borderRadius: 6,
                          textAlign: 'center',
                          cursor: isClickable ? 'pointer' : 'default',
                          transition: 'all 0.25s',
                          boxShadow: isActive ? tok.glowStrong : isSelected ? tok.glow : 'none',
                        }}
                        onMouseEnter={e => {
                          if (isClickable && !isSelected) {
                            e.currentTarget.style.borderColor = tok.borderHover;
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (isClickable && !isSelected) {
                            e.currentTarget.style.borderColor = cardBorder;
                            e.currentTarget.style.background = cardBg;
                          }
                        }}
                      >
                        {/* Icon */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, color: cardColor }}>
                          {isActive
                            ? <Settings size={22} style={{ animation: 'spin 2s linear infinite', color: tok.white }} />
                            : <Icon size={22} style={{ color: isCompleted ? tok.white : cardColor }} />
                          }
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: isCompleted || isActive ? tok.white : tok.dim3, letterSpacing: '0.04em', marginBottom: 4 }}>
                          {phase.name}
                        </div>
                        <div style={{ fontSize: 10, color: tok.dim3, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
                          {phase.description}
                        </div>
                        {/* Status */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: isCompleted ? tok.dim1 : isActive ? tok.white : tok.dim3 }}>
                          {isCompleted
                            ? <><CheckCircle2 size={11} /> Done</>
                            : isActive
                            ? <><Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> Active</>
                            : <><Circle size={11} /> Waiting</>
                          }
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Phase detail panel */}
                {(isProcessing || selectedPhase !== null) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                      marginTop: 16,
                      padding: '28px 32px',
                      background: tok.surface,
                      border: `1px solid ${tok.border}`,
                      borderRadius: 6,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <BarChart2 size={18} style={{ color: tok.dim2 }} />
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: tok.white, letterSpacing: '-0.01em' }}>
                            {phases[safePhaseIdx].name}
                          </div>
                          <div style={{ fontSize: 11, color: tok.dim2, marginTop: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            {phases[safePhaseIdx].description}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {apiData?.report_popular && selectedPhase === 5 && (
                          <button
                            onClick={() => setModal({ title: 'Research Report', markdownContent: apiData.report_populars })}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '7px 14px',
                              background: 'transparent',
                              color: tok.dim1,
                              border: `1px solid ${tok.border}`,
                              borderRadius: 3,
                              fontSize: 12, fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: "'DM Mono', monospace",
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = tok.active; e.currentTarget.style.borderColor = tok.borderHover; e.currentTarget.style.color = tok.white; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = tok.border; e.currentTarget.style.color = tok.dim1; }}
                          >
                            <Maximize2 size={13} /> Full View
                          </button>
                        )}
                        {apiData?.report_all_videos && selectedPhase === 5 && (
                          <button
                            onClick={() => setModal({ title: 'Generated Scripts', markdownContent: apiData.report_all_videos })}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '7px 14px',
                              background: 'transparent',
                              color: tok.dim1,
                              border: `1px solid ${tok.border}`,
                              borderRadius: 3,
                              fontSize: 12, fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: "'DM Mono', monospace",
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = tok.active; e.currentTarget.style.borderColor = tok.borderHover; e.currentTarget.style.color = tok.white; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = tok.border; e.currentTarget.style.color = tok.dim1; }}
                          >
                            <Maximize2 size={13} />  View All Videos Report
                          </button>
                        )}
                            {apiData?.scripts && selectedPhase === 6 && (
                          <button
                            onClick={() => setModal({ title: 'Generated Scripts', markdownContent: apiData.scripts })}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '7px 14px',
                              background: 'transparent',
                              color: tok.dim1,
                              border: `1px solid ${tok.border}`,
                              borderRadius: 3,
                              fontSize: 12, fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: "'DM Mono', monospace",
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = tok.active; e.currentTarget.style.borderColor = tok.borderHover; e.currentTarget.style.color = tok.white; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = tok.border; e.currentTarget.style.color = tok.dim1; }}
                          >
                            <Maximize2 size={13} /> View Scripts
                          </button>
                        )}
                        {selectedPhase !== null && (
                          <button
                            onClick={() => setSelectedPhase(null)}
                            style={{
                              width: 30, height: 30,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: 'transparent',
                              color: tok.dim2,
                              border: `1px solid ${tok.border}`,
                              borderRadius: 3,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = tok.borderHover; e.currentTarget.style.color = tok.white; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = tok.border; e.currentTarget.style.color = tok.dim2; }}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: tok.border, marginBottom: 20 }} />

                    <PhaseDetail
                      phase={phases[safePhaseIdx]}
                      productUrl={productUrl}
                      apiData={apiData}
                      phaseData={apiData ? extractPhaseData(apiData, safePhaseIdx + 1) : null}
                      onOpenModal={setModal}
                    />
                  </motion.div>
                )}
              </motion.section>
            )}

            {/* ── Stats ── */}
            {productUrl && (isProcessing || apiData) && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <span style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: tok.dim2, fontWeight: 600, marginBottom: 16 }}>
                  {isProcessing ? 'Live Statistics' : 'Pipeline Summary'}
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                  {[
                    {
                      label: 'Phase',
                      value: `${Math.min(currentPhase + 1, phases.length)} / ${phases.length}`,
                      Icon: TrendingUp,
                    },
                    {
                      label: 'Progress',
                      value: `${completionPercentage}%`,
                      Icon: Activity,
                    },
                    {
                      label: 'Elapsed',
                      value: formatTime(elapsedSeconds),
                      Icon: Clock,
                    },
                    {
                      label: isProcessing ? 'Next Poll' : 'Videos',
                      value: isProcessing
                        ? nextPollIn !== null ? `${nextPollIn}s` : '...'
                        : apiData?.metadata?.summary?.video_counts
                          ? Object.values(apiData.metadata.summary.video_counts).reduce((a, b) => a + b, 0)
                          : '—',
                      Icon: Film,
                    },
                  ].map(({ label, value, Icon: StatIcon }) => (
                    <div key={label} style={{
                      padding: '20px 22px',
                      background: tok.surface,
                      border: `1px solid ${tok.border}`,
                      borderRadius: 6,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                        <StatIcon size={13} style={{ color: tok.dim3 }} />
                        <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: tok.dim2, fontWeight: 600 }}>
                          {label}
                        </span>
                      </div>
                      <div style={{ fontSize: 26, fontWeight: 900, color: tok.white, letterSpacing: '-0.03em', fontFamily: "'DM Mono', monospace" }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

          </main>
        </div>

        {/* CSS keyframes injected globally */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
          * { box-sizing: border-box; }
          ::placeholder { color: rgba(255,255,255,0.2) !important; }
          ::-webkit-scrollbar { width: 6px; background: #0a0a0a; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        `}</style>
      </div>
    </>
  );
};

export default Dashboard;