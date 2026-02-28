import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, Key, Search, Download, BarChart2, FileText, ScrollText,
  Settings, CheckCircle2, Circle, AlertTriangle, ExternalLink,
  X, ChevronRight, Maximize2, CheckCheck, Loader2, Radio,
  Activity, TrendingUp, Clock, Film, Eye, ThumbsUp, MessageSquare,
  Hash, Youtube, Globe, Users, Tag, Lightbulb, Quote, Shield,
  HelpCircle, GitCompare, Zap, User, ChevronDown, ChevronUp,
  Play, FileSearch, Package
} from 'lucide-react';


// remove this and use the actual API base URL from the .env file
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


// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => {
  if (n == null) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
};

const Pill = ({ children, style }) => (
  <span style={{
    display: 'inline-block',
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.06em',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 3,
    color: 'rgba(255,255,255,0.55)',
    background: 'rgba(255,255,255,0.04)',
    fontFamily: "'DM Mono', monospace",
    ...style,
  }}>{children}</span>
);

const StatChip = ({ icon: Icon, label, value }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 4,
  }}>
    <Icon size={13} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
    <div>
      <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', fontFamily: "'DM Mono', monospace", letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  </div>
);

const Collapsible = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, overflow: 'hidden', marginBottom: 10 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px 16px', background: 'rgba(255,255,255,0.03)',
          border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
          fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700,
          letterSpacing: '0.04em', textAlign: 'left',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icon && <Icon size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />}
          {title}
        </span>
        {open ? <ChevronUp size={13} style={{ color: 'rgba(255,255,255,0.3)' }} /> : <ChevronDown size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />}
      </button>
      {open && (
        <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// Extract YouTube video ID from any YT URL
const getYouTubeId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
};

// Parse the 7-section analysis format from Gemini
const parseAnalysis = (text) => {
  if (!text) return {};
  const clean = text.replace(/```markdown\n?/g, '').replace(/```\n?/g, '').replace(/\*\*/g, '');
  const sections = {};
  const labels = [
    { key: 'hook',    n: '1', title: 'Hook (first 3-5 seconds)' },
    { key: 'message', n: '2', title: 'Main message/angle' },
    { key: 'cta',     n: '3', title: 'CTA' },
    { key: 'format',  n: '4', title: 'Format' },
    { key: 'drivers', n: '5', title: 'Engagement drivers' },
    { key: 'script',  n: '6', title: 'Script/structure summary' },
    { key: 'why',     n: '7', title: 'Why it works' },
  ];
  labels.forEach(({ key, n }, i) => {
    const next = i < labels.length - 1 ? labels[i + 1].n : '99';
    const re = new RegExp(n + '\\. [\\s\\S]*?:([\\s\\S]*?)(?=(?:' + next + '\\.))', 'i');
    const m = clean.match(re);
    if (m) sections[key] = m[1].trim().replace(/^\* /gm, '• ').replace(/^\*\* /gm, '• ');
  });
  // grab section 7 separately (no next section)
  if (!sections.why) {
    const m7 = clean.match(/7\. [\s\S]*?:([\s\S]*?)(?=Let me know|$)/i);
    if (m7) sections.why = m7[1].trim().replace(/^\* /gm, '• ');
  }
  sections.raw = clean;
  return sections;
};

const AnalysisBlock = ({ label, content, icon: Icon, accent }) => {
  if (!content) return null;
  const colors = {
    hook:    'rgba(255,255,255,0.7)',
    message: 'rgba(255,255,255,0.5)',
    cta:     'rgba(255,255,255,0.6)',
    format:  'rgba(255,255,255,0.4)',
    drivers: 'rgba(255,255,255,0.55)',
    script:  'rgba(255,255,255,0.45)',
    why:     'rgba(255,255,255,0.65)',
  };
  const borderColor = colors[accent] || 'rgba(255,255,255,0.2)';
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        {Icon && <Icon size={12} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />}
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
          {label}
        </span>
      </div>
      <div style={{
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: '2px solid ' + borderColor,
        borderRadius: '0 4px 4px 0',
        fontSize: 12, color: 'rgba(255,255,255,0.6)',
        lineHeight: 1.75, whiteSpace: 'pre-wrap',
        fontFamily: "'DM Mono', monospace",
      }}>{content}</div>
    </div>
  );
};

const VideoCard = ({ video, analysis, tok, onOpenModal }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);

  const engRate = video.views > 0
    ? (((video.likes || 0) + (video.comments_count || 0)) / video.views * 100).toFixed(2)
    : '0.00';

  const ytId = getYouTubeId(video.source_url);
  const parsed = React.useMemo(() => parseAnalysis(analysis), [analysis]);

  const cleanTranscript = video.transcript
    ? video.transcript.replace(/Kind: captions[\s\S]*?Language: en\s*/g, '').replace(/\n{3,}/g, '\n').trim()
    : null;

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, overflow: 'hidden', marginBottom: 10, background: 'rgba(255,255,255,0.015)' }}>

      {/* ── Row header ── */}
      <div
        onClick={() => { setExpanded(e => !e); if (expanded) setPlaying(false); }}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ width: 34, height: 34, borderRadius: 4, flexShrink: 0, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Youtube size={15} style={{ color: 'rgba(255,255,255,0.6)' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3 }}>
            {video.title || 'Untitled'}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <Pill>{video.platform}</Pill>
            {video.author && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>{video.author}</span>}
            {video.duration_sec && <Pill>{Math.floor(video.duration_sec / 60)}:{String(Math.floor(video.duration_sec % 60)).padStart(2, '0')}</Pill>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexShrink: 0 }}>
          {[{ I: Eye, v: fmt(video.views) }, { I: ThumbsUp, v: fmt(video.likes) }, { I: MessageSquare, v: fmt(video.comments_count) }].map(({ I, v }) => (
            <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Mono', monospace" }}>
              <I size={11} /><span>{v}</span>
            </div>
          ))}
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontFamily: "'DM Mono', monospace" }}>{engRate}% eng</span>
          <a href={video.source_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            style={{ color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
            <ExternalLink size={13} />
          </a>
          {expanded
            ? <ChevronUp size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
            : <ChevronDown size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />}
        </div>
      </div>

      {/* ── Expanded body ── */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.35)' }}>

          {/* Top: video player + transcript side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: ytId ? '1fr 1fr' : '1fr', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

            {/* YouTube player */}
            {ytId && (
              <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                {!playing ? (
                  <div onClick={() => setPlaying(true)} style={{ position: 'relative', paddingBottom: '56.25%', cursor: 'pointer', background: '#000', overflow: 'hidden' }}>
                    <img
                      src={'https://img.youtube.com/vi/' + ytId + '/hqdefault.jpg'}
                      alt="thumbnail"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
                    />
                    {/* Dark gradient */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
                    {/* Play button */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 32px rgba(255,255,255,0.35)', transition: 'transform 0.18s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <Play size={22} style={{ color: '#000', marginLeft: 3 }} />
                      </div>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>Play on YouTube</span>
                    </div>
                    {/* Title overlay bottom */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px' }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: "'DM Mono', monospace" }}>{video.title}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
                    <iframe
                      src={'https://www.youtube.com/embed/' + ytId + '?autoplay=1&rel=0&modestbranding=1'}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {/* Meta pills below player */}
                <div style={{ padding: '8px 12px', display: 'flex', gap: 6, flexWrap: 'wrap', background: 'rgba(0,0,0,0.3)' }}>
                  {video.published_at && <Pill>{new Date(video.published_at).toLocaleDateString()}</Pill>}
                  {video.file_size_bytes && <Pill>{(video.file_size_bytes / 1024 / 1024).toFixed(1)} MB</Pill>}
                  {video.views > 0 && <Pill>{fmt(video.views)} views</Pill>}
                </div>
              </div>
            )}

            {/* Transcript panel */}
            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', maxHeight: 340, overflow: 'hidden' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                Transcript
              </div>
              {cleanTranscript ? (
                <pre style={{
                  fontSize: 11, lineHeight: 1.85, color: 'rgba(255,255,255,0.5)',
                  fontFamily: "'DM Mono', monospace", whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  overflowY: 'auto', flex: 1, margin: 0,
                }}>
                  {cleanTranscript}
                </pre>
              ) : (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', marginTop: 8 }}>No transcript available.</div>
              )}
            </div>
          </div>

          {/* ── AI Analysis breakdown ── */}
          {analysis && (
            <div style={{ padding: '20px 20px 8px' }}>
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart2 size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
                    AI Analysis Breakdown
                  </span>
                </div>
                <button
                  onClick={() => onOpenModal({ title: 'Full Analysis — ' + (video.title || ''), markdownContent: analysis })}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, cursor: 'pointer', padding: '5px 11px', fontFamily: "'DM Mono', monospace", transition: 'all 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                >
                  <Maximize2 size={11} /> Full Report
                </button>
              </div>

              {/* 2-col grid for the 7 sections */}
              {(parsed.hook || parsed.message || parsed.cta || parsed.format || parsed.drivers || parsed.script || parsed.why) ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0 32px' }}>
                  <div>
                    <AnalysisBlock label="1 — Hook (first 3-5 sec)" content={parsed.hook} icon={Zap} accent="hook" />
                    <AnalysisBlock label="2 — Main Message / Angle" content={parsed.message} icon={Tag} accent="message" />
                    <AnalysisBlock label="3 — Call-to-Action" content={parsed.cta} icon={ChevronRight} accent="cta" />
                    <AnalysisBlock label="4 — Format" content={parsed.format} icon={Film} accent="format" />
                  </div>
                  <div>
                    <AnalysisBlock label="5 — Engagement Drivers" content={parsed.drivers} icon={Activity} accent="drivers" />
                    <AnalysisBlock label="6 — Script Structure" content={parsed.script} icon={ScrollText} accent="script" />
                    <AnalysisBlock label="7 — Why It Works" content={parsed.why} icon={Lightbulb} accent="why" />
                  </div>
                </div>
              ) : (
                /* Fallback: raw text if sections couldn't be parsed */
                <pre style={{ fontSize: 11, lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', whiteSpace: 'pre-wrap', fontFamily: "'DM Mono', monospace", background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: 14, maxHeight: 320, overflowY: 'auto' }}>
                  {parsed.raw}
                </pre>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};
// ─── Phase Detail Panel (inline, no separate component) ───────────────────────
const PhaseDetailPanel = ({ phaseIdx, apiData, tok, onOpenModal }) => {
  if (!apiData) {
    return (
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', padding: '24px 0' }}>
        Run a pipeline to see detailed data here.
      </div>
    );
  }

  const stages = apiData.stages || [];
  const getStage = (name) => stages.find(s => s.stage_name === name);

  // ── Phase 0: Fetch Product ────────────────────────────────────────────────
  if (phaseIdx === 0) {
    const stage = getStage('fetch_product');
    const meta = stage?.metadata || {};
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
          <StatChip icon={Package} label="Page Length" value={meta.product_page_length ? meta.product_page_length.toLocaleString() + ' chars' : '—'} />
          <StatChip icon={Globe} label="Status" value={stage?.status || '—'} />
          <StatChip icon={Clock} label="Duration" value={
            stage?.started_at && stage?.completed_at
              ? Math.round((new Date(stage.completed_at) - new Date(stage.started_at)) / 1000) + 's'
              : '—'
          } />
        </div>
        <SectionLabel>Product URL</SectionLabel>
        <div style={{
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 4,
          fontSize: 11,
          color: 'rgba(255,255,255,0.5)',
          fontFamily: "'DM Mono', monospace",
          wordBreak: 'break-all',
          lineHeight: 1.6,
        }}>
          {apiData.product_url}
        </div>
      </div>
    );
  }

  // ── Phase 1: Keywords ─────────────────────────────────────────────────────
  if (phaseIdx === 1) {
    const stage = getStage('keywords');
    const kw = apiData.keywords || {};
    const subreddits = kw.subreddits || [];
    const queries = kw.search_queries || [];
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
          <StatChip icon={Hash} label="Subreddits" value={subreddits.length} />
          <StatChip icon={Search} label="Search Queries" value={queries.length} />
          <StatChip icon={Clock} label="Duration" value={
            stage?.started_at && stage?.completed_at
              ? Math.round((new Date(stage.completed_at) - new Date(stage.started_at)) / 1000) + 's'
              : '—'
          } />
        </div>

        <Collapsible title={'Subreddits (' + subreddits.length + ')'} icon={Globe} defaultOpen={true}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {subreddits.map(s => (
              <a
                key={s}
                href={'https://reddit.com/r/' + s}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Pill style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>r/{s}</Pill>
              </a>
            ))}
          </div>
        </Collapsible>

        <Collapsible title={'Search Queries (' + queries.length + ')'} icon={Search} defaultOpen={true}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {queries.map((q, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 3,
              }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Mono', monospace", minWidth: 18 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontFamily: "'DM Mono', monospace" }}>{q}</span>
              </div>
            ))}
          </div>
        </Collapsible>
      </div>
    );
  }

  // ── Phase 2: Video Scrape ─────────────────────────────────────────────────
  if (phaseIdx === 2) {
    const stage = getStage('video_scrape');
    const counts = apiData.scraped_data_summary?.video_counts || {};
    const commentCounts = apiData.scraped_data_summary?.comment_counts || {};
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 20 }}>
          <StatChip icon={Film} label="Total Videos" value={total} />
          <StatChip icon={Youtube} label="YouTube" value={counts.youtube || 0} />
          <StatChip icon={Play} label="YT Shorts" value={counts.youtube_shorts || 0} />
          <StatChip icon={Film} label="TikTok" value={counts.tiktok || 0} />
          <StatChip icon={Film} label="Instagram" value={counts.instagram || 0} />
          <StatChip icon={MessageSquare} label="YT Comments" value={commentCounts.youtube || 0} />
        </div>

        <SectionLabel>Platform Breakdown</SectionLabel>
        {Object.entries(counts).map(([platform, count]) => {
          const pct = total > 0 ? (count / total * 100) : 0;
          return (
            <div key={platform} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize', fontFamily: "'DM Mono', monospace" }}>
                  {platform.replace('_', ' ')}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: "'DM Mono', monospace" }}>{count} ({pct.toFixed(0)}%)</span>
              </div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                <div style={{ height: '100%', width: pct + '%', background: 'rgba(255,255,255,0.4)', borderRadius: 2, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── Phase 3: Download ─────────────────────────────────────────────────────
  if (phaseIdx === 3) {
    const stage = getStage('download');
    const meta = stage?.metadata || {};
    const videos = apiData.videos || [];
    const totalSize = videos.reduce((a, v) => a + (v.file_size_bytes || 0), 0);

    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 20 }}>
          <StatChip icon={Download} label="Total" value={meta.total || videos.length} />
          <StatChip icon={CheckCircle2} label="Success" value={meta.success || '—'} />
          <StatChip icon={Film} label="Total Size" value={(totalSize / 1024 / 1024 / 1024).toFixed(2) + ' GB'} />
          <StatChip icon={Clock} label="Avg Duration" value={
            videos.length > 0
              ? Math.round(videos.reduce((a, v) => a + (v.duration_sec || 0), 0) / videos.length) + 's'
              : '—'
          } />
        </div>

        <SectionLabel>Downloaded Videos ({videos.length})</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {videos.map((v, i) => (
            <div key={v.id || i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 4,
            }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Mono', monospace", minWidth: 22, textAlign: 'right' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <Youtube size={13} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {v.title || v.video_id}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                  <Pill>{v.platform}</Pill>
                  {v.duration_sec && <Pill>{Math.floor(v.duration_sec / 60)}:{String(Math.floor(v.duration_sec % 60)).padStart(2, '0')}</Pill>}
                  {v.file_size_bytes && <Pill>{(v.file_size_bytes / 1024 / 1024).toFixed(1)} MB</Pill>}
                </div>
              </div>
              <a
                href={v.source_url} target="_blank" rel="noopener noreferrer"
                style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >
                <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Phase 4: Analysis ─────────────────────────────────────────────────────
  if (phaseIdx === 4) {
    const stage = getStage('analysis');
    const meta = stage?.metadata || {};
    const videos = apiData.videos || [];
    const analyses = apiData.video_analyses || [];

    // Match analyses to videos by URL
    const analysisMap = {};
    analyses.forEach(a => { analysisMap[a.input] = a.analysis; });

    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
          <StatChip icon={BarChart2} label="Videos Analysed" value={meta.videos_analyzed || analyses.length} />
          <StatChip icon={Film} label="Total Videos" value={videos.length} />
          <StatChip icon={Eye} label="Total Views" value={fmt(videos.reduce((a, v) => a + (v.views || 0), 0))} />
          <StatChip icon={ThumbsUp} label="Total Likes" value={fmt(videos.reduce((a, v) => a + (v.likes || 0), 0))} />
        </div>

        <SectionLabel>Video Analysis ({videos.length} videos)</SectionLabel>
        {videos.sort((a, b) => (b.views || 0) - (a.views || 0)).map((video, i) => (
          <VideoCard
            key={video.id || i}
            video={video}
            analysis={analysisMap[video.source_url]}
            tok={tok}
            onOpenModal={onOpenModal}
          />
        ))}
      </div>
    );
  }

  // ── Phase 5: Report ───────────────────────────────────────────────────────
  if (phaseIdx === 5) {
    const stage = getStage('report');
    const meta = stage?.metadata || {};

    // Parse hashtags from report markdown
    const hashtagMatches = (apiData.report || '').match(/#[A-Za-z][A-Za-z0-9]*/g) || [];
    const uniqueHashtags = [...new Set(hashtagMatches)].slice(0, 25);

    // Parse competitors (look for numbered list with bold names)
    const competitorMatches = [...(apiData.report || '').matchAll(/\d+\.\s+\*\*([^*]+)\*\*/g)];
    const competitors = competitorMatches.slice(0, 8).map(m => m[1]);

    // Parse organic concepts
    const conceptMatches = [...(apiData.report || '').matchAll(/\d+\.\s+\*\*"([^"]+)"\*\*/g)];
    const concepts = conceptMatches.slice(0, 10).map(m => m[1]);

    // Parse comment themes
    const themes = ['Desire', 'Objection', 'Question', 'Comparison', 'Surprise'];
    const commentThemes = themes.map(theme => {
      const regex = new RegExp('#### ' + theme + '\n([\s\S]*?)(?=####|##|$)');
      const match = (apiData.report || '').match(regex);
      if (!match) return { theme, comments: [] };
      const comments = [...match[1].matchAll(/- "([^"]+)"/g)].map(m => m[1]);
      return { theme, comments };
    }).filter(t => t.comments.length > 0);

    // Parse avatars
    const avatarMatches = [...(apiData.report || '').matchAll(/\d+\.\s+\*\*Name:\*\* ([^\n]+)\n\s+- \*\*Demographics:\*\* ([^\n]+)/g)];
    const avatars = avatarMatches.slice(0, 10).map(m => ({ name: m[1].trim(), demo: m[2].trim() }));

    // Selling points
    const spMatches = [...(apiData.report || '').matchAll(/\d+\.\s+([^\n]+)\n/g)];

    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
          <StatChip icon={FileText} label="Report Length" value={meta.report_length ? (meta.report_length / 1000).toFixed(1) + 'K chars' : '—'} />
          <StatChip icon={Hash} label="Hashtags" value={uniqueHashtags.length} />
          <StatChip icon={Users} label="Avatars" value={avatars.length} />
          <StatChip icon={Shield} label="Competitors" value={competitors.length} />
        </div>

        {/* View full reports */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {apiData.report && (
            <button
              onClick={() => onOpenModal({ title: 'Research Report (Popular Videos)', markdownContent: apiData.report_popular || apiData.report })}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3,
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Mono', monospace", transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            >
              <FileText size={13} /> Popular Videos Report
            </button>
          )}
          {apiData.report_all_videos && (
            <button
              onClick={() => onOpenModal({ title: 'Research Report (All Videos)', markdownContent: apiData.report_all_videos })}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3,
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Mono', monospace", transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            >
              <FileSearch size={13} /> All Videos Report
            </button>
          )}
        </div>

        {/* Hashtags */}
        {uniqueHashtags.length > 0 && (
          <Collapsible title={'Hashtags (' + uniqueHashtags.length + ')'} icon={Hash} defaultOpen={true}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {uniqueHashtags.map(h => <Pill key={h}>{h}</Pill>)}
            </div>
          </Collapsible>
        )}

        {/* Competitors */}
        {competitors.length > 0 && (
          <Collapsible title={'Competitors (' + competitors.length + ')'} icon={Shield} defaultOpen={true}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
              {competitors.map((c, i) => (
                <div key={i} style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 4,
                }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>COMPETITOR {String(i + 1).padStart(2, '0')}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{c}</div>
                </div>
              ))}
            </div>
          </Collapsible>
        )}

        {/* Comment Themes */}
        {commentThemes.length > 0 && (
          <Collapsible title={'Audience Comments by Theme'} icon={MessageSquare} defaultOpen={false}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {commentThemes.map(({ theme, comments }) => (
                <div key={theme}>
                  <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
                    {theme}
                  </div>
                  {comments.map((c, i) => (
                    <div key={i} style={{
                      padding: '8px 10px', marginBottom: 6,
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderLeft: '2px solid rgba(255,255,255,0.15)',
                      borderRadius: '0 3px 3px 0',
                      fontSize: 11, color: 'rgba(255,255,255,0.55)',
                      fontStyle: 'italic', lineHeight: 1.6,
                    }}>"{c}"</div>
                  ))}
                </div>
              ))}
            </div>
          </Collapsible>
        )}

        {/* Avatars */}
        {avatars.length > 0 && (
          <Collapsible title={'Customer Avatars (' + avatars.length + ')'} icon={Users} defaultOpen={false}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
              {avatars.map((a, i) => (
                <div key={i} style={{
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 4,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <User size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{a.name}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{a.demo}</div>
                </div>
              ))}
            </div>
          </Collapsible>
        )}

        {/* Organic Concepts */}
        {concepts.length > 0 && (
          <Collapsible title={'Organic Video Concepts (' + concepts.length + ')'} icon={Lightbulb} defaultOpen={false}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {concepts.map((c, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  padding: '9px 12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 3,
                }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Mono', monospace", minWidth: 20, paddingTop: 1 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>
          </Collapsible>
        )}
      </div>
    );
  }

  // ── Phase 6: Scripts ──────────────────────────────────────────────────────
  if (phaseIdx === 6) {
    const stage = getStage('scripts');
    const meta = stage?.metadata || {};
    const scriptsText = apiData.scripts || '';

    // Parse individual scripts
    const scriptBlocks = scriptsText.split(/\n---+\n/).filter(s => s.includes('**Platform:**'));
    const scripts = scriptBlocks.map(block => {
      const platform = (block.match(/\*\*Platform:\*\* ([^\n]+)/) || [])[1] || '—';
      const format = (block.match(/\*\*Format:\*\* ([^\n]+)/) || [])[1] || '—';
      const hook = (block.match(/\*\*Hook:\*\* "([^"]+)"/) || [])[1] || '';
      const cta = (block.match(/\*\*CTA:\*\* "([^"]+)"/) || [])[1] || '';
      const why = (block.match(/\*\*Why It Will Work:\*\* ([^\n]+)/) || [])[1] || '';
      return { platform: platform.trim(), format: format.trim(), hook, cta, why, raw: block };
    });

    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
          <StatChip icon={ScrollText} label="Scripts" value={scripts.length || '—'} />
          <StatChip icon={FileText} label="Total Length" value={meta.scripts_length ? (meta.scripts_length / 1000).toFixed(1) + 'K' : '—'} />
        </div>

        <button
          onClick={() => onOpenModal({ title: 'Generated Scripts', markdownContent: scriptsText })}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Mono', monospace", transition: 'all 0.2s',
            marginBottom: 20,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
        >
          <Maximize2 size={13} /> View Full Scripts
        </button>

        <SectionLabel>Scripts ({scripts.length})</SectionLabel>
        {scripts.map((script, i) => (
          <Collapsible
            key={i}
            title={'Script ' + (i + 1) + ' — ' + script.platform + ' · ' + script.format}
            icon={ScrollText}
            defaultOpen={i === 0}
          >
            {script.hook && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Hook</div>
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderLeft: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '0 4px 4px 0',
                  fontSize: 12, color: 'rgba(255,255,255,0.7)',
                  fontStyle: 'italic', lineHeight: 1.6,
                }}>"{script.hook}"</div>
              </div>
            )}
            {script.cta && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>CTA</div>
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 4,
                  fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6,
                }}>{script.cta}</div>
              </div>
            )}
            {script.why && (
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Why It Works</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{script.why}</div>
              </div>
            )}
            <button
              onClick={() => onOpenModal({ title: 'Script ' + (i + 1) + ' — ' + script.platform, markdownContent: script.raw })}
              style={{
                marginTop: 14, display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 11, color: 'rgba(255,255,255,0.4)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'DM Mono', monospace", padding: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              <FileText size={11} /> View full script →
            </button>
          </Collapsible>
        ))}
      </div>
    );
  }

  return (
    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', padding: '24px 0' }}>
      No detailed data available for this phase.
    </div>
  );
};

// ─── Helper sub-components ───────────────────────────────────────────────────
const GhostBtn = ({ tok, onClick, children }) => {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 12px',
        background: hov ? 'rgba(255,255,255,0.08)' : 'transparent',
        color: hov ? tok.white : tok.dim2,
        border: `1px solid ${hov ? tok.borderHover : tok.border}`,
        borderRadius: 3, fontSize: 11, fontWeight: 600,
        cursor: 'pointer', transition: 'all 0.18s',
        fontFamily: "'DM Mono', monospace",
      }}>
      {children}
    </button>
  );
};

const SectionLabel = ({ tok, children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color:"red" }}>
    {children}
  </div>
);

const StatCard = ({ tok, label, value }) => (
  <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${tok.border}`, borderRadius: 4 }}>
    <div style={{ fontSize: 10, color: tok.dim3, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 900, color: tok.white, letterSpacing: '-0.02em', fontFamily: "'DM Mono', monospace" }}>{value}</div>
  </div>
);

const DataRow = ({ tok, label, value, mono, truncate }) => (
  <div style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: `1px solid rgba(255,255,255,0.04)`, alignItems: 'flex-start' }}>
    <span style={{ fontSize: 11, color: tok.dim3, minWidth: 120, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, paddingTop: 1 }}>{label}</span>
    <span style={{ fontSize: 12, color: tok.dim1, fontFamily: mono ? "'DM Mono', monospace" : 'inherit', overflow: truncate ? 'hidden' : 'visible', textOverflow: truncate ? 'ellipsis' : 'unset', whiteSpace: truncate ? 'nowrap' : 'normal', flex: 1 }}>{value}</span>
  </div>
);

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
                    key={safePhaseIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ marginTop: 16, background: tok.surface, border: `1px solid ${tok.border}`, borderRadius: 6, overflow: 'hidden' }}
                  >
                    {/* Panel header */}
                    <div style={{ padding: '20px 28px', borderBottom: `1px solid ${tok.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {React.createElement(phases[safePhaseIdx].Icon, { size: 16, style: { color: tok.dim2 } })}
                        <span style={{ fontSize: 14, fontWeight: 700, color: tok.white, letterSpacing: '-0.01em' }}>
                          {phases[safePhaseIdx].name}
                        </span>
                        {apiData?.stages?.[safePhaseIdx] && (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 2, background: 'rgba(255,255,255,0.06)', color: tok.dim2, border: `1px solid ${tok.border}`, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                            {apiData.stages[safePhaseIdx].status}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {apiData?.report_popular && safePhaseIdx === 5 && (
                          <GhostBtn tok={tok} onClick={() => setModal({ title: 'Popular Videos Report', markdownContent: apiData.report_popular })}>
                            <Maximize2 size={12} /> Popular Report
                          </GhostBtn>
                        )}
                        {apiData?.report_all_videos && safePhaseIdx === 5 && (
                          <GhostBtn tok={tok} onClick={() => setModal({ title: 'All Videos Report', markdownContent: apiData.report_all_videos })}>
                            <Maximize2 size={12} /> All Videos Report
                          </GhostBtn>
                        )}
                        {apiData?.scripts && safePhaseIdx === 6 && (
                          <GhostBtn tok={tok} onClick={() => setModal({ title: 'Generated Scripts', markdownContent: apiData.scripts })}>
                            <Maximize2 size={12} /> View Scripts
                          </GhostBtn>
                        )}
                        {selectedPhase !== null && (
                          <button onClick={() => setSelectedPhase(null)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: tok.dim2, border: `1px solid ${tok.border}`, borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = tok.borderHover; e.currentTarget.style.color = tok.white; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = tok.border; e.currentTarget.style.color = tok.dim2; }}>
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Panel body */}
                    <div style={{ padding: '20px 24px' }}>
                      <PhaseDetailPanel
                        phaseIdx={safePhaseIdx}
                        apiData={apiData}
                        tok={tok}
                        onOpenModal={setModal}
                      />
                      {!apiData && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: tok.dim3, fontSize: 13 }}>
                          <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                          Processing...
                        </div>
                      )}
                    </div>
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